<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';

	let { data, form } = $props();

	let isRegisterModalOpen = $state(false);
</script>

<svelte:head>
	<title>Usuarios</title>
</svelte:head>

{#snippet registerForm()}
	<form
		method="POST"
		action="?/register"
		use:enhance={() => {
			return ({ result }) => {
				if (result.type === 'success') {
					isRegisterModalOpen = false;
				}
			};
		}}
		class="p-8 bg-white rounded-lg shadow-xl w-full max-w-md"
	>
		<h2 class="text-2xl font-bold mb-6">Registrar Nuevo Usuario</h2>

		{#if form?.error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
				<strong class="font-bold">Error:</strong>
				<span class="block sm:inline">{form.error}</span>
			</div>
		{/if}

		<div class="space-y-4">
			<div>
				<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
				<input type="text" name="nombre" id="nombre" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
			</div>
            <div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input type="email" name="email" id="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
			</div>
            <div>
				<label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
				<input type="password" name="password" id="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
			</div>
            <div>
				<label for="celuar" class="block text-sm font-medium text-gray-700">Celular</label>
				<input type="tel" name="celuar" id="celuar" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
			</div>
            <div>
				<label for="empresa" class="block text-sm font-medium text-gray-700">Empresa</label>
				<input type="text" name="empresa" id="empresa" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
			</div>
            <div>
                <label for="rol" class="block text-sm font-medium text-gray-700">Rol</label>
                <select name="rol" id="rol" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
		</div>

		<div class="mt-8 flex justify-end">
			<button type="button" onclick={() => isRegisterModalOpen = false} class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
			<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Registrar Usuario</button>
		</div>
	</form>
{/snippet}

<Modal bind:isModalOpen={isRegisterModalOpen} children={registerForm} />

<div class="p-4 sm:p-6 lg:p-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Usuarios Registrados</h1>
		</div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button onclick={() => isRegisterModalOpen = true} type="button" class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">Registrar Usuario</button>
        </div>
	</div>
	<div class="mt-8 flex flex-col">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				{#if data.error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800">Error</h3>
								<div class="mt-2 text-sm text-red-700">
									<p>{data.error}</p>
								</div>
							</div>
						</div>
					</div>
				{:else if data.users && data.users.length > 0}
					<div class="ring-opacity-5 overflow-hidden shadow ring-1 ring-black md:rounded-lg">
						<table class="min-w-full divide-y divide-gray-300">
							<thead class="bg-gray-50">
								<tr>
									<th
										scope="col"
										class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
										>Nombre</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Contacto</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Rol</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Empresa</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Status</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each data.users as user (user.uid)}
									<tr>
										<td class="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
											<div class="flex gap-3 items-center">
												<div class="h-10 w-10 flex-shrink-0">
													<img
														class="h-10 w-10 rounded-full"
														src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
														alt="User avatar"
													/>
												</div>
												<div class="font-medium text-gray-900">
													{user.nombre || 'N/A'}
												</div>
											</div>
										</td>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
											<div class="text-gray-900">{user.email}</div>
											<div class="text-gray-500">{user.celuar}</div>
										</td>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
											>{user.rol || 'N/A'}</td
										>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
											>{user.empresa || 'N/A'}</td
										>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
											{#if user.disabled}
												<span
													class="inline-flex rounded-full bg-red-100 px-2 text-xs leading-5 font-semibold text-red-800"
													>Disabled</span
												>
											{:else}
												<span
													class="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800"
													>Active</span
												>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="py-4 text-center text-gray-500">No users found.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
