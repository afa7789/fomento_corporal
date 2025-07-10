import { redirect, fail } from '@sveltejs/kit';
import { dbUtils } from '$lib/db.js';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      console.log('[USER PAGE] Usuário não autenticado, redirecionando para login.');
      throw redirect(302, '/login');
    }
    // Get user groups
    const userGroups = dbUtils.getUserGroups(user.id).map((g: { id: number }) => g.id);
    // Query FileAccess for trainings
    const db = dbUtils.getDatabase();
    const stmt = db.prepare(`
      SELECT DISTINCT t.id, t.name, t.file_path, t.created_at
      FROM TrainingInfo t
      JOIN FileAccess fa ON fa.training_id = t.id
      WHERE
        fa.access_type = 'everyone'
        OR (fa.access_type = 'user' AND fa.target_id = ?)
        OR (fa.access_type = 'group' AND fa.target_id IN (${userGroups.length ? userGroups.map(() => '?').join(',') : 'NULL'}))
      ORDER BY t.created_at DESC
    `);
    const params = [user.id, ...userGroups];
    const rawTrainings = stmt.all(...params) as Array<{ id: number; name: string; file_path: string; created_at: string }>;
    const trainings = rawTrainings.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.file_path,
    }));
    // Busca usuário completo (com foto_url)
    const userFull = dbUtils.getUserById(user.id);
    if (!userFull) {
      console.log(`[USER PAGE] Usuário id=${user.id} não encontrado no banco.`);
      return { error: 'Usuário não encontrado.' };
    }
    console.log(`[USER PAGE] Dashboard carregado para usuário id=${user.id}, nome=${userFull.name}`);
    return { user: userFull, trainings };
  } catch (error) {
    console.error('[USER PAGE] Erro ao carregar dashboard:', error);
    return { error: 'Erro ao carregar treinamentos.' };
  }
};
