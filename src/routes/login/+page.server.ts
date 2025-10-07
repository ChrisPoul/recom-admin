
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// IMPORTANT: Use environment variables for credentials in a real application
// For example, using $env/static/private
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password';

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // In a real app, you'd create a session token and set it in the cookie.
            // For this example, we'll use a simple session cookie.
            cookies.set('session', 'loggedin', {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            throw redirect(303, '/');
        }

        return fail(400, { error: 'Invalid credentials' });
    }
};
