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
  default: async ({ params, locals, request }): Promise<{ success?: boolean; error?: string }> => {
    const form = await request.formData();
    const action = form.get('action');
    console.log('[DEBUG] Action received', { action, params });
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      console.log('[DEBUG] Access denied for action');
      return { error: 'Acesso negado.' };
    }
    const id = Number(params.id);
    if (!id) {
      console.log('[DEBUG] Invalid ID for action');
      return { error: 'ID inválido.' };
    }
    if (action === 'approve') {
      dbUtils.updatePaymentStatus(id, 'approved');
      console.log('[DEBUG] Payment approved', { id });
      return { success: true };
    } else if (action === 'reject') {
      dbUtils.updatePaymentStatus(id, 'rejected');
      console.log('[DEBUG] Payment rejected', { id });
      return { success: true };
    } else {
      console.log('[DEBUG] Unknown action', { action });
      return { error: 'Ação desconhecida.' };
    }
  }
};
