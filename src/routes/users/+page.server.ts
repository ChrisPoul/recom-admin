
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
        const celular = data.get('celular') as string;
        const terminosycondiciones = !!data.get('terminosycondiciones');
        const ine_frontal = data.get('ine_frontal') as string;
        const ine_trasera = data.get('ine_trasera') as string;
        const ine_selfie = data.get('ine_selfie') as string;

        if (!email || !password || !nombre) {
            return fail(400, { error: 'Email, contraseña y nombre son requeridos.' });
        }

        // Validate INE images for proveedor role
        if (rol === 'proveedor') {
            if (!ine_frontal || !ine_trasera || !ine_selfie) {
                return fail(400, { error: 'Las 3 imágenes de INE (frontal, trasera y selfie) son requeridas para usuarios proveedor.' });
            }
        }

        try {
            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: nombre
            });

            // Build user document data
            const userData: { [key: string]: any } = {
                uid: userRecord.uid,
                nombre,
                email,
                rol,
                empresa,
                celular,
                terminosycondiciones,
                created_time: Timestamp.now()
            };

            // Only add INE images if rol is proveedor
            if (rol === 'proveedor') {
                userData.ine_frontal = ine_frontal;
                userData.ine_trasera = ine_trasera;
                userData.ine_selfie = ine_selfie;
            }

            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set(userData);

            return { success: true, message: 'Usuario creado con éxito' };

        } catch (error: any) {
            console.error("Error creating user:", error);
            return fail(500, { error: error.message });
        }
    }
};
