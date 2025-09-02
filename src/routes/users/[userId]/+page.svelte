<script lang="ts">
	import { rolColors } from '$lib/constants.js';

	let { data } = $props();
	const { user } = data;
</script>

<svelte:head>
	<title>Perfil de {user.nombre}</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
	<div class="overflow-hidden bg-white shadow sm:rounded-lg">
		<div class="flex items-center gap-4 px-4 py-5 sm:px-6">
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
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Empresa</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.empresa || 'N/A'}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Celular</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.celuar || 'N/A'}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Status</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<span
							class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {user.disabled
								? 'bg-red-100 text-red-800'
								: 'bg-green-100 text-green-800'}"
						>
							{user.disabled ? 'Disabled' : 'Active'}
						</span>
					</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Miembro desde</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{new Date(user.created_time).toLocaleDateString()}
					</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">Código Postal</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.cp || 'N/A'}</dd>
				</div>
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
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
				<div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
					<dt class="text-sm font-medium text-gray-500">INE</dt>
					<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						{#if user.INE}
							<a href={user.INE} target="_blank" rel="noopener noreferrer">
								<img src={user.INE} alt="INE" class="mt-2 max-w-xs rounded-lg border" />
							</a>
						{:else}
							N/A
						{/if}
					</dd>
				</div>
			</dl>
		</div>
	</div>
</div>
