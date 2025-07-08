import { dbUtils } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const form = await request.formData();
    const username = form.get('username');
    const password = form.get('password');
    const name = form.get('name');
    const email = form.get('email');
    const type = form.get('type') || 'user';
    if (!username || !password || !name || !email) {
      return fail(400, { error: 'Todos os campos são obrigatórios.' }) as any;
    }
    const hashedPassword = await bcrypt.hash(password.toString(), 12);
    dbUtils.createUser(
      username.toString(),
      hashedPassword,
      name.toString(),
      email.toString(),
      type.toString()
    );
    throw redirect(303, '/admin/users');
  }
};
