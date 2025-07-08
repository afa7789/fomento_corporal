import { dbUtils } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const users = dbUtils.getAllUsers().filter((u: any) => !u.is_active);
  return { users };
};
