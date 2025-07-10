// src/lib/logger.js
// Simple logger for errors and user actions
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

export function logAction(action, details = {}) {
  ensureLogDir();
  const entry = `[${new Date().toISOString()}] ACTION: ${action} ${JSON.stringify(details)}\n`;
  fs.appendFileSync(LOG_FILE, entry);
}

export function logError(error, context = {}) {
  ensureLogDir();
  const entry = `[${new Date().toISOString()}] ERROR: ${error instanceof Error ? error.stack : error} ${JSON.stringify(context)}\n`;
  fs.appendFileSync(LOG_FILE, entry);
}

export function getLogFilePath() {
  return LOG_FILE;
}
