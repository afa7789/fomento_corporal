import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const db = dbUtils.getDatabase();
  const config = db.prepare('SELECT allow_public_trainings FROM pix_payment_config ORDER BY id LIMIT 1').get();
  return { allowPublicTrainings: !!(config && Number((config as any).allow_public_trainings) === 1) };
};
