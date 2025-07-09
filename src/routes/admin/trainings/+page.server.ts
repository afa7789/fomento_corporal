import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const related = url.searchParams.get('related')?.toLowerCase() || '';
  let trainings = dbUtils.getTrainings();

  if (search) {
    trainings = trainings.filter(t => t.name.toLowerCase().includes(search));
  }
  if (related) {
    if (["todos", "todo mundo", "everyone"].includes(related.trim().toLowerCase())) {
      // Filtra treinamentos que tenham pelo menos um FileAccess com access_type = 'everyone'
      const fileAccessMap = new Map();
      for (const t of trainings) {
        const accesses = dbUtils.getFileAccessByTraining(t.id);
        if (accesses.some(a => a.access_type === 'everyone')) {
          fileAccessMap.set(t.id, true);
        }
      }
      trainings = trainings.filter(t => fileAccessMap.has(t.id));
    } else {
      trainings = trainings.filter(t => { 
        // 1. Criador
        if (t.creator_name && t.creator_name.toLowerCase().includes(related)) return true;
        // 2. Grupo relacionado
        const accesses = dbUtils.getFileAccessByTraining(t.id);
        for (const a of accesses) {
          if (a.access_type === 'group' && a.target_id) {
            // Buscar nome do grupo
            const group = dbUtils.getAllGroups().find(g => g.id === a.target_id);
            if (group && group.name.toLowerCase().includes(related)) return true;
          }
        }
        return false;
      });
    }
  }
  return { trainings, search, related };
};
