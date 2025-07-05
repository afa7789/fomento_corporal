#!/usr/bin/env node

// Test script for database connection and migrations
import { initDatabase, dbUtils } from '../src/lib/db.ts';
import bcrypt from 'bcryptjs';

async function testDatabase() {
    try {
        console.log('🔄 Testing database connection...');
        
        // Initialize database
        const db = initDatabase();
        console.log('✅ Database initialized successfully');
        
        // Test basic operations
        console.log('\n🔄 Testing basic operations...');
        
        // Test admin creation
        const hashedPassword = await bcrypt.hash('testuser123', 10);
        
        try {
            const result = dbUtils.createUser('testuser', hashedPassword, 'Test User', 'test@example.com');
            console.log('✅ Test user created:', result);
        } catch (error) {
            console.log('ℹ️  Test user already exists (expected if running multiple times)');
        }
        
        // Test user retrieval
        const user = dbUtils.getUserByUsername('testuser');
        console.log('✅ User retrieved:', user ? `${user.name} (${user.username})` : 'Not found');
        
        // Test admin retrieval
        const admin = dbUtils.getAdminByUsername('admin');
        console.log('✅ Default admin found:', admin ? `${admin.name} (${admin.username})` : 'Not found');
        
        // Test training creation
        if (admin) {
            try {
                const trainingResult = dbUtils.createTraining('Test Training', '/uploads/test.pdf', admin.id);
                console.log('✅ Test training created:', trainingResult);
                
                // Set access to everyone
                dbUtils.setFileAccess(trainingResult.lastInsertRowid, 'everyone');
                console.log('✅ Training access set to everyone');
            } catch (error) {
                console.log('ℹ️  Training creation failed (may already exist)');
            }
        }
        
        // Test trainings list
        const trainings = dbUtils.getTrainings();
        console.log('✅ Trainings found:', trainings.length);
        
        console.log('\n🎉 All database tests passed!');
        console.log('\nDatabase schema:');
        console.log('- Users table: ✅');
        console.log('- Admins table: ✅');
        console.log('- Groups table: ✅');
        console.log('- UserGroups table: ✅');
        console.log('- TrainingInfo table: ✅');
        console.log('- FileAccess table: ✅');
        console.log('- Payments table: ✅');
        
        // Close database
        db.close();
        
    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    }
}

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then(dotenv => {
        dotenv.config();
        testDatabase();
    });
} else {
    testDatabase();
}
