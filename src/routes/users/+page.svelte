<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Registered Users</title>
	<meta name="description" content="A list of all registered users from Auth and Firestore." />
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Registered Users</h1>
			<p class="mt-2 text-sm text-gray-700">
				A list of all users from Firebase Authentication combined with their data from the Firestore 'users' collection.
			</p>
		</div>
	</div>
	<div class="mt-8 flex flex-col">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				{#if data.error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800">Error</h3>
								<div class="mt-2 text-sm text-red-700">
									<p>{data.error}</p>
								</div>
							</div>
						</div>
					</div>
				{:else if data.users && data.users.length > 0}
					<div class="ring-opacity-5 overflow-hidden shadow ring-1 ring-black md:rounded-lg">
						<table class="min-w-full divide-y divide-gray-300">
							<thead class="bg-gray-50">
								<tr>
									<th
										scope="col"
										class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
										>User</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Status</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Firestore Data</th
									>
									<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>Created On</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each data.users as user (user.uid)}
									<tr>
										<td class="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
											<div class="flex items-center">
												<div class="h-10 w-10 flex-shrink-0">
													<img
														class="h-10 w-10 rounded-full"
														src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
														alt="User avatar"
													/>
												</div>
												<div class="ml-4">
													<div class="font-medium text-gray-900">{user.displayName || 'N/A'}</div>
													<div class="text-gray-500">{user.email}</div>
												</div>
											</div>
										</td>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
											{#if user.disabled}
												<span
													class="inline-flex rounded-full bg-red-100 px-2 text-xs leading-5 font-semibold text-red-800"
													>Disabled</span
												>
											{:else}
												<span
													class="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800"
													>Active</span
												>
											{/if}
										</td>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
											<pre class="text-xs">{JSON.stringify(user.firestoreData, null, 2)}</pre>
										</td>
										<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
											>{new Date(user.metadata.creationTime).toLocaleDateString()}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="py-4 text-center text-gray-500">No users found.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
