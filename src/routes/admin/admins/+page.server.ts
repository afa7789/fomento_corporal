import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }): Promise<{ admins: any[] }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const admins = [
    ...dbUtils.getUsersByType('admin'),
    ...dbUtils.getUsersByType('ultimate_admin')
  ];
  return { admins };
};
