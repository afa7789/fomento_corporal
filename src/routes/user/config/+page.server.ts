import { dbUtils } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import { extname, join } from 'path';

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
    const photo = data.get('photo');
    let photo_url = undefined;

    // Handle photo upload
    if (photo && typeof photo === 'object' && 'arrayBuffer' in photo) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const ext = extname(photo.name) || '.jpg';
      const filename = `user_${locals.user.id}_${randomUUID()}${ext}`;
      const destDir = join('uploads', 'user-photos');
      const dest = join(destDir, filename);
      // Garante que a pasta existe
      await import('fs/promises').then(fs => fs.mkdir(destDir, { recursive: true }));
      await writeFile(dest, buffer);
      photo_url = `/uploads/user-photos/${filename}`;
    }

    // Handle password change
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return fail(400, { error: 'Preencha todos os campos de senha.' });
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
    }

    // Update photo_url if uploaded
    if (photo_url) {
      const user = dbUtils.getUserById(locals.user.id);
      if (user) {
        dbUtils.updateUser(user.id, user.username, user.password, user.name, user.email, user.type);
        const db = dbUtils.getDatabase();
        db.prepare('UPDATE Users SET photo_url = ? WHERE id = ?').run(photo_url, user.id);
      }
    }

    return { success: true };
  }
};
