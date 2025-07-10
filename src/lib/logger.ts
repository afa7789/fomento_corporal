// src/lib/logger.ts
// Simple logger for errors and user actions (TypeScript)
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function getCurrentLogFileName(): string {
  const now = new Date();
  // YYYY-MM-DD_HH (12h rotation)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours() < 12 ? '00' : '12';
  return `app_${year}-${month}-${day}_${hour}.log`;
}

function cleanupOldLogs() {
  try {
    if (!fs.existsSync(LOG_DIR)) return;
    const files = fs.readdirSync(LOG_DIR);
    const now = Date.now();
    for (const file of files) {
      if (!file.startsWith('app_') || !file.endsWith('.log')) continue;
      const filePath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filePath);
      // 7 days in ms
      if (now - stats.mtimeMs > 7 * 24 * 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

function writeLog(entry: string) {
  ensureLogDir();
  cleanupOldLogs();
  const logFile = path.join(LOG_DIR, getCurrentLogFileName());
  fs.appendFileSync(logFile, entry);
}

export function logAction(action: string, details: Record<string, unknown> = {}): void {
  const entry = `[${new Date().toISOString()}] ACTION: ${action} ${JSON.stringify(details)}\n`;
  writeLog(entry);
}

export function logError(error: unknown, context: Record<string, unknown> = {}): void {
  const entry = `[${new Date().toISOString()}] ERROR: ${error instanceof Error ? error.stack : error} ${JSON.stringify(context)}\n`;
  writeLog(entry);
}

export function getLogFilePath(): string {
  return path.join(LOG_DIR, getCurrentLogFileName());
}
