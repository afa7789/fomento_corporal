import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }): Promise<{ payments: any[]; status: string; sort: string }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const status = url.searchParams.get('status') || '';
  const sort = url.searchParams.get('sort') || 'desc';
  let payments = await dbUtils.getAllPayments();
  if (status) {
    payments = payments.filter((p) => p.status === status);
  }
  payments = payments.sort((a, b) => {
    if (sort === 'asc') return a.created_at.localeCompare(b.created_at);
    return b.created_at.localeCompare(a.created_at);
  });
  return { payments, status, sort };
};
