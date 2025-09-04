<script lang="ts">
	import UserForm from './UserForm.svelte';
	import Table from '$lib/components/Table.svelte';
	import { page } from '$app/state';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Usuarios</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Usuarios Registrados</h1>
		</div>
		<UserForm {form} />
	</div>
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
	{:else}
		<Table data={data.users} color={page.url.searchParams.get('rol') || 'admin'} key="uid">
			{#snippet header()}
				<tr>
					<th scope="col">Nombre</th>
					<th scope="col">Contacto</th>
					<th scope="col">Rol</th>
					<th scope="col">Empresa</th>
					<th scope="col">Status</th>
				</tr>
			{/snippet}
			{#snippet row(user)}
				<tr>
					<td>
						<div class="flex items-center gap-3">
							<div class="h-10 w-10 flex-shrink-0">
								<img
									class="h-10 w-10 rounded-full"
									src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
									alt="User avatar"
								/>
							</div>
							<a href="/users/{user.uid}" class="font-medium text-gray-900 hover:text-indigo-600">
								{user.nombre}
							</a>
							<UserForm {user} {form} />
						</div>
					</td>
					<td>
						<div class="text-gray-900">{user.email}</div>
						<div>{user.celuar}</div>
					</td>
					<td>
						<span
							class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-${user.rol || 'gray-400'}`}
						>
							{user.rol || 'N/A'}
						</span>
					</td>
					<td>{user.empresa || 'N/A'}</td>
					<td>
						<span
							class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {user.disabled
								? 'bg-red-100 text-red-800'
								: 'bg-green-100 text-green-800'}"
						>
							{#if user.disabled}
								Disabled
							{:else}
								Active
							{/if}
						</span>
					</td>
				</tr>
			{/snippet}
		</Table>
	{/if}
</div>
