import { fail, redirect } from '@sveltejs/kit';
import { dbUtils } from '$lib/db.js';
import type { Actions, ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
  // Apenas admin pode acessar
  if (!locals.user || locals.user.type !== 'admin') {
    throw redirect(302, '/login');
  }
  const db = dbUtils.getDatabase();
  // Busca a primeira config (assumindo 1 config global)
  const row = db.prepare('SELECT * FROM pix_payment_config ORDER BY id LIMIT 1').get();
  return { config: row };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user || locals.user.type !== 'admin') {
      throw redirect(302, '/login');
    }
    const data = await request.formData();
    let pix_key = (data.get('pix_key') || '').toString().trim();
    let beneficiary_name = (data.get('beneficiary_name') || '').toString().trim();
    let beneficiary_city = (data.get('beneficiary_city') || '').toString().trim();
    const allow_public_trainings = data.get('allow_public_trainings') === '1' || data.get('allow_public_trainings') === 'on';
    // Normalização básica
    beneficiary_name = beneficiary_name.normalize('NFD').replace(/[^\w\s]/g, '').substring(0, 25).toUpperCase();
    beneficiary_city = beneficiary_city.normalize('NFD').replace(/[^\w\s]/g, '').substring(0, 15).toUpperCase();
    if (!pix_key || !beneficiary_name || !beneficiary_city) {
      return fail(400, { error: 'Todos os campos são obrigatórios.' });
    }
    const db = dbUtils.getDatabase();
    // Verifica se já existe config
    const existing = db.prepare('SELECT * FROM pix_payment_config ORDER BY id LIMIT 1').get();
    if (existing && existing.id != null) {
      db.prepare('UPDATE pix_payment_config SET pix_key=?, beneficiary_name=?, beneficiary_city=?, allow_public_trainings=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
        .run(pix_key, beneficiary_name, beneficiary_city, allow_public_trainings ? 1 : 0, existing.id);
    } else {
      db.prepare('INSERT INTO pix_payment_config (pix_key, beneficiary_name, beneficiary_city, allow_public_trainings) VALUES (?, ?, ?, ?)')
        .run(pix_key, beneficiary_name, beneficiary_city, allow_public_trainings ? 1 : 0);
    }
    return { success: true };
  }
};
