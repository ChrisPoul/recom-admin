import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

export async function load() {
    try {
        const ticketsSnap = await db.collection('tickets').get();
        const tickets = await Promise.all(ticketsSnap.docs.map(async (doc) => {
            const ticketData = doc.data();
            const ticket = { id: doc.id, ...ticketData } as any;

            const clienteRef = ticket.cliente as DocumentReference;
            const servicioRef = ticket.servicio_referencia as DocumentReference;

            let cliente_nombre = 'N/A';
            let servicio_nombre = 'N/A';

            // Fetch cliente name
            if (clienteRef) {
                const clienteSnap = await clienteRef.get();
                if (clienteSnap.exists) {
                    cliente_nombre = clienteSnap.data()?.nombre || 'Nombre Desconocido';
                }
            }

            // Fetch servicio name
            if (servicioRef) {
                const servicioSnap = await servicioRef.get();
                if (servicioSnap.exists) {
                    const servicioData = servicioSnap.data();
                    servicio_nombre = servicioData?.name || 'Servicio Desconocido';
                }
            }

            return {
                ...ticket,
                cliente_nombre,
                servicio_nombre,
            };
        }));

        return {
            tickets: makeSerializable(tickets)
        };

    } catch (error) {
        console.error("Error loading tickets:", error);
        return {
            status: 500,
            error: new Error('Failed to load tickets')
        };
    }
}