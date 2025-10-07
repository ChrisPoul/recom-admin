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
	{/snippet}
	{#snippet row(cotizacion)}
			<td>{cotizacion.nombre}</td>
			<td>{cotizacion.proveedor_nombre}</td>
			<td>{cotizacion.cliente_nombre}</td>
			<td>{cotizacion.precio}</td>
			<td>{cotizacion.tiempo}</td>
	{/snippet}
</Table>
