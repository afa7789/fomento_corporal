import { dbUtils } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }): Promise<{ payment: any }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const id = Number(params.id);
  if (!id) return { payment: null };
  const payment = dbUtils.getPaymentById(id);
  return { payment };
};

export const actions: Actions = {
  approve: async ({ params, locals }): Promise<{ success?: boolean; error?: string }> => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return { error: 'Acesso negado.' };
    }
    const id = Number(params.id);
    if (!id) return { error: 'ID inválido.' };
    dbUtils.updatePaymentStatus(id, 'approved');
    return { success: true };
  },
  reject: async ({ params, locals }): Promise<{ success?: boolean; error?: string }> => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return { error: 'Acesso negado.' };
    }
    const id = Number(params.id);
    if (!id) return { error: 'ID inválido.' };
    dbUtils.updatePaymentStatus(id, 'rejected');
    return { success: true };
  }
};
