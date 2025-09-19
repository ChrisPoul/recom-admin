<script lang="ts">
    import CotizacionesTable from "$lib/components/cotizaciones/CotizacionesTable.svelte";

	let { data } = $props();
	const { cotizaciones } = data;
</script>

<svelte:head>
	<title>Cotizaciones</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
    <CotizacionesTable {cotizaciones} />
</div>