<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';

	let { form } = $props();

	let isRegisterModalOpen = $state(false);
</script>

{#snippet registerForm()}
	<form
		method="POST"
		action="?/register"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					isRegisterModalOpen = false;
				}
				await invalidateAll();
			};
		}}
		class="w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
	>
		<h2 class="mb-6 text-2xl font-bold">Registrar Nuevo Usuario</h2>

		{#if form?.error}
			<div
				class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
				role="alert"
			>
				<strong class="font-bold">Error:</strong>
				<span class="block sm:inline">{form.error}</span>
			</div>
		{/if}

		<div class="space-y-4">
			<div>
				<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
				<input
					type="text"
					name="nombre"
					id="nombre"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
					required
				/>
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					name="email"
					id="email"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
					required
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
				<input
					type="password"
					name="password"
					id="password"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
					required
				/>
			</div>
			<div>
				<label for="celuar" class="block text-sm font-medium text-gray-700">Celular</label>
				<input
					type="tel"
					name="celuar"
					id="celuar"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="empresa" class="block text-sm font-medium text-gray-700">Empresa</label>
				<input
					type="text"
					name="empresa"
					id="empresa"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="rol" class="block text-sm font-medium text-gray-700">Rol</label>
				<select
					name="rol"
					id="rol"
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
				>
					<option value="residencial">Residencial</option>
					<option value="comercial">Comercial</option>
					<option value="admin">Admin</option>
				</select>
			</div>
		</div>

		<div class="mt-8 flex justify-end">
			<button
				type="button"
				onclick={() => (isRegisterModalOpen = false)}
				class="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
				>Cancelar</button
			>
			<button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>Registrar Usuario</button
			>
		</div>
	</form>
{/snippet}

<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
	<button
		onclick={() => (isRegisterModalOpen = true)}
		type="button"
		class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
		>Registrar Usuario</button
	>
</div>

<Modal bind:isModalOpen={isRegisterModalOpen} children={registerForm} />
