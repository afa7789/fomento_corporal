import Database from 'better-sqlite3';
import { readFileSync } from 'fs';

console.log('🔄 Inicializando banco de dados...');
try {
  const db = new Database('./data.db');
  db.pragma('foreign_keys = ON');
  const migrationSQL = readFileSync('./migrations/init.sql', 'utf-8');
  db.exec(migrationSQL);
  db.close();
  console.log('✅ Banco de dados inicializado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao inicializar o banco de dados:', error);
  process.exit(1);
}
