import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { dbUtils } from '$lib/db.js';
import { verifyToken } from '$lib/auth.js';
import type { Actions, PageServerLoad } from './$types';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123secure';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    
    if (token) {
        try {
            const user = verifyToken(token);
            if (user && user.type === 'ultimate_admin') {
                // User is already authenticated as ultimate admin
                return {
                    authenticated: true,
                    user: user
                };
            }
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }
    
    // Not authenticated or invalid token
    return {
        authenticated: false
    };
};

export const actions: Actions = {
    authenticate: async ({ request }) => {
        try {
            const data = await request.formData();
            const ultimate_password = data.get('ultimate_password')?.toString();
            
            if (!ultimate_password) {
                return fail(400, {
                    error: 'SENHA É OBRIGATÓRIA'
                });
            }
            
            if (ultimate_password !== ADMIN_PASSWORD) {
                return fail(401, {
                    error: 'SENHA ULTIMATE INCORRETA'
                });
            }
            
            return {
                authenticated: true,
                success: 'ACESSO LIBERADO - MODO ULTIMATE ATIVO'
            };
            
        } catch (error) {
            console.error('Ultimate auth error:', error);
            return fail(500, {
                error: 'ERRO INTERNO DO SERVIDOR'
            });
        }
    },
    
    create_admin: async ({ request }) => {
        try {
            const data = await request.formData();
            const username = data.get('username')?.toString();
            const password = data.get('password')?.toString();
            const name = data.get('name')?.toString();
            const email = data.get('email')?.toString();
            const userType = data.get('user_type')?.toString() as 'admin' | 'ultimate_admin';
            
            if (!username || !password || !name || !email || !userType) {
                return fail(400, {
                    error: 'TODOS OS CAMPOS SÃO OBRIGATÓRIOS',
                    authenticated: true,
                    username,
                    name,
                    email
                });
            }
            
            // Check if user already exists
            const existingUser = dbUtils.getUserByUsername(username);
            if (existingUser) {
                return fail(409, {
                    error: 'USUÁRIO JÁ EXISTE COM ESTE NOME',
                    authenticated: true,
                    username,
                    name,
                    email
                });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Create admin or ultimate_admin user
            const result = dbUtils.createUser(username, hashedPassword, name, email, userType);
            
            console.log(`New ${userType} created via ultimate mode: ${username}`);
            
            return {
                authenticated: true,
                success: `${userType.toUpperCase()} ${username.toUpperCase()} CRIADO COM SUCESSO`,
                username: '',
                name: '',
                email: ''
            };
            
        } catch (error) {
            console.error('Create admin error:', error);
            return fail(500, {
                error: 'ERRO AO CRIAR ADMIN',
                authenticated: true
            });
        }
    },
    
    reset_admin: async ({ request }) => {
        try {
            const data = await request.formData();
            const reset_username = data.get('reset_username')?.toString();
            const new_password = data.get('new_password')?.toString();
            
            if (!reset_username || !new_password) {
                return fail(400, {
                    error: 'USUÁRIO E NOVA SENHA SÃO OBRIGATÓRIOS',
                    authenticated: true
                });
            }
            
            // Check if admin exists
            const admin = dbUtils.getAdminByUsername(reset_username);
            if (!admin) {
                return fail(404, {
                    error: 'ADMIN NÃO ENCONTRADO',
                    authenticated: true
                });
            }
            
            // Hash new password
            const hashedPassword = await bcrypt.hash(new_password, 12);
            
            // Update password (we'll implement this method)
            // For now, we'll need to add this to dbUtils
            const db = dbUtils.getDatabase();
            // Atualiza senha apenas para usuários do tipo admin
            const stmt = db.prepare("UPDATE Users SET password = ? WHERE username = ? AND type = 'admin'");
            const result = stmt.run(hashedPassword, reset_username);
            if (result.changes === 0) {
                throw new Error('Admin não encontrado ou não é do tipo admin.');
            }
            
            console.log(`Admin password reset via ultimate mode: ${reset_username}`);
            
            return {
                authenticated: true,
                success: `SENHA DO ADMIN ${reset_username.toUpperCase()} RESETADA COM SUCESSO`
            };
            
        } catch (error) {
            console.error('Reset admin error:', error);
            return fail(500, {
                error: 'ERRO AO RESETAR SENHA',
                authenticated: true
            });
        }
    }
};
