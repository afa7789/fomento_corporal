import { dbUtils } from '$lib/db';
import { json } from '@sveltejs/kit';

export async function POST({ params, request }) {
    const { active } = await request.json();
    const userId = Number(params.id);
    if (isNaN(userId)) return json({ error: 'ID inválido' }, { status: 400 });

    try {
        dbUtils.setUserActive(userId, active);
        return json({ success: true });
    } catch (e) {
        return json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }
}
