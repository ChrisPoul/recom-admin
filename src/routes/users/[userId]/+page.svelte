<script lang="ts">
	import { rolColors } from '$lib/constants.js';

	let { data } = $props();
	const { user } = data;

</script>

<svelte:head>
	<title>Perfil de {user.nombre}</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex items-center gap-4">
            <div>
                <img
                    class="h-24 w-24 rounded-full"
                    src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
                    alt="User avatar"
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
                    class={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white ${rolColors[user.rol] || 'bg-gray-400'}`}
                >
                    {user.rol || 'N/A'}
                </span>
            </div>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Empresa</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.empresa || 'N/A'}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Celular</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.celuar || 'N/A'}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span
                            class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {user.disabled
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'}"
                        >
                            {user.disabled ? 'Disabled' : 'Active'}
                        </span>
                    </dd>
                </div>
                 <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Miembro desde</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(user.created_time).toLocaleDateString()}</dd>
                </div>
            </dl>
        </div>
    </div>
</div>
