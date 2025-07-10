import { dbUtils } from '$lib/db';
import { json } from '@sveltejs/kit';
import { logAction, logError } from '$lib/logger';

export async function DELETE({ params }) {
    const id = Number(params.id);
    if (isNaN(id)) return json({ error: 'ID inválido' }, { status: 400 });
    try {
        dbUtils.deleteTraining(id);
        logAction('delete_training', { id });
        return json({ success: true });
    } catch (e) {
        logError(e, { id, route: 'admin/trainings/[id]/delete' });
        return json({ error: 'Erro ao excluir treinamento' }, { status: 500 });
    }
}
