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

        // Fetch cotizaciones for the service
        const cotizacionesSnap = await db.collection('cotizaciones').where('servicio', '==', serviceRef).get();
        const cotizaciones = await Promise.all(cotizacionesSnap.docs.map(async (doc) => {
            const cotizacion = { id: doc.id, ...doc.data() };
            let proveedorNombre = 'N/A';
            if (cotizacion.proveedor instanceof DocumentReference) {
                const proveedorSnap = await cotizacion.proveedor.get();
                if (proveedorSnap.exists) {
                    proveedorNombre = proveedorSnap.data()?.nombre || 'Nombre Desconocido';
                }
            }
            return { ...cotizacion, proveedor_nombre: proveedorNombre };
        }));

        return {
            servicio: makeSerializable(enrichedService),
            cotizaciones: makeSerializable(cotizaciones)
        };

    } catch (error) {
        console.error("Error loading service:", error);
        return {
            status: 500,
            error: new Error('Failed to load service')
        };
    }
}