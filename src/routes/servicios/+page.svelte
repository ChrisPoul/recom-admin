<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Servicios</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Servicios</h1>
		</div>
	</div>

	{#if data.error}
		<div class="mt-8 rounded-md bg-red-50 p-4">
			<p class="text-sm font-medium text-red-800">{data.error}</p>
		</div>
	{:else}
		<Table data={data.servicios} key="id" color="residencial">
			{#snippet header()}
				<tr>
			<th scope="col">UUID</th>
					<th scope="col" class="sm:pl-6">Fotografía</th>
					<th scope="col">Proveedor</th>
					<th scope="col">Cliente</th>
					<th scope="col">Rol del Servicio</th>
					<th scope="col">Horarios</th>
					<th scope="col">Fecha de Creación</th>
				</tr>
			{/snippet}
			{#snippet row(servicio)}
				<tr>
					<td>
						<a href={`/servicios/${servicio.id}`} class="font-medium text-gray-900 hover:text-indigo-600">
							{servicio.id}
						</a>
					</td>
					<td class="sm:pl-6">
						{#if servicio.fotografias && servicio.fotografias.length > 0}
							<img
								src={servicio.fotografias[0]}
								alt="Foto del servicio"
								class="h-10 w-10 rounded-md object-cover"
							/>
						{:else}
							<div class="h-10 w-10 rounded-md bg-gray-100"></div>
						{/if}
					</td>
					<td>
						{#if servicio.proveedor_id}
							<a
								href={`/users/${servicio.proveedor_id}`}
								class="font-medium text-gray-900 hover:text-indigo-600"
							>
								{servicio.proveedor_nombre}
							</a>
						{:else}
							<span class="text-gray-500">{servicio.proveedor_nombre}</span>
						{/if}
					</td>
					<td>
						{#if servicio.cliente_id}
							<a
								href={`/users/${servicio.cliente_id}`}
								class="font-medium text-gray-900 hover:text-indigo-600"
							>
								{servicio.cliente_nombre}
							</a>
						{:else}
							<span class="text-gray-500">{servicio.cliente_nombre}</span>
						{/if}
					</td>
					<td>{servicio.rol_servicio || 'N/A'}</td>
					<td>
						{#if servicio.horarios && servicio.horarios.length > 0}
							{servicio.horarios.join(', ')}
						{:else}
							N/A
						{/if}
					</td>
					<td>{new Date(servicio.created_time).toLocaleDateString()}</td>
				</tr>
			{/snippet}
		</Table>
	{/if}
</div>
