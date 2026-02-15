
<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import UserForm from "$lib/components/users/UserForm.svelte";
    import BackButton from "$lib/components/BackButton.svelte";

	let { data, form } = $props();
	const { user, services, direcciones = [] } = data;
</script>

<svelte:head>
	<title>Perfil de {user.nombre}</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
    <BackButton href="/users" />
    <Card color={user.rol || 'admin'}>
        <div class="flex items-center justify-between px-4 py-5 sm:px-6">
            <div class="flex items-center gap-4">
                <div>
                    <img
                        class="h-24 w-24 rounded-full"
                        src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
                        alt="Avatar de usuario"
                    />
                </div>
                <div>
                    <h3 class="text-2xl leading-6 font-bold text-gray-900">
                        {user.nombre}
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                        {user.email}
                    </p>
                    <span
                        class="mt-2 inline-flex items-center rounded-full bg-gray-400 px-3 py-1 text-sm font-medium text-white"
                        style={`background-color: var(--color-${user.rol || 'admin'})`}
                    >
                        {user.rol || 'N/A'}
                    </span>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <form method="POST" action="?/toggleBlock">
                    <input type="hidden" name="uid" value={user.uid} />
                    <input type="hidden" name="disabled" value={user.disabled} />
                    <button type="submit" class={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${user.disabled ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}>
                        {user.disabled ? 'Desbloquear' : 'Bloquear'}
                    </button>
                </form>
                <UserForm {form} user={user} />
            </div>
        </div>

        <div class="border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-x-8">
            <!-- User Data -->
            <div class={`px-4 py-5 sm:p-0 ${user.rol !== 'proveedor' ? 'md:col-span-2' : ''}`}>
                <dl class={`sm:divide-y sm:divide-gray-200 ${user.rol === 'proveedor' ? '' : 'sm:grid sm:grid-cols-2'}`}>
                    <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">Empresa</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.empresa || 'N/A'}</dd>
                    </div>
                    <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">Celular</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.celular || 'N/A'}</dd>
                    </div>
                    <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">Estado</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span
                                class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {user.disabled
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'}"
                            >
                                {user.disabled ? 'Deshabilitado' : 'Activo'}
                            </span>
                        </dd>
                    </div>
                    <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">Miembro desde</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {new Date(user.created_time).toLocaleDateString()}
                        </dd>
                    </div>
                    <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <dt class="text-sm font-medium text-gray-500">Términos y Condiciones</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span
                                class={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                    user.terminosycondiciones
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {user.terminosycondiciones ? 'Aceptado' : 'No Aceptado'}
                            </span>
                        </dd>
                    </div>
                </dl>
            </div>

            <!-- Services -->
            {#if user.rol === 'proveedor' && services && services.length > 0}
                <div class="px-4 py-5 sm:p-0">
                    <div>
                        <h3 class="px-6 py-5 text-lg leading-6 font-medium text-gray-900">
                            Servicios Ofrecidos
                        </h3>
                        <dl class="sm:divide-y sm:divide-gray-200">
                            {#each services as service}
                                <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-900 sm:col-span-2">{service.name}</dt>
                                    <dd class="mt-1 text-right text-sm text-gray-900 sm:mt-0">
                                        <a
                                            href={`/servicios/${service.id}`}
                                            class="text-indigo-600 hover:text-indigo-900">Ver</a
                                        >
                                    </dd>
                                </div>
                            {/each}
                        </dl>
                    </div>
                </div>
            {/if}

            <!-- Tickets -->
            <div class="px-4 py-5 sm:p-0">
                <div>
                    <h3 class="px-6 py-5 text-lg leading-6 font-medium text-gray-900">
                        Tickets
                    </h3>
                    <dl class="sm:divide-y sm:divide-gray-200">
                        {#if data.tickets && data.tickets.length > 0}
                            {#each data.tickets as ticket}
                                <div class="py-4 grid grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-900 sm:col-span-2">{ticket.titulo}</dt>
                                    <dd class="mt-1 text-right text-sm text-gray-900 sm:mt-0">
                                        <a
                                            href={`/tickets/${ticket.id}`}
                                            class="text-indigo-600 hover:text-indigo-900">Ver</a
                                        >
                                    </dd>
                                </div>
                            {/each}
                        {:else}
                            <div class="px-6 py-5 text-sm text-gray-500">
                                No hay tickets para este usuario.
                            </div>
                        {/if}
                    </dl>
                </div>
            </div>
        </div>

        <!-- Direcciones -->
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Direcciones</h3>
            {#if direcciones && direcciones.length > 0}
                <div class="space-y-4">
                    {#each direcciones as direccion}
                        <div class="rounded-lg border border-gray-200 bg-white p-4">
                            <div class="space-y-2">
                                <div>
                                    <span class="text-sm font-medium text-gray-700">Dirección:</span>
                                    <p class="mt-1 text-sm text-gray-900">{direccion.direccion || 'N/A'}</p>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <span class="text-sm font-medium text-gray-700">Número Exterior:</span>
                                        <p class="mt-1 text-sm text-gray-900">{direccion.n_exterior || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span class="text-sm font-medium text-gray-700">Número Interior:</span>
                                        <p class="mt-1 text-sm text-gray-900">{direccion.n_interior || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class="text-sm text-gray-500">No hay direcciones registradas para este usuario.</p>
            {/if}
        </div>

        <!-- INE Images (only for proveedor) -->
        {#if user.rol === 'proveedor'}
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Documentos de Identificación</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- INE Frontal -->
                    <div class="text-center">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">INE Frontal</h4>
                        {#if user.ine_frontal}
                            <a href={user.ine_frontal} target="_blank" rel="noopener noreferrer">
                                <img src={user.ine_frontal} alt="INE Frontal" class="mx-auto mt-2 max-w-full rounded-lg border hover:opacity-80 transition-opacity" />
                            </a>
                        {:else}
                            <p class="text-sm text-gray-500 mt-2">No disponible</p>
                        {/if}
                    </div>
                    <!-- INE Trasera -->
                    <div class="text-center">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">INE Trasera</h4>
                        {#if user.ine_trasera}
                            <a href={user.ine_trasera} target="_blank" rel="noopener noreferrer">
                                <img src={user.ine_trasera} alt="INE Trasera" class="mx-auto mt-2 max-w-full rounded-lg border hover:opacity-80 transition-opacity" />
                            </a>
                        {:else}
                            <p class="text-sm text-gray-500 mt-2">No disponible</p>
                        {/if}
                    </div>
                    <!-- INE Selfie -->
                    <div class="text-center">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">INE Selfie</h4>
                        {#if user.ine_selfie}
                            <a href={user.ine_selfie} target="_blank" rel="noopener noreferrer">
                                <img src={user.ine_selfie} alt="INE Selfie" class="mx-auto mt-2 max-w-full rounded-lg border hover:opacity-80 transition-opacity" />
                            </a>
                        {:else}
                            <p class="text-sm text-gray-500 mt-2">No disponible</p>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </Card>
</div>
