import { redirect } from '@sveltejs/kit';
import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export interface Payment {
  id: number;
  amount: number;
  status: string;
  date: string;
  info?: string;
}

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const user = locals.user;
    if (!user) throw redirect(302, '/login');
    const db = dbUtils.getDatabase();
    const stmt = db.prepare(`
      SELECT id, amount, status, date, proof_file_path as info
      FROM Payments
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);
    const payments = stmt.all(user.id) as Payment[];
    return { payments };
  } catch (error) {
    console.error('User payments error:', error);
    return { payments: [], error: 'Erro ao carregar pagamentos.' };
  }
};
