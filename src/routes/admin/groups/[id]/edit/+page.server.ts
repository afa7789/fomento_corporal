import { dbUtils } from '$lib/db.js';
import { error, redirect, fail } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const groupId = Number(params.id);
  if (!groupId) throw error(400, 'ID do grupo inválido.');
  const groups = dbUtils.getAllGroups();
  const group = groups.find(g => g.id === groupId);
  if (!group) throw error(404, 'Grupo não encontrado.');
  const users = dbUtils.getUsersByType('user');
  return { group, users };
};

export const actions = {
  default: async ({ request, params, locals }) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const groupId = Number(params.id);
    if (!groupId) {
      return fail(400, { error: 'ID do grupo inválido.' }) as any;
    }
    const form = await request.formData();
    const name = form.get('name');
    let users = form.getAll('users');
    // Convert user IDs to numbers
    users = users.map((u) => Number(u)).filter(Boolean);
    if (!name || typeof name !== 'string') {
      return fail(400, { error: 'Nome do grupo é obrigatório.' }) as any;
    }
    // Update group name
    dbUtils.updateGroup(groupId, name);
    // Update group users (remove all, then add selected)
    dbUtils.setGroupUsers(groupId, users);
    throw redirect(303, '/admin/groups');
  }
};
