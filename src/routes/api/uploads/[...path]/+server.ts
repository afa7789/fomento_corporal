import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function GET({ params, locals }) {
  // Permite acesso autenticado (admin, ultimate_admin, user)
  if (!locals.user) {
    throw error(403, 'Acesso negado');
  }
  const relPath = params.path;
  if (!relPath || relPath.includes('..')) {
    throw error(400, 'Caminho inválido');
  }
  // Suporta subpastas (ex: user-photos/arquivo.png)
  const filePath = path.resolve('uploads', ...relPath.split('/'));
  if (!fs.existsSync(filePath)) {
    throw error(404, 'Arquivo não encontrado');
  }
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream';
  if ([ '.jpg', '.jpeg' ].includes(ext)) contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.txt') contentType = 'text/plain; charset=utf-8';
  return new Response(fs.createReadStream(filePath) as any, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${path.basename(filePath)}"`
    }
  });
}
