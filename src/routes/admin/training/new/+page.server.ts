import { dbUtils } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }): Promise<{ success?: boolean; error?: string }> => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const data = await request.formData();
    const name = data.get('name');
    const file = data.get('file');
    const accessType = data.get('accessType');
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return fail(400, { error: 'Nome do treinamento inválido.' }) as any;
    }
    if (!file) {
      return fail(400, { error: 'Arquivo é obrigatório.' }) as any;
    }
    // ...existing logic...
    return { success: true };
  }
};
