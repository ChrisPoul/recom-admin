import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, DocumentReference } from 'firebase-admin/firestore';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async () => {
    try {
        // Get all users from Firebase Auth
        const authUsers = await getAuth().listUsers();

        // Get all user documents from Firestore
        const firestoreUsersSnap = await db.collection('users').get();
        const firestoreUsers = new Map();
        firestoreUsersSnap.forEach(doc => {
            firestoreUsers.set(doc.id, makeSerializable(doc.data()));
        });

        // Merge Auth and Firestore data
        const mergedUsers = authUsers.users.map(authUser => {
            const firestoreData = firestoreUsers.get(authUser.uid) || {};
            return {
                // Auth data
                ...authUser.toJSON(),
                // Firestore data
                firestoreData
            };
        });

        return {
            users: mergedUsers
        };

    } catch (error) {
        console.error("Error listing users:", error);
        return {
            users: [],
            error: "Failed to load users. Make sure your service account credentials are set correctly in .env and the 'users' collection exists in Firestore."
        };
    }
};
