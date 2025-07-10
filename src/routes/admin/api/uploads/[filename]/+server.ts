import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { logAction, logError } from '$lib/logger';

export async function GET({ params, locals }) {
  // Permitir apenas admin/ultimate_admin
  if (!locals.user || !['admin', 'ultimate_admin'].includes(locals.user.type)) {
    logError('Acesso negado', { user: locals.user, filename: params.filename, route: 'admin/api/uploads/[filename]' });
    throw error(403, 'Acesso negado');
  }
  const filename = params.filename;
  if (!filename || filename.includes('..') || filename.includes('/')) {
    logError('Nome de arquivo inválido', { filename, route: 'admin/api/uploads/[filename]' });
    throw error(400, 'Nome de arquivo inválido');
  }
  const filePath = path.resolve('uploads', filename);
  if (!fs.existsSync(filePath)) {
    logError('Arquivo não encontrado', { filename, route: 'admin/api/uploads/[filename]' });
    throw error(404, 'Arquivo não encontrado');
  }
  logAction('download_upload', { filename, user: locals.user?.id });
  const fileStream = fs.createReadStream(filePath);
  // Detecta o tipo de arquivo
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  if (['.jpg','.jpeg'].includes(ext)) contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.txt') contentType = 'text/plain; charset=utf-8';
  return new Response(fileStream as any, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filename}"`
    }
  });
}
