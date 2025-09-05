<script lang="ts">
	import UserForm from '$lib/components/users/UserForm.svelte';
	import UsersTable from '$lib/components/users/UsersTable.svelte';

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
		<div class="mt-8 rounded-md bg-red-50 p-4">
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
		<UsersTable users={data.users} />
	{/if}
</div>