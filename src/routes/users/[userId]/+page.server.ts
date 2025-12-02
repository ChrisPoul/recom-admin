
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

        // Fetch tickets for this user
        const userRef = db.collection('users').doc(userId);
        const ticketsSnap = await db.collection('tickets').where('cliente', '==', userRef).get();
        
        const tickets = ticketsSnap.docs.map(doc => {
            const ticketData = doc.data();
            return {
                id: doc.id,
                titulo: ticketData?.titulo || 'Sin título',
                status: ticketData?.status || 'Abierto',
                // Map to asunto for UI compatibility
                asunto: ticketData?.titulo || 'Sin título',
                estado: ticketData?.status || 'Abierto'
            };
        });

        // Fetch direcciones from subcollection
        const direccionesSnap = await db.collection('users').doc(userId).collection('direcciones').get();
        const direcciones = direccionesSnap.docs.map(doc => {
            const direccionData = doc.data();
            return {
                id: doc.id,
                direccion: direccionData?.direccion || '',
                n_exterior: direccionData?.n_exterior || '',
                n_interior: direccionData?.n_interior || ''
            };
        });

        return {
            user,
            services,
            tickets: makeSerializable(tickets),
            direcciones: makeSerializable(direcciones)
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
        const celular = data.get('celular') as string;
        const terminosycondiciones = !!data.get('terminosycondiciones');
        const ine_frontal = data.get('ine_frontal') as string;
        const ine_trasera = data.get('ine_trasera') as string;
        const ine_selfie = data.get('ine_selfie') as string;

        if (!uid) {
            return fail(400, { error: 'UID is required for an update.' });
        }

        // Validate INE images for proveedor role
        if (rol === 'proveedor') {
            if (!ine_frontal || !ine_trasera || !ine_selfie) {
                return fail(400, { error: 'Las 3 imágenes de INE (frontal, trasera y selfie) son requeridas para usuarios proveedor.' });
            }
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
                celular,
                terminosycondiciones
            };

            // Update INE images if rol is proveedor
            if (rol === 'proveedor') {
                if (ine_frontal) updateData.ine_frontal = ine_frontal;
                if (ine_trasera) updateData.ine_trasera = ine_trasera;
                if (ine_selfie) updateData.ine_selfie = ine_selfie;
            } else {
                // Remove INE images if role changed from proveedor to something else
                updateData.ine_frontal = null;
                updateData.ine_trasera = null;
                updateData.ine_selfie = null;
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
