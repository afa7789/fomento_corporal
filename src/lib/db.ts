// Get all users (active and inactive)
function getAllUsers(): User[] {
    const stmt = db.prepare('SELECT * FROM Users ORDER BY created_at DESC');
    return stmt.all() as User[];
}

// File access for a training (helper for edit page)
function getFileAccessByTraining(trainingId: number): FileAccess[] {
    const stmt = db.prepare('SELECT * FROM FileAccess WHERE training_id = ?');
    return stmt.all(trainingId) as FileAccess[];
}
// Soft-disable/enable user
function setUserActive(id: number, isActive: boolean): void {
    const stmt = db.prepare('UPDATE Users SET is_active = ? WHERE id = ?');
    stmt.run(isActive ? 1 : 0, id);
}

function updatePayment(id: number, amount: number, status: string, date: string): void {
    const stmt = db.prepare(`UPDATE Payments SET amount = ?, status = ?, date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(amount, status, date, id);
}

function deletePayment(id: number): void {
    const stmt = db.prepare('DELETE FROM Payments WHERE id = ?');
    stmt.run(id);
}
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { User, Admin, TrainingInfo, FileAccess, Payment, DatabaseResult, Group } from './types.js';

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
    // Group operations
    setUserActive,
    // getFileAccessByTraining: (trainingId: number) => getFileAccessByTraining(trainingId),
    getAllUsers,
    getFileAccessByTraining,
    getAllGroups: (): (Group & { users: User[] })[] => {
        // Get all groups
        const stmt = db.prepare('SELECT * FROM Groups ORDER BY name ASC');
        const groups = stmt.all() as Group[];
        // For each group, get its users (apenas não-admins)
        const userStmt = db.prepare(`
            SELECT u.* FROM Users u
            JOIN UserGroups ug ON u.id = ug.user_id
            WHERE ug.group_id = ? AND u.type = 'user'
        `);
        return groups.map(group => ({
            ...group,
            users: userStmt.all(group.id) as User[]
        }));
    },
    getUserGroups: (userId: number): Group[] => {
        const stmt = db.prepare(`
            SELECT g.* FROM Groups g
            JOIN UserGroups ug ON g.id = ug.group_id
            WHERE ug.user_id = ?
        `);
        return stmt.all(userId) as Group[];
    },
    setUserGroups: (userId: number, groupIds: number[]): void => {
        // Remove all current groups
        const delStmt = db.prepare('DELETE FROM UserGroups WHERE user_id = ?');
        delStmt.run(userId);
        // Add new groups
        const insStmt = db.prepare('INSERT INTO UserGroups (user_id, group_id) VALUES (?, ?)');
        for (const groupId of groupIds) {
            insStmt.run(userId, groupId);
        }
    },
    // getAllGroups, getUserGroups, setUserGroups are defined above and should not be duplicated here


    // Create a new group and return its id
    createGroup: (name: string): number => {
        const stmt = db.prepare('INSERT INTO Groups (name) VALUES (?)');
        const result = stmt.run(name);
        return result.lastInsertRowid as number;
    },

    // Update group name
    updateGroup: (groupId: number, name: string): void => {
        const stmt = db.prepare('UPDATE Groups SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(name, groupId);
    },

    // Set users for a group (remove all, then add selected)
    setGroupUsers: (groupId: number, userIds: number[]): void => {
        // Remove all current users from group
        const delStmt = db.prepare('DELETE FROM UserGroups WHERE group_id = ?');
        delStmt.run(groupId);
        // Add new users
        const insStmt = db.prepare('INSERT INTO UserGroups (user_id, group_id) VALUES (?, ?)');
        for (const userId of userIds) {
            insStmt.run(userId, groupId);
        }
    },
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
    
    updateTraining: (id: number, name: string, filePath: string | null): void => {
        let sql = 'UPDATE TrainingInfo SET name = ?';
        const params: any[] = [name];
        if (filePath) {
            sql += ', file_path = ?';
            params.push(filePath);
        }
        sql += ', updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        params.push(id);
        const stmt = db.prepare(sql);
        stmt.run(...params);
    },
    
    deleteTraining: (id: number): void => {
        const stmt = db.prepare('DELETE FROM TrainingInfo WHERE id = ?');
        stmt.run(id);
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
    
    getPaymentById: (id: number): Payment | undefined => {
        const stmt = db.prepare(`SELECT * FROM Payments WHERE id = ?`);
        return stmt.get(id) as Payment | undefined;
    },
    updatePaymentStatus: (id: number, status: string): void => {
        const stmt = db.prepare(`UPDATE Payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(status, id);
    },

    updatePayment: (id: number, amount: number, status: string, date: string): void => {
        const stmt = db.prepare(`UPDATE Payments SET amount = ?, status = ?, date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(amount, status, date, id);
    },

    deletePayment: (id: number): void => {
        const stmt = db.prepare('DELETE FROM Payments WHERE id = ?');
        stmt.run(id);
    },
    
    // Admin operations
    deleteAdmin: (id: number): void => {
        const stmt = db.prepare("DELETE FROM Users WHERE id = ? AND type IN ('admin', 'ultimate_admin')");
        stmt.run(id);
    },
    
    // Update user data
    updateUser: (id: number, username: string, hashedPassword: string, name: string, email: string, type: string): void => {
        const stmt = db.prepare(`UPDATE Users SET username = ?, password = ?, name = ?, email = ?, type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(username, hashedPassword, name, email, type, id);
    },
    
    // Delete group and its associations
    deleteGroup: (groupId: number): void => {
        // Remove group from UserGroups first (due to FK)
        const delUserGroups = db.prepare('DELETE FROM UserGroups WHERE group_id = ?');
        delUserGroups.run(groupId);
        // Remove group itself
        const delGroup = db.prepare('DELETE FROM Groups WHERE id = ?');
        delGroup.run(groupId);
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
