// scripts/migrate.ts
import Database from 'better-sqlite3';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH: string = process.env.DATABASE_PATH || './data.db';
const MIGRATIONS_DIR: string = join(process.cwd(), 'migrations');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create migrations table if not exists
db.exec(`CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

function runMigrations(): void {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f: string) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    // Check if migration already applied
    const already = db.prepare('SELECT 1 FROM migrations WHERE name = ?').get(file);
    if (already) {
      console.log(`- Migration already applied: ${file}`);
      continue;
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    try {
      db.exec(sql);
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
      console.log(`✔ Migration applied: ${file}`);
    } catch (e: any) {
      console.error(`✖ Error in migration ${file}:`, e.message);
    }
  }
}

runMigrations();
db.close();
console.log('All migrations applied.');
