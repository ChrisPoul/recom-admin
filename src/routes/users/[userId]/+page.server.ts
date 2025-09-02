import { db, makeSerializable } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const userId = params.userId;
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            throw error(404, 'User not found');
        }

        const user: User = makeSerializable({ uid: userDoc.id, ...userDoc.data() });

        return {
            user
        };

    } catch (err: any) {
        console.error("Error loading user:", err);
        // Re-throw SvelteKit errors
        if (err.status) {
            throw err;
        }
        // Throw a generic error for other cases
        throw error(500, 'Failed to load user data.');
    }
}
