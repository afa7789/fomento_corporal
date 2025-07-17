import { db } from '$lib/db'; // ajuste para seu acesso ao banco
import { fail, redirect } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    // Protege: só ultimate admin pode chamar
    if (!locals?.user || locals.user.type !== 'ultimate_admin') {
        return fail(403, { error: 'Acesso negado.' });
    }

    const data = await request.formData();
    const username = data.get('reset_user');
    if (!username) {
        return fail(400, { error: 'Usuário não informado.' });
    }

    // Atualize a senha no banco (ajuste para seu sistema)
    try {
        await db.user.update({ where: { username }, data: { password: '123' } });
        return redirect(303, '/admin/ultimate?success=Senha resetada para 123');
    } catch (e) {
        return fail(500, { error: 'Erro ao resetar senha.' });
    }
}
