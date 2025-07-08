import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const users = dbUtils.getUsersByType('user');
  return { users };
};
