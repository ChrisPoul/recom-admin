<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { page } from '$app/stores';

	let { users }: { users: User[] } = $props();
</script>

<Table data={users} color={$page.url.searchParams.get('rol') || 'admin'} key="uid" baseUrl="/users">
	{#snippet header()}
			<th scope="col">Nombre</th>
			<th scope="col">Contacto</th>
			<th scope="col">Rol</th>
			<th scope="col">Empresa</th>
			<th scope="col">Status</th>
	{/snippet}
	{#snippet row(user)}
			<td>
				<div class="flex items-center gap-3">
					<div class="h-10 w-10 flex-shrink-0">
						<img
							class="h-10 w-10 rounded-full"
							src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
							alt="User avatar"
						/>
					</div>
					<a href={`/users/${user.uid}`} class="font-medium text-gray-900 hover:text-indigo-600">
						{user.nombre}
					</a>
				</div>
			</td>
			<td>
				<div class="text-gray-900">{user.email}</div>
				<div>{user.celuar}</div>
			</td>
			<td>
				<span
					class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
					style={`background-color: var(--color-${user.rol || 'admin'})`}
				>
					{user.rol || 'N/A'}
				</span>
			</td>
			<td>{user.empresa || 'N/A'}</td>
			<td>
				<span
					class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
						user.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
					}`}
				>
					{#if user.disabled}
						Disabled
					{:else}
						Active
					{/if}
				</span>
			</td>
	{/snippet}
</Table>
