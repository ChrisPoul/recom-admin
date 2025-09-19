<script lang="ts">
    import CotizacionesTable from "$lib/components/cotizaciones/CotizacionesTable.svelte";

	let { data } = $props();
	const { cotizaciones } = data;
</script>

<svelte:head>
	<title>Cotizaciones</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">

<h3 class="text-2xl leading-6 font-bold text-gray-900">Cotizaciones</h3>
    <CotizacionesTable {cotizaciones} />
</div>