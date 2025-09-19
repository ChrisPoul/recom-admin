import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

export async function load() {
    try {
        const cotizacionesSnap = await db.collection('Cotizacion').get();
        const cotizaciones = await Promise.all(cotizacionesSnap.docs.map(async (doc) => {
            const cotizacion = { id: doc.id, ...doc.data() };
            
            const userRefs: DocumentReference[] = [];
            if (cotizacion.proveedor instanceof DocumentReference) {
                userRefs.push(cotizacion.proveedor);
            }
            if (cotizacion.cliente instanceof DocumentReference) {
                userRefs.push(cotizacion.cliente);
            }

            const userDocsSnap = userRefs.length > 0 ? await db.getAll(...userRefs) : [];
            
            const usersMap = new Map<string, string>();
            userDocsSnap.forEach(userDoc => {
                if (userDoc.exists) {
                    usersMap.set(userDoc.id, userDoc.data()?.nombre || 'Nombre Desconocido');
                }
            });

            const proveedorRef = cotizacion.proveedor as DocumentReference;
            const clienteRef = cotizacion.cliente as DocumentReference;

            return {
                ...cotizacion,
                proveedor_nombre: proveedorRef ? usersMap.get(proveedorRef.id) || 'N/A' : 'N/A',
                cliente_nombre: clienteRef ? usersMap.get(clienteRef.id) || 'N/A' : 'N/A',
            };
        }));

        return {
            cotizaciones: makeSerializable(cotizaciones)
        };

    } catch (error) {
        console.error("Error loading cotizaciones:", error);
        return {
            status: 500,
            error: new Error('Failed to load cotizaciones')
        };
    }
}