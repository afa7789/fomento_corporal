import { dbUtils } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }): Promise<{ admin: any }> => {
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    throw redirect(302, '/login');
  }
  const id = Number(params.id);
  let admin = null;
  if (id && !isNaN(id)) {
    admin = dbUtils.getAdminById(id);
  }
  return { admin };
};

export const actions: Actions = {
  default: async ({ request, params, locals }): Promise<{ success?: boolean; error?: string }> => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const data = await request.formData();
    const username = String(data.get('username') || '');
    const password = String(data.get('password') || '');
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const id = Number(params.id);
    if (!username || !name || !email) {
      return fail(400, { error: 'Preencha todos os campos obrigatórios.' }) as any;
    }
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    if (id && !isNaN(id)) {
      dbUtils.updateUser(id, username, hashedPassword, name, email, 'admin');
    } else {
      dbUtils.createUser(username, hashedPassword, name, email, 'admin');
    }
    return { success: true };
  }
};
