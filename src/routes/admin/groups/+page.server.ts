import { dbUtils } from '$lib/db.js';
import { logAction, logError } from '$lib/logger';

export async function load({ url }) {
  try {
    const search = url.searchParams.get('search') || '';
    let groups = dbUtils.getAllGroups();
    if (search) {
      const terms = search.split(',').map(s => s.trim()).filter(Boolean);
      groups = groups.filter(group => {
        if (terms.some(term => group.name.toLowerCase().includes(term))) return true;
        if (group.users && group.users.some(u => terms.some(term => u.name.toLowerCase().includes(term)))) return true;
        return false;
      });
      logAction('search_groups', { search, count: groups.length });
    }
    return { groups, search };
  } catch (error) {
    logError(error, { route: 'admin/groups' });
    return { groups: [], search: '' };
  }
}
