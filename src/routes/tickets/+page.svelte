
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
            <th scope="col">Proveedor</th>
            <th scope="col">Creado</th>
            <th scope="col">Razón</th>
        {/snippet}
        {#snippet row(ticket)}
            <td>{ticket.cliente_nombre}</td>
            <td>{ticket.servicio_nombre}</td>
            <td>{ticket.proveedor_nombre}</td>
            <td>{new Date(ticket.timestamp._seconds * 1000).toLocaleDateString()}</td>
            <td>{ticket.razon}</td>
        {/snippet}
    </Table>
</div>
