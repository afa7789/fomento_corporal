
import { dbUtils } from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import { unlinkSync } from 'fs';
import { join } from 'path';
import type { Actions } from './$types';
import type { TrainingInfo } from '$lib/types.js';

export const actions: Actions = {
  default: async ({ params, locals }): Promise<{ success?: boolean; error?: string }> => {
    if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
      return fail(403, { error: 'Acesso negado.' }) as any;
    }
    const id = Number(params.id);
    if (!id) return fail(400, { error: 'ID inválido.' }) as any;
    // Get training info before deleting
    const training: TrainingInfo | undefined = dbUtils.getTrainingById(id);
    if (!training) return fail(404, { error: 'Treinamento não encontrado.' }) as any;
    // Delete file from disk if exists
    if (training.file_path) {
      try {
        const filePath = join(process.cwd(), 'uploads', training.file_path);
        unlinkSync(filePath);
      } catch (e) {
        // Ignore file not found, but log other errors
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.error('Erro ao remover arquivo:', e);
        }
      }
    }
    dbUtils.deleteTraining(id);
    return { success: true };
  }
};
