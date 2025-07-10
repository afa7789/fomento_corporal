import { dbUtils } from '$lib/db.js';
import { json } from '@sveltejs/kit';
import { logError } from '$lib/logger';

export async function GET() {
  try {
    // Apenas usuários ativos comuns
    const users = dbUtils.getUsersByType('user');
    return json(users);
  } catch (error) {
    logError(error, { route: 'api/users' });
    return json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}
