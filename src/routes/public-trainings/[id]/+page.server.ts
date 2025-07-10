
import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import { dbUtils } from '$lib/db.js';
import type { TrainingInfo } from '$lib/types';

export const load = async ({ params }: { params: { id: string } }) => {
  const trainingId = params.id;
  if (!trainingId) throw error(400, 'ID de treino inválido');

  const db = dbUtils.getDatabase();
  // Checa se treinos públicos estão permitidos
  const config = db.prepare('SELECT allow_public_trainings FROM pix_payment_config ORDER BY id LIMIT 1').get();
  if (!config || Number((config as any).allow_public_trainings) !== 1) {
    throw error(404, 'Treinos públicos desabilitados');
  }
  // Busca treino público
  const stmt = db.prepare('SELECT id, name, file_path FROM TrainingInfo WHERE id = ? AND is_public = 1 LIMIT 1');
  const training = stmt.get(trainingId) as TrainingInfo | undefined;
  if (!training) {
    throw error(404, 'Treino público não encontrado');
  }

  // Lê o arquivo do treino
  let content = '';
  try {
    let filePath = training.file_path;
    if (!filePath.startsWith('/') && !filePath.startsWith('./') && !filePath.startsWith('../')) {
      filePath = `./uploads/${filePath}`;
    }
    content = await fs.readFile(filePath, 'utf-8');
  } catch (e) {
    console.error('[PUBLIC TRAINING FILE] Falha ao ler arquivo do treino', training.file_path, 'para treino', trainingId, 'Erro:', e);
    throw error(404, 'Arquivo do treino não encontrado');
  }

  return {
    title: training.name,
    content
  };
};
