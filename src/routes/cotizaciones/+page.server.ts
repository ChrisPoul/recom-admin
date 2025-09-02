import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

// Helper function to safely get document data from a reference
async function getDocData(docRef: DocumentReference) {
    // Check if it is a valid DocumentReference before attempting to fetch
    if (!(docRef instanceof DocumentReference)) {
        return null;
    }
    const docSnap = await docRef.get();
    let test = docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null
    return test;
}

export async function load() {
    try {
        const cotizacionesSnap = await db.collection('Cotizacion').get();
        
        const cotizacionesData = await Promise.all(
            cotizacionesSnap.docs.map(async (doc) => {
                const cotizacion = { id: doc.id, ...doc.data() };

                // Resolve references to get names
                const [cliente, proveedor, servicio] = await Promise.all([
                    getDocData(cotizacion.cliente),
                    getDocData(cotizacion.proveedor),
                    getDocData(cotizacion.servicio)
                ]);

                return {
                    ...cotizacion,
                    cliente_nombre: cliente?.nombre || 'N/A',
                    cliente_id: cliente?.id || null,
                    proveedor_nombre: proveedor?.nombre || 'N/A',
                    proveedor_id: proveedor?.id || null,
                    servicio_nombre: servicio?.nombre_del_servicio || 'N/A', // Assuming service collection uses 'name'
                    servicio_id: servicio?.id || null,
                };
            })
        );

        return {
            cotizaciones: makeSerializable(cotizacionesData)
        };
    } catch (error) {
        console.error("Error loading cotizaciones:", error);
        return {
            cotizaciones: [],
            error: "Failed to load cotizaciones."
        };
    }
}
