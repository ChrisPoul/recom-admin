import { db, auth, makeSerializable } from '$lib/server/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { fail } from '@sveltejs/kit';

export async function load({ url }) {
    try {
        const rolFilter = url.searchParams.get('rol');
        const searchQuery = url.searchParams.get('query');

        let usersQuery = db.collection('users').orderBy('created_time', 'desc');

        const allUsersSnap = await usersQuery.get();
        let allUsers: User[] = [];
        allUsersSnap.forEach(doc => {
            allUsers.push(makeSerializable({ uid: doc.id, ...doc.data() }));
        });

        const allUserNames = allUsers.map(user => user.nombre);

        let filteredUsers = allUsers;

        if (rolFilter) {
            filteredUsers = filteredUsers.filter(user => user.rol === rolFilter);
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filteredUsers = filteredUsers.filter(user => {
                const nameMatch = user.nombre.toLowerCase().includes(lowercasedQuery);
                const uidMatch = user.uid.includes(searchQuery);
                return nameMatch || uidMatch;
            });
        }

        return {
            users: filteredUsers,
            allUserNames,
            query: searchQuery
        };

    } catch (error) {
        console.error("Error listing users:", error);
        return {
            users: [],
            allUserNames: [],
            error: "Failed to load users. Make sure your service account credentials are set correctly in .env and the 'users' collection exists in Firestore."
        };
    }
};

export const actions = {
    register: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const nombre = data.get('nombre') as string;
        const rol = data.get('rol') as string;
        const empresa = data.get('empresa') as string;
        const celuar = data.get('celuar') as string;
        const cp = data.get('cp') as string;
        const terminosycondiciones = !!data.get('terminosycondiciones');
        const INE = data.get('INE') as string;

        if (!email || !password || !nombre) {
            return fail(400, { error: 'Email, contraseña y nombre son requeridos.' });
        }

        try {
            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: nombre
            });

            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set({
                uid: userRecord.uid,
                nombre,
                email,
                rol,
                empresa,
                celuar,
                cp,
                terminosycondiciones,
                INE,
                created_time: Timestamp.now()
            });

            return { success: true, message: 'Usuario creado con éxito' };

        } catch (error: any) {
            console.error("Error creating user:", error);
            return fail(500, { error: error.message });
        }
    },

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

            return { success: true, message: 'Usuario eliminado con éxito' };

        } catch (error: any) {
            return fail(500, { error: error.message });
        }
    }
};