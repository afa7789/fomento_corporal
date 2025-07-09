import { dbUtils } from '$lib/db.js';

export async function load({ url }) {
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  let groups = dbUtils.getAllGroups();
  if (search) {
    const terms = search.split(',').map(s => s.trim()).filter(Boolean);
    groups = groups.filter(group => {
      // Se o nome do grupo bate
      if (terms.some(term => group.name.toLowerCase().includes(term))) return true;
      // Se algum usuário do grupo bate
      if (group.users && group.users.some(u => terms.some(term => u.name.toLowerCase().includes(term)))) return true;
      return false;
    });
  }
  return { groups, search };
}
