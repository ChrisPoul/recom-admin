import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

export async function load() {
    try {
        // const ticketsSnap = await db.collection('tickets').get();
        // const tickets = await Promise.all(ticketsSnap.docs.map(async (doc) => {
        //     const ticket = { id: doc.id, ...doc.data() };

        //     const userRef = ticket.cliente as DocumentReference;
        //     const serviceRef = ticket.servicio as DocumentReference;
        //     const providerRef = ticket.proveedor as DocumentReference;

        //     let cliente_nombre = 'N/A';
        //     let servicio_nombre = 'N/A';
        //     let proveedor_nombre = 'N/A';

        //     if (userRef) {
        //         const userSnap = await userRef.get();
        //         if (userSnap.exists) {
        //             cliente_nombre = userSnap.data()?.nombre || 'Nombre Desconocido';
        //         }
        //     }

        //     if (serviceRef) {
        //         const serviceSnap = await serviceRef.get();
        //         if (serviceSnap.exists) {
        //             servicio_nombre = serviceSnap.data()?.name || 'Nombre Desconocido';
        //         }
        //     }

        //     if (providerRef) {
        //         const providerSnap = await providerRef.get();
        //         if (providerSnap.exists) {
        //             proveedor_nombre = providerSnap.data()?.nombre || 'Nombre Desconocido';
        //         }
        //     }

        //     return {
        //         ...ticket,
        //         cliente_nombre,
        //         servicio_nombre,
        //         proveedor_nombre,
        //     };
        // }));

        const dummyTickets = [
            {
                id: 'ticket-1',
                cliente_nombre: 'Valentina Cerrillo',
                servicio_nombre: 'Jardinería',
                proveedor_nombre: 'Juan Pérez',
                timestamp: { _seconds: 1693544400 }, // 2023-09-01
                razon: 'Fue muy impuntual'
            },
            {
                id: 'ticket-2',
                cliente_nombre: 'Juan Pérez',
                servicio_nombre: 'Plomería',
                proveedor_nombre: 'Pedro Gómez',
                timestamp: { _seconds: 1693630800 }, // 2023-09-02
                razon: 'No resolvió el problema'
            }
        ];

        return {
            tickets: makeSerializable(dummyTickets)
        };

    } catch (error) {
        console.error("Error loading tickets:", error);
        return {
            status: 500,
            error: new Error('Failed to load tickets')
        };
    }
}