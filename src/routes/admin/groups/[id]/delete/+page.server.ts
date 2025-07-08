import { dbUtils } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ params, locals }) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const groupId = Number(params.id);
    if (!groupId) {
      return fail(400, { error: 'ID do grupo inválido.' }) as any;
    }
    dbUtils.deleteGroup(groupId);
    throw redirect(303, '/admin/groups');
  }
};
