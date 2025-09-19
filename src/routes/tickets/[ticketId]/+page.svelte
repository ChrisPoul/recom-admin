<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	let { data } = $props();
	const { ticket } = data;

	function markAsResolved() {
		// Later, this will update the ticket in Firestore.
		alert('Marcando como resuelto...');
	}
</script>

<svelte:head>
	<title>Ticket: {ticket.id}</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<Card>
		<div class="px-4 py-5 sm:px-6">
			<h3 class="text-2xl leading-6 font-bold text-gray-900">Detalles del Ticket</h3>
		</div>
		<div class="border-t border-gray-200 px-4 py-5 sm:p-0">
			<dl class="sm:divide-y sm:divide-gray-200">
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Usuario</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ticket.cliente_nombre}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Servicio</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ticket.servicio_nombre}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Proveedor</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{ticket.proveedor_nombre}
					</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Creado</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{new Date(ticket.timestamp._seconds * 1000).toLocaleDateString()}
					</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Razón</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ticket.razon}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Estado</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<span
							class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
								ticket.estado === 'abierto'
									? 'bg-yellow-100 text-yellow-800'
									: 'bg-green-100 text-green-800'
							}`}
						>
							{ticket.estado}
						</span>
					</dd>
				</div>
			</dl>
		</div>
		<div class="border-t border-gray-200 px-4 py-5 text-right sm:px-6">
			{#if ticket.estado === 'abierto'}
				<button
					type="button"
					onclick={markAsResolved}
					class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Marcar como resuelto
				</button>
			{/if}
		</div>
	</Card>
</div>
