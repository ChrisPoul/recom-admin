import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, DocumentReference } from 'firebase-admin/firestore';
import {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY
} from '$env/static/private';

// These would be your service account credentials
const serviceAccount = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
}

// Initialize Firebase Admin SDK
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();
const auth = getAuth();

// Helper to recursively convert Firestore data types to serializable formats
export function makeSerializable(data: any): any {
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

export { db, auth };