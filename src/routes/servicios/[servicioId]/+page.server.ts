import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

export async function load({ params }) {
    try {
        const serviceRef = db.collection('servicios').doc(params.servicioId);
        const serviceSnap = await serviceRef.get();

        if (!serviceSnap.exists) {
            return {
                status: 404,
                error: new Error('Servicio not found')
            };
        }

        const service = { id: serviceSnap.id, ...serviceSnap.data() };

        // Fetch user data for proveedor and cliente
        const userRefs: DocumentReference[] = [];
        if (service.proveedor instanceof DocumentReference) {
            userRefs.push(service.proveedor);
        }
        if (service.cliente instanceof DocumentReference) {
            userRefs.push(service.cliente);
        }

        const userDocsSnap = userRefs.length > 0 ? await db.getAll(...userRefs) : [];
        
        const usersMap = new Map<string, string>();
        userDocsSnap.forEach(doc => {
            if (doc.exists) {
                usersMap.set(doc.id, doc.data()?.nombre || 'Nombre Desconocido');
            }
        });

        const proveedorRef = service.proveedor as DocumentReference;
        const clienteRef = service.cliente as DocumentReference;

        const enrichedService = {
            ...service,
            proveedor_nombre: proveedorRef ? usersMap.get(proveedorRef.id) || 'N/A' : 'N/A',
            proveedor_id: proveedorRef?.id || null,
            cliente_nombre: clienteRef ? usersMap.get(clienteRef.id) || 'N/A' : 'N/A',
            cliente_id: clienteRef?.id || null,
        };

        return {
            servicio: makeSerializable(enrichedService)
        };

    } catch (error) {
        console.error("Error loading service:", error);
        return {
            status: 500,
            error: new Error('Failed to load service')
        };
    }
}
