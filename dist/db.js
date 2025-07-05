import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Get database path from environment variables
const DATABASE_PATH = process.env.DATABASE_PATH || './data.db';
// Initialize database connection
let db;
export function initDatabase() {
    if (db) {
        return db;
    }
    try {
        // Create database connection
        db = new Database(DATABASE_PATH);
        // Enable foreign key constraints
        db.pragma('foreign_keys = ON');
        // Set journal mode to WAL for better performance
        db.pragma('journal_mode = WAL');
        console.log(`Database connected: ${DATABASE_PATH}`);
        // Run migrations if this is a new database
        runMigrations();
        return db;
    }
    catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}
function runMigrations() {
    try {
        // Read and execute the init.sql migration
        const migrationPath = join(__dirname, '../../migrations/init.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf-8');
        // Split by semicolon and execute each statement
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        db.transaction(() => {
            for (const statement of statements) {
                try {
                    db.exec(statement);
                }
                catch (error) {
                    console.warn('Migration statement failed (may be expected):', statement.substring(0, 50) + '...');
                }
            }
        })();
        console.log('Database migrations completed successfully');
    }
    catch (error) {
        console.error('Failed to run migrations:', error);
        throw error;
    }
}
// Database utility functions
export const dbUtils = {
    // User operations
    createUser: (username, hashedPassword, name, email) => {
        const stmt = db.prepare(`
            INSERT INTO Users (username, password, name, email) 
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(username, hashedPassword, name, email);
    },
    getUserByUsername: (username) => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE username = ? AND is_active = 1
        `);
        return stmt.get(username);
    },
    getUserById: (id) => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE id = ? AND is_active = 1
        `);
        return stmt.get(id);
    },
    // Admin operations
    createAdmin: (username, hashedPassword, name, email) => {
        const stmt = db.prepare(`
            INSERT INTO Admins (username, password, name, email) 
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(username, hashedPassword, name, email);
    },
    getAdminByUsername: (username) => {
        const stmt = db.prepare(`
            SELECT * FROM Admins 
            WHERE username = ?
        `);
        return stmt.get(username);
    },
    getAdminById: (id) => {
        const stmt = db.prepare(`
            SELECT * FROM Admins 
            WHERE id = ?
        `);
        return stmt.get(id);
    },
    // Training operations
    createTraining: (name, filePath, createdBy) => {
        const stmt = db.prepare(`
            INSERT INTO TrainingInfo (name, file_path, created_by) 
            VALUES (?, ?, ?)
        `);
        return stmt.run(name, filePath, createdBy);
    },
    getTrainings: () => {
        const stmt = db.prepare(`
            SELECT t.*, a.name as admin_name 
            FROM TrainingInfo t 
            JOIN Admins a ON t.created_by = a.id 
            ORDER BY t.created_at DESC
        `);
        return stmt.all();
    },
    getTrainingById: (id) => {
        const stmt = db.prepare(`
            SELECT t.*, a.name as admin_name 
            FROM TrainingInfo t 
            JOIN Admins a ON t.created_by = a.id 
            WHERE t.id = ?
        `);
        return stmt.get(id);
    },
    // File access operations
    setFileAccess: (trainingId, accessType, targetId) => {
        const stmt = db.prepare(`
            INSERT INTO FileAccess (training_id, access_type, target_id) 
            VALUES (?, ?, ?)
        `);
        return stmt.run(trainingId, accessType, targetId || null);
    },
    checkUserAccess: (userId, trainingId) => {
        const stmt = db.prepare(`
            SELECT fa.* FROM FileAccess fa
            WHERE fa.training_id = ? AND (
                fa.access_type = 'everyone' OR
                (fa.access_type = 'user' AND fa.target_id = ?) OR
                (fa.access_type = 'group' AND fa.target_id IN (
                    SELECT group_id FROM UserGroups WHERE user_id = ?
                ))
            )
        `);
        return stmt.get(trainingId, userId, userId);
    },
    // Payment operations
    createPayment: (userId, amount, date, proofFilePath) => {
        const stmt = db.prepare(`
            INSERT INTO Payments (user_id, amount, date, proof_file_path) 
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(userId, amount, date, proofFilePath || null);
    },
    getPaymentsByUser: (userId) => {
        const stmt = db.prepare(`
            SELECT * FROM Payments 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `);
        return stmt.all(userId);
    },
    getAllPayments: () => {
        const stmt = db.prepare(`
            SELECT p.*, u.username, u.name as user_name 
            FROM Payments p 
            JOIN Users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `);
        return stmt.all();
    },
    updatePaymentStatus: (id, status) => {
        const stmt = db.prepare(`
            UPDATE Payments 
            SET status = ? 
            WHERE id = ?
        `);
        return stmt.run(status, id);
    }
};
// Export the database instance
export function getDatabase() {
    if (!db) {
        return initDatabase();
    }
    return db;
}
// Graceful shutdown
process.on('exit', () => {
    if (db) {
        db.close();
    }
});
process.on('SIGINT', () => {
    if (db) {
        db.close();
    }
    process.exit(0);
});
export default getDatabase;
