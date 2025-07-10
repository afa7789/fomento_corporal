import { dbUtils } from '$lib/db.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const db = dbUtils.getDatabase();
  // Checa se treinos públicos estão permitidos
  const config = db.prepare('SELECT allow_public_trainings FROM pix_payment_config ORDER BY id LIMIT 1').get();
  if (!config || Number((config as any).allow_public_trainings) !== 1) {
    // Não permitido: retorna lista vazia (ou pode lançar error(404) se preferir)
    return { trainings: [] };
    // ou: throw error(404, 'Treinos públicos desabilitados');
  }
  const stmt = db.prepare('SELECT id, name, file_path FROM TrainingInfo WHERE is_public = 1 ORDER BY created_at DESC');
  const trainings = stmt.all().map((t: any) => ({
    id: t.id,
    name: t.name,
    description: t.file_path
  }));
  return { trainings };
};
