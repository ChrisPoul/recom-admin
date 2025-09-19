<script lang="ts">
    import Table from "$lib/components/Table.svelte";
    import { page } from "$app/stores";

    let { cotizaciones, title = "Cotizaciones" }: { cotizaciones: any[], title?: string } = $props();
</script>

<div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
        <h3 class="text-2xl leading-6 font-bold text-gray-900">{title}</h3>
    </div>
    <div class="border-t border-gray-200">
        <Table data={cotizaciones} key="id" color={$page.url.searchParams.get('rol') || 'admin'}>
            {#snippet header()}
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Tiempo</th>
                    <th scope="col">Estado</th>
                    <th scope="col"></th>
                </tr>
            {/snippet}
            {#snippet row(cotizacion)}
                <tr>
                    <td>{cotizacion.nombre}</td>
                    <td>{cotizacion.proveedor_nombre}</td>
                    <td>{cotizacion.cliente_nombre}</td>
                    <td>{cotizacion.precio}</td>
                    <td>{cotizacion.tiempo}</td>
                    <td>
                        <span
                            class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                cotizacion.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                cotizacion.estado === 'aprobada' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}
                        >
                            {cotizacion.estado || 'N/A'}
                        </span>
                    </td>
                    <td class="text-right">
                        <a href={`/cotizaciones/${cotizacion.id}`} class="font-medium text-indigo-600 hover:text-indigo-900">Ver</a>
                    </td>
                </tr>
            {/snippet}
        </Table>
    </div>
</div>