import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ cookies }) => {
        // Clear the auth cookie
        cookies.delete('auth_token', { path: '/' });
        
        // Redirect to home page
        throw redirect(302, '/');
    }
};
