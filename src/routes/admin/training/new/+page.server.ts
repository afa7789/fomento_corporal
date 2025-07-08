import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const groups = dbUtils.getAllGroups();
  const users = dbUtils.getUsersByType('user');
  return { groups, users };
};
import { dbUtils } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const data = await request.formData();
    const name = data.get('name');
    const fileContent = data.get('file_content');
    const everyone = data.get('everyone');
    const groups = data.getAll('groups');
    const users = data.getAll('users');
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return fail(400, { error: 'Nome do treinamento inválido.' }) as any;
    }
    if (!fileContent || typeof fileContent !== 'string' || fileContent.trim().length < 1) {
      return fail(400, { error: 'Conteúdo do arquivo é obrigatório.' }) as any;
    }
    // Salvar arquivo em uploads/
    const fs = await import('fs/promises');
    const path = await import('path');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const fileName = `training_${Date.now()}.txt`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, fileContent, 'utf-8');
    // Salvar treinamento
    const result = dbUtils.createTraining(name, fileName, locals.user.id);
    const trainingId = result.lastInsertRowid;
    // Salvar acessos
    if (everyone) {
      dbUtils.setFileAccess(trainingId, 'everyone');
    }
    if (groups && Array.isArray(groups)) {
      for (const groupId of groups) {
        dbUtils.setFileAccess(trainingId, 'group', Number(groupId));
      }
    } else if (groups) {
      dbUtils.setFileAccess(trainingId, 'group', Number(groups));
    }
    if (users && Array.isArray(users)) {
      for (const userId of users) {
        dbUtils.setFileAccess(trainingId, 'user', Number(userId));
      }
    } else if (users) {
      dbUtils.setFileAccess(trainingId, 'user', Number(users));
    }
    return { success: true };
  }
};
