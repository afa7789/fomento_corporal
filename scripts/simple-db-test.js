// Simple database test
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import bcrypt from 'bcryptjs';

console.log('🔄 Testing database connection...');

try {
    // Create database
    const db = new Database('./data.db');
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    console.log('✅ Database connected successfully');
    
    // Read and execute migration
    const migrationSQL = readFileSync('./migrations/init.sql', 'utf-8');
    
    // Execute migration
    db.exec(migrationSQL);
    
    console.log('✅ Database migrations completed');
    
    // Test basic operations
    const adminStmt = db.prepare('SELECT * FROM Admins WHERE username = ?');
    const admin = adminStmt.get('admin');
    
    if (admin) {
        console.log('✅ Default admin found:', admin.name);
    } else {
        console.log('❌ Default admin not found');
    }
    
    // Test user creation
    const userStmt = db.prepare('INSERT OR IGNORE INTO Users (username, password, name, email) VALUES (?, ?, ?, ?)');
    const hashedPassword = await bcrypt.hash('test123', 10);
    const result = userStmt.run('testuser', hashedPassword, 'Test User', 'test@test.com');
    
    console.log('✅ Test user creation result:', result.changes > 0 ? 'Created' : 'Already exists');
    
    // Test training creation
    if (admin) {
        const trainingStmt = db.prepare('INSERT OR IGNORE INTO TrainingInfo (name, file_path, created_by) VALUES (?, ?, ?)');
        const trainingResult = trainingStmt.run('Test Training', '/uploads/test.pdf', admin.id);
        console.log('✅ Test training creation:', trainingResult.changes > 0 ? 'Created' : 'Already exists');
    }
    
    // List all tables
    const tablesStmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");
    const tables = tablesStmt.all();
    console.log('✅ Database tables:', tables.map(t => t.name).join(', '));
    
    db.close();
    console.log('\n🎉 Database test completed successfully!');
    
} catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
}
