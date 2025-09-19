<script lang="ts">
	import Table from '$lib/components/Table.svelte';

	let { cotizaciones }: { cotizaciones: any[] } = $props();
</script>

<h3 class="text-2xl leading-6 font-bold text-gray-900">Cotizaciones</h3>
<Table data={cotizaciones} key="id" color="residencial">
	{#snippet header()}
		<tr>
			<th scope="col">ID</th>
			<th scope="col">Proveedor</th>
			<th scope="col">Valor</th>
			<th scope="col">Estado</th>
			<th scope="col"><span class="sr-only">Actions</span></th>
		</tr>
	{/snippet}
	{#snippet row(cotizacion)}
		<tr>
			<td>{cotizacion.id}</td>
			<td>{cotizacion.proveedor_nombre}</td>
			<td>{cotizacion.valor}</td>
			<td>
				<span
					class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
						cotizacion.estado === 'pendiente'
							? 'bg-yellow-100 text-yellow-800'
							: cotizacion.estado === 'aprobada'
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
					}`}
				>
					{cotizacion.estado}
				</span>
			</td>
			<td class="text-right">
				<a
					href={`/cotizaciones/${cotizacion.id}`}
					class="font-medium text-indigo-600 hover:text-indigo-900">Ver</a
				>
			</td>
		</tr>
	{/snippet}
</Table>
