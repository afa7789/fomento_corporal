import { dbUtils } from '$lib/db.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  // Apenas usuários ativos comuns
  const users = dbUtils.getUsersByType('user');
  return json(users);
}
