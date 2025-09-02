// See https://svelte.dev/docs/kit/types#app.d.ts
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
	}
}

export {};
