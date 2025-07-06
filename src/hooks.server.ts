import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/auth.js';
import type { Handle } from '@sveltejs/kit';

// Initialize database lazily
let dbInitialized = false;

async function ensureDatabase() {
    if (!dbInitialized) {
        try {
            const { initDatabase } = await import('$lib/db.js');
            initDatabase();
            dbInitialized = true;
            console.log('✅ Database initialized successfully');
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            // Don't throw here to allow the app to start
        }
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    // Ensure database is initialized
    await ensureDatabase();
    // Get auth token from cookies
    const token = event.cookies.get('auth_token');
    
    // Verify token and add user info to locals
    if (token) {
        const payload = verifyToken(token);
        if (payload) {
            event.locals.user = payload;
        } else {
            // Invalid token, clear it
            event.cookies.delete('auth_token', { path: '/' });
        }
    }
    
    // Get the current path
    const { pathname } = event.url;
    
    // Define protected routes
    const adminRoutes = ['/admin'];
    const userRoutes = ['/user'];
    const publicRoutes = ['/', '/login'];
    
    // Check if route is protected
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
    
    // Handle admin routes
    if (isAdminRoute) {
        if (!event.locals.user) {
            console.log(`Unauthorized access attempt to admin route: ${pathname}`);
            throw redirect(302, '/login');
        }
        
        // Check for ultimate admin routes
        if (pathname.startsWith('/admin/ultimate')) {
            if (event.locals.user.type !== 'ultimate_admin') {
                console.log(`User ${event.locals.user.username} (${event.locals.user.type}) attempted to access ultimate admin route: ${pathname}`);
                throw redirect(302, '/admin');
            }
        } else {
            // Regular admin routes - allow admin and ultimate_admin
            if (!['admin', 'ultimate_admin'].includes(event.locals.user.type)) {
                console.log(`User ${event.locals.user.username} (${event.locals.user.type}) attempted to access admin route: ${pathname}`);
                throw redirect(302, '/user');
            }
        }
    }
    
    // Handle user routes
    if (isUserRoute) {
        if (!event.locals.user) {
            console.log(`Unauthorized access attempt to user route: ${pathname}`);
            throw redirect(302, '/login');
        }
        
        if (event.locals.user.type !== 'user') {
            console.log(`Non-user ${event.locals.user.username} (${event.locals.user.type}) attempted to access user route: ${pathname}`);
            // Redirect admins to their appropriate dashboard
            if (event.locals.user.type === 'ultimate_admin') {
                throw redirect(302, '/admin/ultimate');
            } else if (event.locals.user.type === 'admin') {
                throw redirect(302, '/admin');
            }
        }
    }
    
    // Handle authenticated users trying to access login page
    if (pathname === '/login' && event.locals.user) {
        if (event.locals.user.type === 'ultimate_admin') {
            throw redirect(302, '/admin/ultimate');
        } else if (event.locals.user.type === 'admin') {
            throw redirect(302, '/admin');
        } else {
            throw redirect(302, '/user');
        }
    }
    
    // Continue with request
    const response = await resolve(event);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
};
