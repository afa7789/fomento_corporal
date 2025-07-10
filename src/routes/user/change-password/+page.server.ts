import { dbUtils } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const load: ServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, '/login');
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, '/login');
    const data = await request.formData();
    const currentPassword = (data.get('currentPassword') || '').toString();
    const newPassword = (data.get('newPassword') || '').toString();
    const confirmPassword = (data.get('confirmPassword') || '').toString();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { error: 'Preencha todos os campos.' });
    }
    if (newPassword !== confirmPassword) {
      return fail(400, { error: 'As senhas não coincidem.' });
    }
    const user = dbUtils.getUserById(locals.user.id);
    if (!user) return fail(400, { error: 'Usuário não encontrado.' });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return fail(400, { error: 'Senha atual incorreta.' });
    const hashed = await bcrypt.hash(newPassword, 12);
    dbUtils.updateUser(user.id, user.username, hashed, user.name, user.email, user.type);
    return { success: true };
  }
};
