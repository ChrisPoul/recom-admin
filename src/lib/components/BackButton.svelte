<script lang="ts">
	let { href }: { href: string } = $props();
</script>

<a
	{href}
	class="mb-4 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
>
	<svg
		class="h-5 w-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M10 19l-7-7m0 0l7-7m-7 7h18"
		/>
	</svg>
	<span>Volver</span>
</a>

