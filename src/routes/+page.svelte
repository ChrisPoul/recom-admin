<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	let { data } = $props();
	const { stats } = data;

	const dashboardMetrics = [
		{
			title: 'USUARIOS ACTIVOS',
			value: stats.activeUsers,
			color: 'admin' 
		},
		{
			title: 'PROVEEDORES ACTIVOS',
			value: stats.activeProviders,
			color: 'proveedor'
		},
		{
			title: 'SERVICIOS COMPLETADOS',
			value: stats.completedServices,
			color: 'empresa'
		},
		{
			title: 'CALIFICACIÓN CONAX',
			value: stats.recomRating,
			color: 'residencial'
		}
	];
</script>

<svelte:head>
	<title>Panel de Control</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each dashboardMetrics as metric}
			<Card color={metric.color}>
				{#snippet title()}
					<div class="w-full p-2 text-center font-bold">
						{metric.title}
					</div>
				{/snippet}
				<div class="flex items-center justify-center p-6 text-center">
					<p class="text-5xl font-extrabold text-gray-900">
						{metric.value}
					</p>
				</div>
			</Card>
		{/each}
	</div>
</div>
