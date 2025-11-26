<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import BackButton from '$lib/components/BackButton.svelte';

	let { data } = $props();
	const { ticket } = data;
</script>

<svelte:head>
	<title>Ticket: {ticket.id}</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<BackButton href="/tickets" />
	<Card color="admin">
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
				{#if ticket.timestamp && ticket.timestamp._seconds}
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Creado</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{new Date(ticket.timestamp._seconds * 1000).toLocaleDateString()}
					</dd>
				</div>
				{/if}
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Título</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ticket.titulo || 'Sin título'}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Cuerpo</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{ticket.cuerpo || 'Sin contenido'}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Estado</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<span
							class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
								(ticket.status || '').toLowerCase() === 'abierto'
									? 'bg-yellow-100 text-yellow-800'
									: 'bg-green-100 text-green-800'
							}`}
						>
							{ticket.status || 'Abierto'}
						</span>
					</dd>
				</div>
			</dl>
		</div>
		<div class="border-t border-gray-200 px-4 py-5 text-right sm:px-6">
			<form
				method="POST"
				action="?/toggleStatus"
			>
				{#if (ticket.status || '').toLowerCase() === 'abierto'}
					<button
						type="submit"
						class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
					>
						Marcar como resuelto
					</button>
				{:else}
					<button
						type="submit"
						class="inline-flex justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
					>
						Marcar como abierto
					</button>
				{/if}
			</form>
		</div>
	</Card>
</div>
