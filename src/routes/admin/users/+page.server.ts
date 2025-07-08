import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }): Promise<{ users: any[]; search: string }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  // Mostra apenas usuários comuns
  let users = dbUtils.getUsersByType('user');
  if (search) {
    users = users.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }
  return { users, search };
};
