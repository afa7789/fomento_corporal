import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { generateToken } from '$lib/auth.js';
import { dbUtils } from '$lib/db.js';
import { ULTIMATE_ADMIN_USERNAME, ULTIMATE_ADMIN_PASSWORD } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username')?.toString();
        const password = data.get('password')?.toString();
        
        console.log(`🔍 Login attempt: username="${username}", password="${password ? '***' : 'empty'}"`);
        
        if (!username || !password) {
            console.log('❌ Missing username or password');
            return fail(400, {
                error: 'USUÁRIO E SENHA SÃO OBRIGATÓRIOS',
                username
            });
        }

        // Check if user exists in Users table
        console.log('🔍 Checking database for user...');
        let dbUser = null;
        let dbError = null;
        
        try {
            dbUser = dbUtils.getUserByUsername(username);
            console.log(`🔍 User found in DB: ${dbUser ? 'YES' : 'NO'}`);
        } catch (error) {
            console.error('❌ Database error during user lookup:', error);
            dbError = error;
        }
        
        // If there was a database error, return it
        if (dbError) {
            return fail(500, {
                error: 'ERRO NO BANCO DE DADOS',
                username
            });
        }
        
        // If user found in DB, validate password and redirect
        if (dbUser) {
            console.log(`🔍 Comparing password for user: ${dbUser.username} (type: ${dbUser.type})`);
            const isValidPassword = await bcrypt.compare(password, dbUser.password);
            console.log(`🔍 Password valid: ${isValidPassword}`);
            
            if (isValidPassword) {
                console.log(`✅ DB User login successful: ${username} (type: ${dbUser.type})`);
                
                // Generate JWT token with user type
                const token = generateToken(dbUser);
                
                // Set HTTP-only cookie
                cookies.set('auth_token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 // 24 hours
                });
                
                // Redirect based on user type
                console.log(`🔄 Redirecting ${dbUser.type} to appropriate dashboard...`);
                switch (dbUser.type) {
                    case 'admin':
                        throw redirect(302, '/admin');
                    case 'user':
                        throw redirect(302, '/user');
                    default:
                        throw redirect(302, '/user');
                }
            }
            
        }

        // Check for ultimate admin from environment variables
        console.log(`🔍 Checking ultimate admin: env_user="${ULTIMATE_ADMIN_USERNAME}", provided_user="${username}"`);
        console.log(`🔍 Ultimate admin password set: ${ULTIMATE_ADMIN_PASSWORD ? 'YES' : 'NO'}`);
        
        if (username === ULTIMATE_ADMIN_USERNAME && password === ULTIMATE_ADMIN_PASSWORD) {
            console.log(`✅ Ultimate admin login successful: ${username}`);
            
            // Create a virtual ultimate admin user for token generation
            const ultimateUser = {
                id: 0, // Special ID for ultimate admin
                username: ULTIMATE_ADMIN_USERNAME,
                name: 'Ultimate Admin',
                type: 'ultimate_admin' as const
            };
            
            const token = generateToken(ultimateUser);
            
            cookies.set('auth_token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });
            
            console.log(`🔄 Redirecting ultimate admin to /admin/ultimate...`);
            throw redirect(302, '/admin/ultimate');
        }

        // If we get here, credentials are invalid
        console.log('❌ Invalid credentials for all authentication methods');
        return fail(401, {
            error: 'USUÁRIO OU SENHA INVÁLIDOS',
            username
        });
    }
};
