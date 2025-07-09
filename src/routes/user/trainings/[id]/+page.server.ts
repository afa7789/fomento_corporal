import { error, redirect } from '@sveltejs/kit';
import fs from 'fs/promises';
import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');
  const trainingId = params.id;
  if (!trainingId) throw error(400, 'ID de treino inválido');

  // Busca grupos do usuário
  const userGroups = dbUtils.getUserGroups(user.id).map((g: { id: number }) => g.id);
  const db = dbUtils.getDatabase();

  // Busca o treino disponível para o usuário
  const stmt = db.prepare(`
    SELECT t.id, t.name, t.file_path
    FROM TrainingInfo t
    JOIN FileAccess fa ON fa.training_id = t.id
    WHERE t.id = ? AND (
      fa.access_type = 'everyone'
      OR (fa.access_type = 'user' AND fa.target_id = ?)
      OR (fa.access_type = 'group' AND fa.target_id IN (${userGroups.length ? userGroups.map(() => '?').join(',') : 'NULL'}))
    )
    LIMIT 1
  `);
  const paramsArr = [trainingId, user.id, ...userGroups];
  const training = stmt.get(...paramsArr);
  if (!training) {
    console.error('[TRAINING ACCESS] Usuário', user.id, 'tentou acessar treino', trainingId, 'mas não tem permissão ou não existe. Grupos do usuário:', userGroups);
    throw error(403, 'Acesso negado ou treino não encontrado');
  }

  // Lê o arquivo do treino
  let content = '';

  try {
    // Corrige caminho relativo: procura em ./uploads se não for absoluto
    let filePath = training.file_path;
    if (!filePath.startsWith('/') && !filePath.startsWith('./') && !filePath.startsWith('../')) {
      filePath = `./uploads/${filePath}`;
    }
    content = await fs.readFile(filePath, 'utf-8');
  } catch (e) {
    console.error('[TRAINING FILE] Falha ao ler arquivo do treino', training.file_path, 'para treino', trainingId, 'do usuário', user.id, 'Erro:', e);
    throw error(404, 'Arquivo do treino não encontrado');
  }

  return {
    title: training.name,
    content
  };
};
