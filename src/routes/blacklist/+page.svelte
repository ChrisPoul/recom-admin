<script lang="ts">
	import UsersTable from '$lib/components/users/UsersTable.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Lista Negra</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Usuarios Bloqueados</h1>
		</div>
	</div>

	{#if data.error}
		<div class="mt-8 rounded-md bg-red-50 p-4">
			<p class="text-sm font-medium text-red-800">{data.error}</p>
		</div>
	{:else}
		<UsersTable users={data.users} />
	{/if}
</div>
