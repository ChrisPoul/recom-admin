import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const userId = params.userId;
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            throw error(404, 'User not found');
        }

        const userData = userDoc.data();
        let services: { id: string, name: string }[] = [];
        if (!userData) return

        if (userData.rol === 'proveedor' && Array.isArray(userData.servicios_ofrecidos) && userData.servicios_ofrecidos.length > 0) {
            // Filter to ensure we only process actual DocumentReference objects
            const serviceReferences = userData.servicios_ofrecidos.filter(ref => ref instanceof DocumentReference) as DocumentReference[];
            
            if (serviceReferences.length > 0) {
                const serviceDocs = await db.getAll(...serviceReferences);
                services = serviceDocs
                    .filter(doc => doc.exists)
                    .map(doc => {
                        const docData = doc.data();
                        return { id: doc.id, name: docData?.name || 'Unnamed Service' };
                    });
            }
        }

        const user = makeSerializable({ uid: userDoc.id, ...userData });

        return {
            user,
            services
        };

    } catch (err: any) {
        console.error("Error loading user:", err);
        if (err.status) {
            throw err;
        }
        throw error(500, 'Failed to load user data.');
    }
}