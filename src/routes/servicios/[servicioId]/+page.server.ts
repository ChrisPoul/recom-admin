
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
        const serviceUserRefs: DocumentReference[] = [];
        if (service.proveedor instanceof DocumentReference) {
            serviceUserRefs.push(service.proveedor);
        }
        if (service.cliente instanceof DocumentReference) {
            serviceUserRefs.push(service.cliente);
        }

        const serviceUserDocsSnap = serviceUserRefs.length > 0 ? await db.getAll(...serviceUserRefs) : [];
        
        const usersMap = new Map<string, string>();
        serviceUserDocsSnap.forEach(doc => {
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
            
            const cotizacionUserRefs: DocumentReference[] = [];
            if (cotizacion.proveedor instanceof DocumentReference) {
                cotizacionUserRefs.push(cotizacion.proveedor);
            }
            if (cotizacion.cliente instanceof DocumentReference) {
                cotizacionUserRefs.push(cotizacion.cliente);
            }

            // Re-use the usersMap if possible, or fetch new users if needed.
            const cotizacionUserDocsSnap = cotizacionUserRefs.length > 0 ? await db.getAll(...cotizacionUserRefs) : [];
            cotizacionUserDocsSnap.forEach(userDoc => {
                if (userDoc.exists && !usersMap.has(userDoc.id)) {
                    usersMap.set(userDoc.id, userDoc.data()?.nombre || 'Nombre Desconocido');
                }
            });

            const cotizacionProveedorRef = cotizacion.proveedor as DocumentReference;
            const cotizacionClienteRef = cotizacion.cliente as DocumentReference;

            return {
                ...cotizacion,
                proveedor_nombre: cotizacionProveedorRef ? usersMap.get(cotizacionProveedorRef.id) || 'N/A' : 'N/A',
                cliente_nombre: cotizacionClienteRef ? usersMap.get(cotizacionClienteRef.id) || 'N/A' : 'N/A',
            };
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
