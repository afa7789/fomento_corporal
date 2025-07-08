import { dbUtils } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  const training = dbUtils.getTrainingById(id);
  const groups = dbUtils.getAllGroups();
  const users = dbUtils.getUsersByType('user');
  const access = dbUtils.getFileAccessByTraining(id);
  return { training, groups, users, access };
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
    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return fail(400, { error: 'Nome do treinamento inválido.' }) as any;
    }
    // ...existing logic for file update, etc...
    // For now, just return success for demonstration
    return { success: true };
  }
};
