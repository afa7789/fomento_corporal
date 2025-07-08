import { dbUtils } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ params, locals }): Promise<{ success?: boolean; error?: string }> => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const id = Number(params.id);
    if (!id) return fail(400, { error: 'ID inválido.' }) as any;
    const admin = dbUtils.getAdminById(id);
    if (!admin) return fail(404, { error: 'Admin não encontrado.' }) as any;
    dbUtils.setUserActive(id, !admin.is_active);
    return { success: true };
  }
};
