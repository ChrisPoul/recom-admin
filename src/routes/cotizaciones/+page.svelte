<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Cotizaciones</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Cotizaciones</h1>
		</div>
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
		<Table data={data.cotizaciones} key="id">
			{#snippet header()}
				<tr>
					<th scope="col">Nombre</th>
					<th scope="col">Cliente</th>
					<th scope="col">Proveedor</th>
					<th scope="col">Servicio</th>
					<th scope="col">Precio</th>
					<th scope="col">Tiempo Estimado</th>
					<th scope="col">Horario</th>
				</tr>
			{/snippet}
			{#snippet row(cotizacion)}
				<tr>
					<td>
						<div class="font-medium text-gray-900">{cotizacion.nombre}</div>
					</td>
					<td>
						{#if cotizacion.cliente_id}
							<a
								href={`/users/${cotizacion.cliente_id}`}
								class="text-gray-900 hover:text-indigo-600"
							>
								{cotizacion.cliente_nombre}
							</a>
						{:else}
							<span class="text-gray-500">{cotizacion.cliente_nombre}</span>
						{/if}
					</td>
					<td>
						{#if cotizacion.proveedor_id}
							<a
								href={`/users/${cotizacion.proveedor_id}`}
								class="text-gray-900 hover:text-indigo-600"
							>
								{cotizacion.proveedor_nombre}
							</a>
						{:else}
							<span class="text-gray-500">{cotizacion.proveedor_nombre}</span>
						{/if}
					</td>
					<td>{cotizacion.servicio_nombre}</td>
					<td>{cotizacion.precio}</td>
					<td>{cotizacion.tiempo}</td>
					<td>{cotizacion.horario}</td>
				</tr>
			{/snippet}
		</Table>
	{/if}
</div>
