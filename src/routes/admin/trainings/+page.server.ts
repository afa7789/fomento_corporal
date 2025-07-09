import { dbUtils } from '$lib/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  let trainings = dbUtils.getTrainings();

  if (search) {
    const terms = search.split(',').map(s => s.trim()).filter(Boolean);
    const allGroups = dbUtils.getAllGroups();
    let resultSet = new Set();
    for (const term of terms) {
      if (["todos", "todo mundo", "everyone"].includes(term)) {
        // Treinamentos compartilhados com todo mundo
        trainings.forEach(t => {
          const accesses = dbUtils.getFileAccessByTraining(t.id);
          if (accesses.some(a => a.access_type === 'everyone')) {
            resultSet.add(t.id);
          }
        });
      }
      trainings.forEach(t => {
        // Nome do treinamento
        if (t.name.toLowerCase().includes(term)) resultSet.add(t.id);
        // Nome do criador
        if (t.creator_name && t.creator_name.toLowerCase().includes(term)) resultSet.add(t.id);
        // Grupo relacionado
        const accesses = dbUtils.getFileAccessByTraining(t.id);
        for (const a of accesses) {
          if (a.access_type === 'group' && a.target_id) {
            const group = allGroups.find(g => g.id === a.target_id);
            if (group && group.name.toLowerCase().includes(term)) {
              resultSet.add(t.id);
            }
          }
        }
      });
    }
    trainings = trainings.filter(t => resultSet.has(t.id));
  }
  return { trainings, search };
};
