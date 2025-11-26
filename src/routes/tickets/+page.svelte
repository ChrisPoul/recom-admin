
<script lang="ts">
    import Table from "$lib/components/Table.svelte";
    import { page } from "$app/stores";

    let { data } = $props();
    const { tickets } = data;

</script>

<svelte:head>
    <title>Tickets</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
    <h1 class="text-2xl font-bold mb-4">Tickets</h1>
    <Table data={tickets} key="id" color={$page.url.searchParams.get('rol') || 'admin'} baseUrl="/tickets">
        {#snippet header()}
            <th scope="col">Usuario</th>
            <th scope="col">Servicio</th>
            <th scope="col">Título</th>
            <th scope="col">Estado</th>
        {/snippet}
        {#snippet row(ticket)}
            <td>{ticket.cliente_nombre}</td>
            <td>{ticket.servicio_nombre}</td>
            <td>{ticket.titulo || 'Sin título'}</td>
            <td>
                <span
                    class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        (ticket.status || '').toLowerCase() === 'abierto'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                    }`}
                >
                    {ticket.status || 'Abierto'}
                </span>
            </td>
        {/snippet}
    </Table>
</div>
