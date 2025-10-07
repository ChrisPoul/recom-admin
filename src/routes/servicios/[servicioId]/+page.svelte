<script lang="ts">
    import CotizacionesTable from "$lib/components/cotizaciones/CotizacionesTable.svelte";

	let { data } = $props();
	const { servicio, cotizaciones } = data;
</script>

<svelte:head>
	<title>Detalles del Servicio</title>
</svelte:head>

<div class=" gap-8 p-4 sm:p-6 lg:p-8">
    <!-- Columna Izquierda: Detalles del Servicio -->
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-2xl leading-6 font-bold text-gray-900">Detalles del Servicio</h3>
        </div>
        <div class=" border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="grid grid-cols-2 sm:divide-y sm:divide-gray-200">
                {#each Object.entries(servicio) as [key, value]}
                    <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">{key}</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 break-words">
                            {JSON.stringify(value)}
                        </dd>
                    </div>
                {/each}
            </dl>
        </div>
    </div>

    <!-- Columna Derecha: Tabla de Cotizaciones -->
    <CotizacionesTable cotizaciones={cotizaciones} />
</div>