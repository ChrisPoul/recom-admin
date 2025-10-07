
<script lang="ts">
    import type { ActionData } from './$types';

    let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
        <div class="rounded-lg bg-white p-8 shadow-lg">
            <h1 class="mb-6 text-center text-2xl font-bold">Admin Login</h1>
            <form method="POST" action="?/login">
                {#if form?.error}
                    <div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
                        {form.error}
                    </div>
                {/if}
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    class="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Login
                </button>
            </form>
        </div>
    </div>
</div>
