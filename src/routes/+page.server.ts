import { db } from '$lib/server/firebase';

export async function load() {
    try {
        // Firestore aggregate queries to get counts
        const activeUsersQuery = db.collection('users').where('disabled', '!=', true).count().get();
        const activeProvidersQuery = db.collection('users').where('rol', '==', 'proveedor').where('disabled', '!=', true).count().get();
        
        // Placeholder for services until schema is known
        // const completedServicesQuery = db.collection('servicios').where('status', '==', 'completado').count().get();
        const completedServicesQuery = Promise.resolve({ data: () => ({ count: 'N/A' }) }); 
        
        // Placeholder for rating until logic is known
        const recomRatingQuery = Promise.resolve({ data: () => ({ count: 'N/A' }) });

        // Await all queries in parallel
        const [
            activeUsersSnap,
            activeProvidersSnap,
            completedServicesSnap,
            recomRatingSnap
        ] = await Promise.all([
            activeUsersQuery,
            activeProvidersQuery,
            completedServicesQuery,
            recomRatingQuery
        ]);

        return {
            stats: {
                activeUsers: activeUsersSnap.data().count,
                activeProviders: activeProvidersSnap.data().count,
                completedServices: completedServicesSnap.data().count,
                recomRating: recomRatingSnap.data().count
            }
        };

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
        return {
            stats: {
                activeUsers: 'Error',
                activeProviders: 'Error',
                completedServices: 'Error',
                recomRating: 'Error'
            },
            error: "Failed to load dashboard statistics."
        };
    }
}
