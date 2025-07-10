import { dbUtils } from '$lib/db.js';
import { logAction, logError } from '$lib/logger';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }): Promise<{ users: any[]; search: string }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  // Mostra apenas usuários comuns
  let users = dbUtils.getUsersByType('user');
  try {
    if (search) {
      const terms = search.split(',').map(s => s.trim()).filter(Boolean);
      users = users.filter(user => {
        if (terms.some(term => user.name.toLowerCase().includes(term))) return true;
        if (terms.some(term => user.username.toLowerCase().includes(term))) return true;
        if (terms.some(term => user.email.toLowerCase().includes(term))) return true;
        return false;
      });
      logAction('search_users', { search, count: users.length });
    }
    return { users, search };
  } catch (error) {
    logError(error, { route: 'admin/users' });
    return { users: [], search: '' };
  }
};
