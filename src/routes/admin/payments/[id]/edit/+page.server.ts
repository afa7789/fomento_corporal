import { dbUtils } from '$lib/db';
import { redirect, fail } from '@sveltejs/kit';

export const load = async ({ params, locals }: any) => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const id = Number(params.id);
  if (!id) return { payment: null, error: 'ID inválido.' };
  const payment = dbUtils.getPaymentById(id);
  if (!payment) return { payment: null, error: 'Pagamento não encontrado.' };
  return { payment };
};

export const actions = {
  update: async ({ request, params, locals }: any) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const id = Number(params.id);
    if (!id) return fail(400, { error: 'ID inválido.' }) as any;
    const form = await request.formData();
    const amount = Number(form.get('amount'));
    const status = String(form.get('status'));
    const date = String(form.get('date'));
    if (isNaN(amount) || !['pending','approved','rejected'].includes(status) || !date) {
      return fail(400, { error: 'Dados inválidos.' }) as any;
    }
    try {
      dbUtils.updatePayment(id, amount, status, date);
      return { success: 'Pagamento atualizado com sucesso.' };
    } catch (e) {
      return fail(500, { error: 'Erro ao atualizar pagamento.' }) as any;
    }
  },
  delete: async ({ params, locals }: any) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const id = Number(params.id);
    if (!id) return fail(400, { error: 'ID inválido.' }) as any;
    try {
      dbUtils.deletePayment(id);
      return { success: true };
    } catch (e) {
      return fail(500, { error: 'Erro ao deletar pagamento.' }) as any;
    }
  }
};
