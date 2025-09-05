<script lang="ts" generics="Item">
	import type { Snippet } from 'svelte';

	let {
    children,
		color,
    title
	}: {
    children: Snippet;
		color: string;
    title?: Snippet
	} = $props();
</script>

<div
	class="ring-opacity-5 overflow-hidden rounded-3xl shadow ring-3"
	style={`--tw-ring-color: var(--color-${color})`}
>
	<div class="flex min-h-6 w-full text-white" style={`background-color: var(--color-${color})`}>
    {#if title}
      {@render title()}
    {/if}
  </div>
  {@render children()}
</div>
