<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		isModalOpen = $bindable()
	}: {
		children: Snippet;
		isModalOpen: boolean;
	} = $props();

	function toggleModal() {
		isModalOpen = !isModalOpen;
	}
</script>

{#if isModalOpen}
	<button aria-label="Close Menu" onclick={toggleModal} class="fixed inset-0 z-40 bg-black/50"
	></button>
	<div
		class="fixed top-1/2 left-1/2 z-50 -translate-1/2"
	>
  {@render children()}
	</div>
{/if}
