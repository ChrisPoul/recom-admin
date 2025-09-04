<script lang="ts" generics="Item">
	import type { Snippet } from 'svelte';

	let {
    children,
		color
	}: {
    children: Snippet;
		color: string;
	} = $props();
</script>

<div
	class="ring-opacity-5 overflow-hidden rounded-3xl shadow ring-3"
	style={`--tw-ring-color: var(--color-${color})`}
>
	<div class="flex h-6 w-full" style={`background-color: var(--color-${color})`}></div>
  {@render children()}
</div>
