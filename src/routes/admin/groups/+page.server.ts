import { dbUtils } from '$lib/db.js';

export async function load() {
  // Busca todos os grupos e seus usuários
  const groups = dbUtils.getAllGroups();
  return { groups };
}
