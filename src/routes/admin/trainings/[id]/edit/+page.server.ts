import { dbUtils } from '$lib/db.js';
import { readFileSync } from 'fs';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';


export const load: PageServerLoad = ({ params }) => {
  const id = Number(params.id);
  const training = dbUtils.getTrainingById(id);
  const groups = dbUtils.getAllGroups();
  const users = dbUtils.getUsersByType('user');
  const access = dbUtils.getFileAccessByTraining(id);

  let fileContent = '';
  if (training?.file_path) {
    try {
      fileContent = readFileSync(training.file_path, 'utf-8');
    } catch (e) {
      // Se o arquivo não existe, remover o treinamento e acessos relacionados
      dbUtils.deleteTraining(id);
      const db = dbUtils.getDatabase();
      db.prepare('DELETE FROM FileAccess WHERE training_id = ?').run(id);
      // Opcional: pode adicionar um log ou feedback
      throw redirect(303, '/admin/trainings');
    }
  }

  return { training, groups, users, access, fileContent };
};

export const actions: Actions = {
  default: async ({ request, params, locals }): Promise<{ success: boolean; error?: string }> => {
    // Security: Only admin or ultimate_admin can edit
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const id = Number(params.id);
    if (!id) return fail(400, { error: 'ID inválido.' }) as any;
    const data = await request.formData();
    const name = data.get('name');
    const fileContent = data.get('file_content');
    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return fail(400, { error: 'Nome do treinamento inválido.' }) as any;
    }
    if (typeof fileContent !== 'string') {
      return fail(400, { error: 'Conteúdo do arquivo inválido.' }) as any;
    }
    // Get training info
    const training = dbUtils.getTrainingById(id);
    if (!training || !training.file_path) {
      return fail(404, { error: 'Treinamento não encontrado.' }) as any;
    }
    // Write file content to disk, always inside /trainings
    try {
      const { writeFileSync, existsSync, mkdirSync } = await import('fs');
      const { join, dirname, basename } = await import('path');
      const trainingsDir = join(process.cwd(), 'trainings');
      if (!existsSync(trainingsDir)) mkdirSync(trainingsDir);
      // Always save in /trainings with the same basename
      const fileName = basename(training.file_path || `training_${id}.txt`);
      const newPath = join(trainingsDir, fileName);
      writeFileSync(newPath, fileContent, 'utf-8');
      if (newPath !== training.file_path) {
        dbUtils.updateTraining(id, name, newPath);
      }
    } catch (e) {
      return fail(500, { error: 'Erro ao salvar o arquivo.' }) as any;
    }
    // Update training name if changed
    if (name !== training.name) {
      dbUtils.updateTraining(id, name, null); // null = don't change file_path
    }
    // Atualizar permissões de acesso (FileAccess)
    // Limpar acessos antigos
    const db = dbUtils.getDatabase();
    db.prepare('DELETE FROM FileAccess WHERE training_id = ?').run(id);

    // Adicionar novo acesso geral (everyone)
    if (data.get('everyone')) {
      dbUtils.setFileAccess(id, 'everyone');
    }

    // Adicionar grupos
    const groups = data.getAll('groups');
    if (groups && Array.isArray(groups)) {
      for (const groupId of groups) {
        const gid = Number(groupId);
        if (!isNaN(gid)) dbUtils.setFileAccess(id, 'group', gid);
      }
    }

    // Adicionar usuários
    const users = data.getAll('users');
    if (users && Array.isArray(users)) {
      for (const userId of users) {
        const uid = Number(userId);
        if (!isNaN(uid)) dbUtils.setFileAccess(id, 'user', uid);
      }
    }

    // Após salvar, redirecionar para a lista de treinamentos
    throw redirect(303, '/admin/trainings');
  }
};
