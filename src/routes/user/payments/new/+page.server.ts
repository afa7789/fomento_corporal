import { redirect, fail } from '@sveltejs/kit';
import { dbUtils } from '$lib/db.js';
import { randomUUID } from 'crypto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import type { Actions, PageServerLoad } from './$types';

interface PaymentForm {
  amount: number;
  info?: string;
  proofFilePath?: string;
}

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, '/login');
  // Busca config Pix
  const db = dbUtils.getDatabase();
  const row = db.prepare('SELECT * FROM pix_payment_config ORDER BY id LIMIT 1').get();
  return { pixConfig: row };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Usuário não autenticado.' });
    try {
      const data = await request.formData();
      const amount = Number(data.get('amount'));
      const info = data.get('info')?.toString() || '';
      const file = data.get('proof');
      if (!amount || amount <= 0) return fail(400, { error: 'Valor inválido.' });
      if (!file || typeof file === 'string') return fail(400, { error: 'Arquivo de comprovante obrigatório.' });
      // Validate file type and size
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) return fail(400, { error: 'Tipo de arquivo não permitido.' });
      if (file.size > 5 * 1024 * 1024) return fail(400, { error: 'Arquivo muito grande (máx 5MB).' });
      // Save file
      const uploadsDir = './uploads';
      if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);
      const ext = file.name.split('.').pop();
      const filename = `payment_${locals.user.id}_${Date.now()}_${randomUUID()}.${ext}`;
      const filePath = `${uploadsDir}/${filename}`;
      const arrayBuffer = await file.arrayBuffer();
      writeFileSync(filePath, Buffer.from(arrayBuffer));
      // Insert payment
      dbUtils.createPayment(locals.user.id, amount, new Date().toISOString().slice(0, 10), filePath, info);
      return { success: 'Pagamento enviado com sucesso! Aguarde aprovação.' };
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      return fail(500, { error: 'Erro ao processar pagamento.' });
    }
  }
};
