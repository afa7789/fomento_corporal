import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }): Promise<{ trainings: any[]; search: string }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  let trainings = dbUtils.getTrainings();
  if (search) {
    trainings = trainings.filter(t => t.name.toLowerCase().includes(search));
  }
  return { trainings, search };
};
