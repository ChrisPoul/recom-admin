import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

export async function load() {
    try {
        const servicesSnap = await db.collection('servicios').get();
        const services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Collect all unique user references from both proveedor and cliente fields
        const userRefs = new Set<DocumentReference>();
        services.forEach(service => {
            if (service.proveedor instanceof DocumentReference) {
                userRefs.add(service.proveedor);
            }
            if (service.cliente instanceof DocumentReference) {
                userRefs.add(service.cliente);
            }
        });

        const userDocsSnap = userRefs.size > 0 ? await db.getAll(...Array.from(userRefs)) : [];
        
        const usersMap = new Map<string, string>();
        userDocsSnap.forEach(doc => {
            if (doc.exists) {
                usersMap.set(doc.id, doc.data()?.nombre || 'Nombre Desconocido');
            }
        });

        // Enrich services data with user names
        const enrichedServices = services.map(service => {
            const proveedorRef = service.proveedor as DocumentReference;
            const clienteRef = service.cliente as DocumentReference;

            return {
                ...service,
                proveedor_nombre: proveedorRef ? usersMap.get(proveedorRef.id) || 'N/A' : 'N/A',
                proveedor_id: proveedorRef?.id || null,
                cliente_nombre: clienteRef ? usersMap.get(clienteRef.id) || 'N/A' : 'N/A',
                cliente_id: clienteRef?.id || null,
            };
        });

        return {
            servicios: makeSerializable(enrichedServices)
        };

    } catch (error) {
        console.error("Error loading services:", error);
        return {
            servicios: [],
            error: "Failed to load services."
        };
    }
}
