import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const users = dbUtils.getUsersByType('user');
  return { users };
};


export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const form = await request.formData();
    const name = form.get('name');
    const users = form.getAll('users');
    if (!name) {
      return fail(400, { error: 'Nome do grupo é obrigatório.' }) as any;
    }
    const groupId = dbUtils.createGroup(name.toString());
    if (users && users.length > 0) {
      dbUtils.setGroupUsers(groupId, users.map(String));
    }
    throw redirect(303, '/admin/groups');
  }
};
