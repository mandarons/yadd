<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import { serviceSchema } from '$lib/config/zod-schemas';
	import { superForm } from 'sveltekit-superforms/client';

	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	// @ts-expect-error - parent is used by Skeleton UI Modal
	export const parent: SvelteComponent = undefined as unknown as SvelteComponent;

	const modalStore = getModalStore();
	const data = $modalStore[0].meta;
	const { form, errors, enhance, submitting } = superForm(data.form, {
		taintedMessage: null,
		warnings: {
			noValidationAndConstraints: true
		},
		validators: serviceSchema,
		delayMs: 0,
		onResult(event) {
			if (event.result.type === 'success') {
				invalidateAll();
				modalStore.close();
			}
		},
		onError(event) {
			console.error('Form submission error:', event);
		}
	});
	if (data.service) {
		form.set(data.service);
	}

	// Focus first input when modal opens
	onMount(() => {
		const firstInput = document.querySelector<HTMLInputElement>('input[name="name"]');
		firstInput?.focus();
	});

	// Handle keyboard events
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			modalStore.close();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if $modalStore[0]}
	<div
		class="modal-example-form card p-4 w-modal shadow-xl space-y-4"
		role="dialog"
		aria-labelledby="modal-title"
		aria-describedby="modal-description"
	>
		<header class="text-2xl font-bold" id="modal-title">{$modalStore[0].title}</header>
		<article>
			<p id="modal-description" class="mb-4">{$modalStore[0].body}</p>
			<form
				name="serviceForm"
				class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
				method="POST"
				use:enhance
				aria-label="Service form"
			>
				<label class="label">
					<span>Name<span class="text-red-500" aria-label="required">*</span></span>
					<input
						name="name"
						class="input"
						class:input-error={$errors.name}
						type="text"
						bind:value={$form.name}
						data-invalid={$errors.name}
						placeholder="Enter service name..."
						aria-required="true"
						aria-invalid={$errors.name ? 'true' : 'false'}
						aria-describedby={$errors.name ? 'nameError' : undefined}
						required
					/>
					{#if $errors.name}
						<small id="nameError" class="text-red-500 text-xs italic" role="alert"
							>{$errors.name}</small
						>
					{/if}
				</label>
				<label class="label">
					<span>Short Name<span class="text-red-500" aria-label="required">*</span></span>
					<input
						name="shortName"
						class="input"
						class:input-error={$errors.shortName}
						type="text"
						bind:value={$form.shortName}
						data-invalid={$errors.shortName}
						placeholder="Enter service short name..."
						aria-required="true"
						aria-invalid={$errors.shortName ? 'true' : 'false'}
						aria-describedby={$errors.shortName ? 'shortNameError' : undefined}
						required
					/>
					{#if $errors.shortName}
						<small id="shortNameError" class="text-red-500 text-xs italic" role="alert"
							>{$errors.shortName}</small
						>
					{/if}
				</label>
				<label class="label">
					<span>URL<span class="text-red-500" aria-label="required">*</span></span>
					<input
						name="url"
						class="input"
						class:input-error={$errors.url}
						type="url"
						bind:value={$form.url}
						data-invalid={$errors.url}
						placeholder="Enter service URL..."
						aria-required="true"
						aria-invalid={$errors.url ? 'true' : 'false'}
						aria-describedby={$errors.url ? 'urlError' : undefined}
						required
					/>
					{#if $errors.url}
						<small id="urlError" class="text-red-500 text-xs italic" role="alert"
							>{$errors.url}</small
						>
					{/if}
				</label>
				<label class="label">
					<span>Logo URL<span class="text-red-500" aria-label="required">*</span></span>
					<input
						name="logoUrl"
						class="input"
						class:input-error={$errors.logoUrl}
						type="url"
						bind:value={$form.logoUrl}
						data-invalid={$errors.logoUrl}
						placeholder="Enter service logo URL..."
						aria-required="true"
						aria-invalid={$errors.logoUrl ? 'true' : 'false'}
						aria-describedby={$errors.logoUrl ? 'logoUrlError' : undefined}
						required
					/>
					{#if $errors.logoUrl}
						<small id="logoUrlError" class="text-red-500 text-xs italic" role="alert"
							>{$errors.logoUrl}</small
						>
					{/if}
				</label>
				{#if data.service}
					<div class="flex justify-between gap-2">
						<button
							id="btnDeleteService"
							formaction="?/deleteService"
							class="btn variant-filled-error bg-pink-500 text-white hover:bg-white hover:text-pink-500"
							type="submit"
							disabled={$submitting}
							aria-label="Delete service"
						>
							{$submitting ? 'Deleting...' : 'Delete'}
						</button>
						<button
							id="btnUpdateService"
							formaction={`?/${data.action}`}
							class="btn variant-filled-primary bg-pink-500 text-white hover:bg-white hover:text-pink-500"
							type="submit"
							disabled={$submitting}
							aria-label="Update service"
						>
							{$submitting ? 'Updating...' : 'Update'}
						</button>
					</div>
				{:else}
					<div class="flex justify-end">
						<button
							formaction={`?/${data.action}`}
							class="btn variant-filled-primary bg-pink-500 text-white hover:bg-white hover:text-pink-500"
							type="submit"
							disabled={$submitting}
							aria-label="Create service"
						>
							{$submitting ? 'Creating...' : 'Create'}
						</button>
					</div>
				{/if}
			</form>
		</article>
	</div>
{/if}
