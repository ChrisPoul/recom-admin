import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

export const load: PageServerLoad = async () => {
    try {
        const userRecords = await getAuth().listUsers();
        const users = userRecords.users.map((user) => {
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                disabled: user.disabled,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime
            };
        });

        return {
            users
        };
    } catch (error) {
        console.error("Error listing users:", error);
        return {
            users: [],
            error: "Failed to load users. Make sure your service account credentials are set correctly in .env"
        };
    }
};
