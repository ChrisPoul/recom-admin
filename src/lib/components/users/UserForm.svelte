
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import type { ActionData } from '../../../routes/users/$types';
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { app } from '$lib/firebase';

	let { form, user = null }: { form: ActionData; user?: User | null } = $props();

	const storage = getStorage(app);

	let isModalOpen = $state(false);
	let isEditing = $derived(!!user);
	let isUploading = $state(false);
	let uploadError = $state('');
	let selectedRol = $state(user?.rol || 'residencial');
	
	// States for the 3 INE images
	let ineFrontalUrl = $state(user?.ine_frontal || '');
	let ineTraseraUrl = $state(user?.ine_trasera || '');
	let ineSelfieUrl = $state(user?.ine_selfie || '');
	let uploadingImage = $state<string | null>(null);

	function handleDelete(event: Event) {
		if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
			event.preventDefault();
		}
	}

    async function handleFileChange(event: Event, imageType: 'frontal' | 'trasera' | 'selfie') {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];

        isUploading = true;
        uploadError = '';
        uploadingImage = imageType;
        const storageRef = ref(storage, `user_ines/${Date.now()}_${imageType}_${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            
            // Update the corresponding URL state
            if (imageType === 'frontal') {
                ineFrontalUrl = url;
            } else if (imageType === 'trasera') {
                ineTraseraUrl = url;
            } else if (imageType === 'selfie') {
                ineSelfieUrl = url;
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);
            uploadError = 'Error al subir la imagen. Inténtalo de nuevo.';
        } finally {
            isUploading = false;
            uploadingImage = null;
        }
    }

	function validateForm(): boolean {
		if (selectedRol === 'proveedor') {
			if (!ineFrontalUrl || !ineTraseraUrl || !ineSelfieUrl) {
				uploadError = 'Las 3 imágenes de INE son requeridas para usuarios proveedor.';
				return false;
			}
		}
		return true;
	}

	function formatCelular(event: Event) {
		const input = event.target as HTMLInputElement;
		// 1. Limpiar todo lo que no sea un dígito y limitar a 10
		const digits = input.value.replace(/\D/g, '').slice(0, 10);

		// 2. Aplicar el formato (XXX) XXX XXXX
		let formatted = '';
		if (digits.length > 0) {
			formatted = '(' + digits.substring(0, 3);
		}
		if (digits.length >= 4) {
			formatted += ') ' + digits.substring(3, 6);
		}
		if (digits.length >= 7) {
			formatted += ' ' + digits.substring(6, 10);
		}

		input.value = formatted;
	}
</script>

<Modal bind:isModalOpen>
	<form
		method="POST"
		action={`?/${isEditing ? 'edit' : 'register'}`}
        use:enhance={() => {
            return async ({ result, cancel }) => {
				// Validate before submitting
				if (!validateForm()) {
					cancel();
					return;
				}
                if (result.type === 'success') {
                    isModalOpen = false;
                }
                await invalidateAll();
            };
        }}
		class="w-full min-w-xl rounded-lg bg-white p-8 shadow-xl"
		enctype="multipart/form-data"
	>
		<h2 class="mb-6 text-2xl font-bold">
			{isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
		</h2>

		{#if isEditing}
			<input type="hidden" name="uid" value={user!.uid} />
		{/if}

		{#if form?.error || uploadError}
			<div
				class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
				role="alert"
			>
				<strong class="font-bold">Error:</strong>
				<span class="block sm:inline">{form?.error || uploadError}</span>
			</div>
		{/if}

		<div class="space-y-4 max-h-[70vh] overflow-y-auto">
			<!-- Existing fields... -->
			<div>
				<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
				<input type="text" name="nombre" id="nombre" class="mt-1 form-input" value={user?.nombre || ''} required />
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input type="email" name="email" id="email" class="mt-1 form-input" value={user?.email || ''} disabled={isEditing} required />
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
				<input type="password" name="password" id="password" class="mt-1 form-input" disabled={isEditing} placeholder={isEditing ? 'No se puede cambiar' : ''} required={!isEditing} />
			</div>
			<div>
				<label for="celular" class="block text-sm font-medium text-gray-700">Celular</label>
				<input
					type="tel"
					name="celular"
					id="celular"
					value={user?.celular || ''}
					class="mt-1 form-input"
					oninput={formatCelular}
				/>
			</div>
			<div>
				<label for="empresa" class="block text-sm font-medium text-gray-700">Empresa</label>
				<input type="text" name="empresa" id="empresa" value={user?.empresa || ''} class="mt-1 form-input" />
			</div>
			<div>
				<label for="rol" class="block text-sm font-medium text-gray-700">Rol</label>
				<select name="rol" id="rol" class="mt-1 form-input" bind:value={selectedRol}>
					<option value="admin">Admin</option>
					<option value="proveedor">Proveedor</option>
					<option value="residencial">Residencial</option>
					<option value="empresa">Empresa</option>
				</select>
			</div>
            <div class="flex items-start">
                <div class="flex h-5 items-center">
                    <input id="terminosycondiciones" name="terminosycondiciones" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={user?.terminosycondiciones || false}>
                </div>
                <div class="ml-3 text-sm">
                    <label for="terminosycondiciones" class="font-medium text-gray-700">Acepta Términos y Condiciones</label>
                </div>
            </div>
            {#if selectedRol === 'proveedor'}
                <div>
                    <label for="ine-frontal-upload" class="block text-sm font-medium text-gray-700">INE Frontal <span class="text-red-500">*</span></label>
                    <input 
                        onchange={(e) => handleFileChange(e, 'frontal')} 
                        id="ine-frontal-upload" 
                        type="file" 
                        accept="image/*"
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={selectedRol === 'proveedor' && !ineFrontalUrl}
                    />
                    <input type="hidden" name="ine_frontal" bind:value={ineFrontalUrl} />
                    {#if ineFrontalUrl}
                        <div class="mt-4">
                            <p class="text-sm text-gray-500">INE Frontal Actual:</p>
                            <a href={ineFrontalUrl} target="_blank" rel="noopener noreferrer">
                                <img src={ineFrontalUrl} alt="INE Frontal Preview" class="mt-2 h-24 w-auto rounded-lg border" />
                            </a>
                        </div>
                    {/if}
                    {#if uploadingImage === 'frontal'}
                        <p class="mt-2 text-sm text-blue-600">Subiendo imagen...</p>
                    {/if}
                </div>
                <div>
                    <label for="ine-trasera-upload" class="block text-sm font-medium text-gray-700">INE Trasera <span class="text-red-500">*</span></label>
                    <input 
                        onchange={(e) => handleFileChange(e, 'trasera')} 
                        id="ine-trasera-upload" 
                        type="file" 
                        accept="image/*"
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={selectedRol === 'proveedor' && !ineTraseraUrl}
                    />
                    <input type="hidden" name="ine_trasera" bind:value={ineTraseraUrl} />
                    {#if ineTraseraUrl}
                        <div class="mt-4">
                            <p class="text-sm text-gray-500">INE Trasera Actual:</p>
                            <a href={ineTraseraUrl} target="_blank" rel="noopener noreferrer">
                                <img src={ineTraseraUrl} alt="INE Trasera Preview" class="mt-2 h-24 w-auto rounded-lg border" />
                            </a>
                        </div>
                    {/if}
                    {#if uploadingImage === 'trasera'}
                        <p class="mt-2 text-sm text-blue-600">Subiendo imagen...</p>
                    {/if}
                </div>
                <div>
                    <label for="ine-selfie-upload" class="block text-sm font-medium text-gray-700">INE Selfie <span class="text-red-500">*</span></label>
                    <input 
                        onchange={(e) => handleFileChange(e, 'selfie')} 
                        id="ine-selfie-upload" 
                        type="file" 
                        accept="image/*"
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={selectedRol === 'proveedor' && !ineSelfieUrl}
                    />
                    <input type="hidden" name="ine_selfie" bind:value={ineSelfieUrl} />
                    {#if ineSelfieUrl}
                        <div class="mt-4">
                            <p class="text-sm text-gray-500">INE Selfie Actual:</p>
                            <a href={ineSelfieUrl} target="_blank" rel="noopener noreferrer">
                                <img src={ineSelfieUrl} alt="INE Selfie Preview" class="mt-2 h-24 w-auto rounded-lg border" />
                            </a>
                        </div>
                    {/if}
                    {#if uploadingImage === 'selfie'}
                        <p class="mt-2 text-sm text-blue-600">Subiendo imagen...</p>
                    {/if}
                </div>
            {/if}
		</div>

		<div class="mt-8 flex items-center justify-between">
			{#if isEditing}
				<button type="button" class="text-sm font-medium text-red-600 hover:text-red-800" formaction="?/delete" onclick={handleDelete}>
					Eliminar Usuario
				</button>
			{/if}
			<div class="flex items-center">
				{#if isUploading}
					<span class="mr-4 text-sm text-gray-500">Subiendo imagen...</span>
				{/if}
				<button type="button" onclick={() => (isModalOpen = false)} class="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">Cancelar</button>
				<button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" disabled={isUploading}>
					{isUploading ? 'Subiendo...' : (isEditing ? 'Actualizar Usuario' : 'Registrar Usuario')}
				</button>
			</div>
		</div>
	</form>
</Modal>

<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
	<button onclick={() => (isModalOpen = true)} type="button">
		{#if isEditing}
			<img class="w-5" src="/EditIcon.svg" alt="" />
		{:else}
			<span class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto">
				Registrar Usuario
			</span>
		{/if}
	</button>
</div>
