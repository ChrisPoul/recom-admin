<script lang="ts" generics="Item">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';

	let {
		data,
		key,
		header,
		row,
		color,
		tableTitle,
		baseUrl
	}: {
		data: Item[];
		key: keyof Item;
		header: Snippet;
		row: Snippet<[Item]>;
		color: string;
		tableTitle?: string;
		baseUrl: string;
	} = $props();
</script>

<div class="mt-8 flex flex-col">
	<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full px-8 py-2 align-middle">
			{#if data && data.length > 0}
				<Card {color}>
					{#snippet title()}
						<span>{tableTitle}</span>
					{/snippet}
					<table class="min-w-full">
						<thead
							class="bg-gray-50 text-left text-sm [&_th]:px-3.5 [&_th]:py-3.5 [&_th]:font-medium"
							style={`color: var(--color-${color})`}
						>
							<tr>
								{@render header()}
								<th scope="col" class="text-right"> </th>
							</tr>
						</thead>
						<tbody
							class="divide-y divide-gray-200 bg-white text-sm whitespace-nowrap text-gray-500 [&_td]:px-3 [&_td]:py-4"
						>
							{#each data as item (item[key])}
								<tr>
									{@render row(item)}
									<td>
										<a
                      href={`${baseUrl}/${item.id ?? item.uid}`}
											class="text-blue-500 hover:underline"
											aria-label="View details"
										>
											&rarr;
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</Card>
			{:else}
				<p class="py-4 text-center text-gray-500">No items found.</p>
			{/if}
		</div>
	</div>
</div>
