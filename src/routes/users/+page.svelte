<script lang="ts">
	import { invalidateAll } from '$app/navigation';
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

	<form class="mt-4" onsubmit={() => invalidateAll()}>
		<div class="flex rounded-md shadow-sm">
			<div class="relative flex-grow focus-within:z-10">
				<input
					type="search"
					name="query"
					id="query"
                    list="user-suggestions"
					value={data.query || ''}
					class="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="Buscar por nombre o UID"
				/>
                <datalist id="user-suggestions">
                    {#each data.allUserNames as name}
                        <option value={name}></option>
                    {/each}
                </datalist>
			</div>
			<button
				type="submit"
				class="relative -ml-px inline-flex items-center space-x-2 border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
			>
				<span>Buscar</span>
			</button>
            <a href="/users" class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                <span>Limpiar</span>
            </a>
		</div>
	</form>

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