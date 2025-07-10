import { dbUtils } from '$lib/db';
import { json } from '@sveltejs/kit';
import { logAction, logError } from '$lib/logger';

export async function POST({ params, request }) {
    const { active } = await request.json();
    const userId = Number(params.id);
    if (isNaN(userId)) return json({ error: 'ID inválido' }, { status: 400 });

    try {
        dbUtils.setUserActive(userId, active);
        logAction('toggle_user_active', { userId, active });
        return json({ success: true });
    } catch (e) {
        logError(e, { userId, active, route: 'admin/users/[id]/toggle-active' });
        return json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }
}
