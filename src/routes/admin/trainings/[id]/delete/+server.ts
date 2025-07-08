import { dbUtils } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
    const id = Number(params.id);
    if (isNaN(id)) return json({ error: 'ID inválido' }, { status: 400 });
    try {
        dbUtils.deleteTraining(id);
        return json({ success: true });
    } catch (e) {
        return json({ error: 'Erro ao excluir treinamento' }, { status: 500 });
    }
}
