
import { makeSerializable } from '$lib/server/firebase';

export async function load({ params }) {
    // For now, we'll just return a dummy ticket.
    // Later, we'll fetch the ticket from Firestore using params.ticketId

    const dummyTicket = {
        id: params.ticketId,
        cliente_nombre: 'Valentina Cerrillo',
        servicio_nombre: 'Jardinería',
        proveedor_nombre: 'Juan Pérez',
        timestamp: { _seconds: 1693544400 }, // 2023-09-01
        razon: 'Fue muy impuntual',
        estado: 'abierto'
    };

    return {
        ticket: makeSerializable(dummyTicket)
    };
}
