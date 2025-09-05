// See https://svelte.dev/docs/kit/types#app.d.ts

import type { DocumentReference } from "firebase-admin/firestore";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface User {
		uid: string;
		email: string;
		nombre: string;
		photoURL: string;
		rol: string;
		celular: string;
		empresa: string;
		disabled: boolean;
		created_time: string;
		cp: string;
		terminosycondiciones: boolean;
		INE: string;
		bloqueado?: boolean;
	}
	interface Cotizacion {
		id: string;
		cliente: DocumentReference;
		proveedor: DocumentReference;
		servicio: DocumentReference;
		fecha: string;
		monto: number;
		estado: string;
	}
	interface Servicio {
		id: string;
		proveedor: DocumentReference;
		created_time: string;
		fotografias: string[];
		horarios: string[];
		rol_servicio: string;
		cliente: DocumentReference;
	}
}

export {};
