import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';
import { error, fail } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const ticketDoc = await db.collection('tickets').doc(params.ticketId).get();

        if (!ticketDoc.exists) {
            throw error(404, 'Ticket not found');
        }

        const ticketData = ticketDoc.data();
        const ticket = { id: ticketDoc.id, ...ticketData } as any;

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

        const enrichedTicket = {
            ...ticket,
            cliente_nombre,
            servicio_nombre,
        };

        return {
            ticket: makeSerializable(enrichedTicket)
        };
    } catch (err: any) {
        console.error("Error loading ticket:", err);
        if (err.status) {
            throw err;
        }
        throw error(500, 'Failed to load ticket');
    }
}

export const actions = {
    toggleStatus: async ({ params, request }) => {
        try {
            const ticketId = params.ticketId;
            
            if (!ticketId) {
                return fail(400, { error: 'Ticket ID is required' });
            }

            // Get current ticket status
            const ticketDoc = await db.collection('tickets').doc(ticketId).get();
            if (!ticketDoc.exists) {
                return fail(404, { error: 'Ticket not found' });
            }

            const currentStatus = ticketDoc.data()?.status || 'Abierto';
            const newStatus = currentStatus.toLowerCase() === 'abierto' ? 'Cerrado' : 'Abierto';

            // Update ticket status in Firestore
            await db.collection('tickets').doc(ticketId).update({
                status: newStatus
            });

            return { success: true, message: `Ticket marcado como ${newStatus.toLowerCase()}` };
        } catch (err: any) {
            console.error("Error toggling ticket status:", err);
            return fail(500, { error: err.message || 'Failed to toggle ticket status' });
        }
    }
};
