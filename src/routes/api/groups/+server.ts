import { dbUtils } from '$lib/db.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const groups = dbUtils.getAllGroups();
  return json(groups);
}
