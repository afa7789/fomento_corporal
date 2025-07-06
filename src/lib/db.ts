import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { User, Admin, TrainingInfo, FileAccess, Payment, DatabaseResult } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get database path from environment variables
const DATABASE_PATH = process.env.DATABASE_PATH || './data.db';

// Initialize database connection
let db: Database.Database;

export function initDatabase(): Database.Database {
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
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

function runMigrations(): void {
    try {
        // Read and execute the init.sql migration
        const migrationPath = join(__dirname, '../../migrations/init.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf-8');
        
        // Execute the entire migration as one statement
        db.exec(migrationSQL);
        
        console.log('Database migrations completed successfully');
        
        // Create ultimate admin from environment variables
        createUltimateAdminFromEnv();
        
    } catch (error) {
        console.error('Failed to run migrations:', error);
        throw error;
    }
}

async function createUltimateAdminFromEnv(): Promise<void> {
    try {
        const ultimateUsername = process.env.ULTIMATE_ADMIN_USERNAME;
        const ultimatePassword = process.env.ULTIMATE_ADMIN_PASSWORD;
        const ultimateName = process.env.ULTIMATE_ADMIN_NAME || 'Ultimate Administrator';
        const ultimateEmail = process.env.ULTIMATE_ADMIN_EMAIL || 'ultimate@fomento.com';
        
        if (!ultimateUsername || !ultimatePassword) {
            console.log('Ultimate admin credentials not provided in environment variables');
            return;
        }
        
        // Check if ultimate admin already exists
        const existingUltimate = dbUtils.getUserByUsername(ultimateUsername);
        if (existingUltimate) {
            console.log('Ultimate admin already exists, skipping creation');
            return;
        }
        
        // Import bcrypt dynamically to avoid issues during initialization
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(ultimatePassword, 12);
        
        // Create ultimate admin
        const stmt = db.prepare(`
            INSERT INTO Users (username, password, name, email, type) 
            VALUES (?, ?, ?, ?, 'ultimate_admin')
        `);
        
        stmt.run(ultimateUsername, hashedPassword, ultimateName, ultimateEmail);
        console.log(`✅ Ultimate admin created from environment: ${ultimateUsername}`);
        
    } catch (error) {
        console.error('Failed to create ultimate admin from environment:', error);
    }
}

// Database utility functions
export const dbUtils = {
    // User operations (unified for all user types)
    createUser: (username: string, hashedPassword: string, name: string, email: string, type: 'user' | 'admin' | 'ultimate_admin' = 'user'): DatabaseResult => {
        const stmt = db.prepare(`
            INSERT INTO Users (username, password, name, email, type) 
            VALUES (?, ?, ?, ?, ?)
        `);
        return stmt.run(username, hashedPassword, name, email, type) as DatabaseResult;
    },
    
    getUserByUsername: (username: string): User | undefined => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE username = ? AND is_active = 1
        `);
        return stmt.get(username) as User | undefined;
    },
    
    getUserById: (id: number): User | undefined => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE id = ? AND is_active = 1
        `);
        return stmt.get(id) as User | undefined;
    },
    
    // Get users by type
    getUsersByType: (type: 'user' | 'admin' | 'ultimate_admin'): User[] => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE type = ? AND is_active = 1
            ORDER BY created_at DESC
        `);
        return stmt.all(type) as User[];
    },
    
    // Legacy admin functions (for backward compatibility)
    getAdminByUsername: (username: string): User | undefined => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE username = ? AND type IN ('admin', 'ultimate_admin') AND is_active = 1
        `);
        return stmt.get(username) as User | undefined;
    },
    
    getAdminById: (id: number): User | undefined => {
        const stmt = db.prepare(`
            SELECT * FROM Users 
            WHERE id = ? AND type IN ('admin', 'ultimate_admin') AND is_active = 1
        `);
        return stmt.get(id) as User | undefined;
    },
    
    // Training operations
    createTraining: (name: string, filePath: string, createdBy: number): DatabaseResult => {
        const stmt = db.prepare(`
            INSERT INTO TrainingInfo (name, file_path, created_by) 
            VALUES (?, ?, ?)
        `);
        return stmt.run(name, filePath, createdBy) as DatabaseResult;
    },
    
    getTrainings: (): TrainingInfo[] => {
        const stmt = db.prepare(`
            SELECT t.*, u.name as creator_name 
            FROM TrainingInfo t 
            JOIN Users u ON t.created_by = u.id 
            ORDER BY t.created_at DESC
        `);
        return stmt.all() as TrainingInfo[];
    },
    
    getTrainingById: (id: number): TrainingInfo | undefined => {
        const stmt = db.prepare(`
            SELECT t.*, u.name as creator_name 
            FROM TrainingInfo t 
            JOIN Users u ON t.created_by = u.id 
            WHERE t.id = ?
        `);
        return stmt.get(id) as TrainingInfo | undefined;
    },
    
    // File access operations
    setFileAccess: (trainingId: number, accessType: string, targetId?: number): DatabaseResult => {
        const stmt = db.prepare(`
            INSERT INTO FileAccess (training_id, access_type, target_id) 
            VALUES (?, ?, ?)
        `);
        return stmt.run(trainingId, accessType, targetId || null) as DatabaseResult;
    },
    
    checkUserAccess: (userId: number, trainingId: number): FileAccess | undefined => {
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
        return stmt.get(trainingId, userId, userId) as FileAccess | undefined;
    },
    
    // Payment operations
    createPayment: (userId: number, amount: number, date: string, proofFilePath?: string): DatabaseResult => {
        const stmt = db.prepare(`
            INSERT INTO Payments (user_id, amount, date, proof_file_path) 
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(userId, amount, date, proofFilePath || null) as DatabaseResult;
    },
    
    getPaymentsByUser: (userId: number): Payment[] => {
        const stmt = db.prepare(`
            SELECT * FROM Payments 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `);
        return stmt.all(userId) as Payment[];
    },
    
    getAllPayments: (): Payment[] => {
        const stmt = db.prepare(`
            SELECT p.*, u.username, u.name as user_name 
            FROM Payments p 
            JOIN Users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `);
        return stmt.all() as Payment[];
    },
    
    updatePaymentStatus: (id: number, status: string): DatabaseResult => {
        const stmt = db.prepare(`
            UPDATE Payments 
            SET status = ? 
            WHERE id = ?
        `);
        return stmt.run(status, id) as DatabaseResult;
    },
    
    // Get database instance for custom queries
    getDatabase: () => {
        return db;
    }
};

// Export the database instance
export function getDatabase(): Database.Database {
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
