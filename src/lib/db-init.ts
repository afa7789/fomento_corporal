// Database initialization utility for SvelteKit
import { initDatabase } from './db.js';

// Initialize database on module load
let dbInitialized = false;

export function ensureDatabase() {
    if (!dbInitialized) {
        try {
            initDatabase();
            dbInitialized = true;
            console.log('✅ Database initialized for SvelteKit');
        } catch (error) {
            console.error('❌ Failed to initialize database:', error);
            throw error;
        }
    }
}
