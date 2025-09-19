<script lang="ts">
	import Table from '$lib/components/Table.svelte';

	let { cotizaciones }: { cotizaciones: any[] } = $props();
</script>

<Table data={cotizaciones} key="id" color="residencial" baseUrl="/cotizaciones">
	{#snippet header()}
			<th scope="col">Nombre</th>
			<th scope="col">Proveedor</th>
			<th scope="col">Cliente</th>
			<th scope="col">Precio</th>
			<th scope="col">Tiempo</th>
			<th scope="col">Estado</th>
	{/snippet}
	{#snippet row(cotizacion)}
			<td>{cotizacion.nombre}</td>
			<td>{cotizacion.proveedor_nombre}</td>
			<td>{cotizacion.cliente_nombre}</td>
			<td>{cotizacion.precio}</td>
			<td>{cotizacion.tiempo}</td>
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
					{cotizacion.estado || 'N/A'}
				</span>
			</td>
	{/snippet}
</Table>
