
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');

    if (!session && event.url.pathname !== '/login') {
        throw redirect(303, '/login');
    }

    if (session) {
        event.locals.user = { name: 'Admin', email: 'admin@example.com' };
    }

    const response = await resolve(event);
    return response;
};
