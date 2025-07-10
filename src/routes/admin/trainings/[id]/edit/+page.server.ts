import { dbUtils } from '$lib/db.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';


export const load: PageServerLoad = ({ params }) => {
  const id = Number(params.id);
  const training = dbUtils.getTrainingById(id);
  const groups = dbUtils.getAllGroups();
  const users = dbUtils.getUsersByType('user');
  const access = dbUtils.getFileAccessByTraining(id);

  let fileContent = '';
  let fileError = '';
  if (training?.file_path) {
    try {
      const filePath = join(process.cwd(), 'uploads', training.file_path);
      console.log('[EDIT TRAINING] Tentando ler arquivo do treinamento em:', filePath);
      fileContent = readFileSync(filePath, 'utf-8');
      console.log('[EDIT TRAINING] Arquivo lido com sucesso.');
    } catch (e) {
      console.error('[EDIT TRAINING] Falha ao ler arquivo do treinamento:', e);
      fileError = 'O arquivo do treinamento não foi encontrado. Por favor, envie novamente ou contate o administrador.';
    }
  }

  return { training, groups, users, access, fileContent, fileError };
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
    // is_public
    const is_public = data.get('is_public') === '1' ? 1 : 0;
    // Write file content to disk, always inside /uploads
    try {
      const { writeFileSync, existsSync, mkdirSync } = await import('fs');
      const { join, basename } = await import('path');
      const uploadsDir = join(process.cwd(), 'uploads');
      if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);
      // Always save in /uploads with the same basename
      const fileName = basename(training.file_path || `training_${id}.txt`);
      const newPath = join(uploadsDir, fileName);
      writeFileSync(newPath, fileContent, 'utf-8');
      if (fileName !== training.file_path) {
        dbUtils.updateTraining(id, name, fileName, is_public);
      } else {
        dbUtils.updateTraining(id, name, null, is_public);
      }
    } catch (e) {
      return fail(500, { error: 'Erro ao salvar o arquivo.' }) as any;
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
