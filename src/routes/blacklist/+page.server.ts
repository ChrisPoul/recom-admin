import { db, makeSerializable } from '$lib/server/firebase';

export async function load() {
	try {
		const blacklistQuery = db
			.collection('users')
			.where('bloqueado', '==', true)
			.orderBy('created_time', 'desc');

		const blacklistSnap = await blacklistQuery.get();

		const blacklistedUsers: User[] = [];
		blacklistSnap.forEach((doc) => {
			blacklistedUsers.push(makeSerializable({ uid: doc.id, ...doc.data() }));
		});

		return {
			users: blacklistedUsers
		};
	} catch (error) {
		console.error('Error loading blacklisted users:', error);
		return {
			users: [],
			error: 'Failed to load blacklisted users. You might need to create a new Firestore index.'
		};
	}
}
