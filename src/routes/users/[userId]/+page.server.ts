
import { db, auth, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';
import { error, fail, redirect } from '@sveltejs/kit';

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

        const dummyTickets = [
            { id: 'ticket-1', asunto: 'Problema con mi cuenta', estado: 'abierto' },
            { id: 'ticket-2', asunto: 'Duda sobre facturación', estado: 'cerrado' }
        ];

        return {
            user,
            services,
            tickets: dummyTickets
        };

    } catch (err: any) {
        console.error("Error loading user:", err);
        if (err.status) {
            throw err;
        }
        throw error(500, 'Failed to load user data.');
    }
}

export const actions = {
    edit: async ({ request }) => {
        const data = await request.formData();
        const uid = data.get('uid') as string;
        const nombre = data.get('nombre') as string;
        const rol = data.get('rol') as string;
        const empresa = data.get('empresa') as string;
        const celuar = data.get('celuar') as string;
        const cp = data.get('cp') as string;
        const terminosycondiciones = !!data.get('terminosycondiciones');
        const INE = data.get('INE') as string;

        if (!uid) {
            return fail(400, { error: 'UID is required for an update.' });
        }

        try {
            // Update Auth
            await auth.updateUser(uid, {
                displayName: nombre
            });

            // Build update object for Firestore
            const updateData: { [key: string]: any } = {
                nombre,
                rol,
                empresa,
                celuar,
                cp,
                terminosycondiciones
            };

            // Only update INE if a new URL was provided
            if (INE) {
                updateData.INE = INE;
            }

            // Update Firestore
            await db.collection('users').doc(uid).update(updateData);

            return { success: true, message: 'Usuario actualizado con éxito' };

        } catch (error: any) {
            return fail(500, { error: error.message });
        }
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const uid = data.get('uid') as string;

        if (!uid) {
            return fail(400, { error: 'UID is required for deletion.' });
        }

        try {
            // Delete from Auth
            await auth.deleteUser(uid);
            // Delete from Firestore
            await db.collection('users').doc(uid).delete();

            throw redirect(303, '/users');

        } catch (error: any) {
            if (error.location) {
                throw error; // It's a redirect
            }
            return fail(500, { error: error.message });
        }
    },

    toggleBlock: async ({ request }) => {
        const data = await request.formData();
        const uid = data.get('uid') as string;
        const disabled = data.get('disabled') === 'true';

        if (!uid) {
            return fail(400, { error: 'UID is required to block/unblock.' });
        }

        try {
            await auth.updateUser(uid, { disabled: !disabled });
            await db.collection('users').doc(uid).update({ disabled: !disabled });

            return { success: true };

        } catch (error: any) {
            return fail(500, { error: error.message });
        }
    }
};
