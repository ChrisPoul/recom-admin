import { db, makeSerializable } from '$lib/server/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

export async function load() {
	try {
		const cotizacionesSnap = await db.collection('Cotizacion').get();
		const cotizaciones = await Promise.all(
			cotizacionesSnap.docs.map(async (doc) => {
				const cotizacion = { id: doc.id, ...doc.data() };
				let proveedorNombre = 'N/A';
				if (cotizacion.proveedor instanceof DocumentReference) {
					const proveedorSnap = await cotizacion.proveedor.get();
					if (proveedorSnap.exists) {
						proveedorNombre = proveedorSnap.data()?.nombre || 'Nombre Desconocido';
					}
				}
				return { ...cotizacion, proveedor_nombre: proveedorNombre };
			})
		);

		return {
			cotizaciones: makeSerializable(cotizaciones)
		};
	} catch (error) {
		console.error('Error loading cotizaciones:', error);
		return {
			status: 500,
			error: new Error('Failed to load cotizaciones')
		};
	}
}
