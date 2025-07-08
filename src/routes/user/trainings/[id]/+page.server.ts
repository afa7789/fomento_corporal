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
  if (!training) throw error(403, 'Acesso negado ou treino não encontrado');

  // Lê o arquivo do treino
  let content = '';
  try {
    content = await fs.readFile(training.file_path, 'utf-8');
  } catch (e) {
    throw error(404, 'Arquivo do treino não encontrado');
  }

  return {
    title: training.name,
    content
  };
};
