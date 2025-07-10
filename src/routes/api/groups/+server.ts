import { dbUtils } from '$lib/db.js';
import { json } from '@sveltejs/kit';
import { logError } from '$lib/logger';

export async function GET() {
  try {
    const groups = dbUtils.getAllGroups();
    return json(groups);
  } catch (error) {
    logError(error, { route: 'api/groups' });
    return json({ error: 'Erro ao buscar grupos' }, { status: 500 });
  }
}
