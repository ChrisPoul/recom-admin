<script lang="ts" generics="Item">
	import type { Snippet } from 'svelte';

	let {
		data,
		key,
		header,
		row
	}: {
		data: Item[];
		key: keyof Item;
		header: Snippet;
		row: Snippet<[Item]>;
	} = $props();
</script>

<div class="mt-8 flex flex-col">
	<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
			{#if data && data.length > 0}
				<div class="ring-opacity-5 overflow-hidden shadow ring-1 ring-black md:rounded-lg">
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50 [&_th]:px-3 [&_th]:py-3.5 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:text-gray-900 ">
							{@render header()}
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white [&_td]:whitespace-nowrap [&_td]:px-3 [&_td]:py-4 [&_td]:text-sm [&_td]:text-gray-500">
							{#each data as item (item[key])}
							<tr>
								{@render row(item)}
							</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="py-4 text-center text-gray-500">No items found.</p>
			{/if}
		</div>
	</div>
</div>


