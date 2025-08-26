<script lang="ts">
	import UserForm from './UserForm.svelte';

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
										class="table-header sm:pl-6"
										>Nombre</th
									>
									<th scope="col" class="table-header"
										>Contacto</th
									>
									<th scope="col" class="table-header"
										>Rol</th
									>
									<th scope="col" class="table-header"
										>Empresa</th
									>
									<th scope="col" class="table-header"
										>Status</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each data.users as user ( user.uid )}
									<tr>
										<td class="table-cell sm:pl-6">
											<div class="flex items-center gap-3">
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
										<td class="table-cell">
											<div class="text-gray-900">{user.email}</div>
											<div>{user.celuar}</div>
										</td>
										<td class="table-cell"
											>{user.rol || 'N/A'}</td
										>
										<td class="table-cell"
											>{user.empresa || 'N/A'}</td
										>
										<td class="table-cell">
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
