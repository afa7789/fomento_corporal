import { dbUtils } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const status = url.searchParams.get('status') || '';
  const sort = url.searchParams.get('sort') || 'desc';
  const search = url.searchParams.get('search')?.trim() || '';

  let payments = await dbUtils.getAllPayments();

  // Filter by search (username or user_id, case-insensitive, partial)
  if (search) {
    const searchLower = search.toLowerCase();
    payments = payments.filter(
      (p) =>
        (p.user_name && p.user_name.toLowerCase().includes(searchLower)) ||
        (p.user_id && String(p.user_id).toLowerCase().includes(searchLower))
    );
  }

  // Filter by status
  if (status) {
    payments = payments.filter((p) => p.status === status);
  }

  // Sort
  payments = payments.sort((a, b) => {
    if (sort === 'asc') return a.created_at.localeCompare(b.created_at);
    return b.created_at.localeCompare(a.created_at);
  });

  // Dynamically get available statuses from filtered payments
  const availableStatuses = Array.from(new Set(payments.map((p) => p.status)));

  return { payments, status, sort, search, availableStatuses };
};
