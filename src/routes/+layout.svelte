<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();

	const navLinks = [
		{ href: '/', label: 'Panel de Control', icon: 'dashboard.svg' },
		{ href: '/servicios', label: 'Servicios', icon: 'servicios.svg' },
		{
			label: 'Usuarios',
			icon: 'proveedores.svg',
			href: '/users', // Base href for parent active state
			subLinks: [
				{ href: '/users', label: 'Todos', rol: null },
				{ href: '/users?rol=proveedor', label: 'Proveedores', rol: 'proveedor' },
				{ href: '/users?rol=residencial', label: 'Residenciales', rol: 'residencial' },
				{ href: '/users?rol=empresa', label: 'Empresas', rol: 'empresa' }
			]
		},
		{ href: '/blacklist', label: 'Lista Negra', icon: 'blacklist.svg' },
		// { href: '/editar', label: 'Editar', icon: 'editar.svg' },
		{ href: '/tickets', label: 'Tickets', icon: 'tickets.svg' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $page.url.pathname === '/login'}
	{@render children()}
{:else}
	<div class="flex h-screen bg-gray-100 font-sans">
		<!-- Sidebar -->
		<aside class="flex w-64 flex-shrink-0 flex-col bg-gray-800 p-4 text-gray-300">
			<div class="mb-10 flex items-center px-2">
				<a href="/">
					<h1 class="text-2xl font-bold text-white">Conax Admin</h1>
				</a>
			</div>
			<nav class="flex-grow">
				<ul class="flex flex-col space-y-2">
					{#each navLinks as link}
						<li>
							{#if link.subLinks}
								<div>
									<div
										class="flex items-center rounded-lg px-4 py-2 font-medium"
										class:text-white={$page.url.pathname.startsWith(link.href)}
									>
										<img src={`/side-menu/${link.icon}`} alt="" class="mr-3 h-6 w-6" />
										<span>{link.label}</span>
									</div>
									<ul class="mt-1 space-y-1 pl-8">
										{#each link.subLinks as subLink}
											<li>
												<a
													href={subLink.href}
													class="block rounded-lg px-4 py-1.5 text-sm hover:bg-gray-700 hover:text-white"
													class:bg-gray-900={$page.url.pathname === '/users' &&
														$page.url.searchParams.get('rol') === subLink.rol}
													class:text-white={$page.url.pathname === '/users' &&
														$page.url.searchParams.get('rol') === subLink.rol}
												>
													{subLink.label}
												</a>
											</li>
										{/each}
									</ul>
								</div>
							{:else}
								<a
									href={link.href}
									class="flex items-center rounded-lg px-4 py-2 hover:bg-gray-700 hover:text-white"
									class:bg-gray-900={$page.url.pathname.startsWith(link.href)}
									class:text-white={$page.url.pathname.startsWith(link.href)}
								>
									<img src={`/side-menu/${link.icon}`} alt="" class="mr-3 h-6 w-6" />
									<span>{link.label}</span>
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
			<div class="mt-auto">
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="flex w-full items-center rounded-lg px-4 py-2 text-left hover:bg-gray-700 hover:text-white"
					>
						<img src="/side-menu/logout.svg" alt="" class="mr-3 h-6 w-6" />
						<span>Cerrar Sesión</span>
					</button>
				</form>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-grow overflow-y-auto">
			{@render children()}
		</main>
	</div>
{/if}
