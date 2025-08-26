import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, DocumentReference } from 'firebase-admin/firestore';
import { fail } from '@sveltejs/kit';

// These would be your service account credentials
const serviceAccount = {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
    privateKey: import.meta.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize Firebase Admin SDK
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

// Helper to recursively convert Firestore data types to serializable formats
function makeSerializable(data: any): any {
    if (data === null || data === undefined) {
        return data;
    }

    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }

    if (data instanceof DocumentReference) {
        return data.path;
    }

    if (Array.isArray(data)) {
        return data.map(item => makeSerializable(item));
    }

    if (typeof data === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            newObj[key] = makeSerializable(data[key]);
        }
        return newObj;
    }

    return data;
}

export async function load() {
    try {

        // Get all user documents from Firestore, sorted by creation date
        const firestoreUsersSnap = await db.collection('users').orderBy('created_time', 'desc').get();
        const firestoreUsers: User[] = [];
        firestoreUsersSnap.forEach(doc => {
            firestoreUsers.push(makeSerializable(doc.data()));
        });


        return {
            users: firestoreUsers
        };

    } catch (error) {
        console.error("Error listing users:", error);
        return {
            users: [],
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

        if (!email || !password || !nombre) {
            return fail(400, { error: 'Email, contraseña y nombre son requeridos.' });
        }

        try {
            // Create user in Firebase Auth
            const userRecord = await getAuth().createUser({
                email,
                password,
                displayName: nombre
            });

            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set({
                nombre,
                rol,
                empresa,
                celuar,
                created_time: Timestamp.now()
            });

            return { success: true, message: 'Usuario creado con éxito' };

        } catch (error: any) {
            console.error("Error creating user:", error);
            return fail(500, { error: error.message });
        }
    }
};

