<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import { serviceSchema } from '$lib/config/zod-schemas';
	import { superForm } from 'sveltekit-superforms/client';

	import { invalidateAll } from '$app/navigation';

	export let parent: SvelteComponent;
	const modalStore = getModalStore();
	const data = $modalStore[0].meta;
	const { form, errors, enhance, delayed } = superForm(data.form, {
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
			console.log(event);
		}
	});
	if (data.service) {
		form.set(data.service);
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
		<article>
			{$modalStore[0].body ?? '(body missing)'}
			<form
				name="serviceForm"
				class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
				method="POST"
				use:enhance
			>
				{#if $errors._errors}
					<aside class="alert variant-filled-error mt-6">
						<div class="alert-message">
							<p>{$errors._errors}</p>
						</div>
					</aside>
				{/if}
				<label class="label">
					<span>Name</span>
					<input
						name="name"
						class="input"
						class:input-error={$errors.name}
						type="text"
						bind:value={$form.name}
						data-invalid={$errors.name}
						placeholder="Enter service name..."
					/>
					{#if $errors.name}
						<small class="text-red-500 text-xs italic">{$errors.name}</small>
					{/if}
				</label>
				<label class="label">
					<span>Short Name</span>
					<input
						name="shortName"
						class="input"
						class:input-error={$errors.shortName}
						type="text"
						bind:value={$form.shortName}
						data-invalid={$errors.shortName}
						placeholder="Enter service short name..."
					/>
					{#if $errors.shortName}
						<small class="text-red-500 text-xs italic">{$errors.shortName}</small>
					{/if}
				</label>
				<label class="label">
					<span>URL</span>
					<input
						name="url"
						class="input"
						class:input-error={$errors.url}
						type="url"
						bind:value={$form.url}
						data-invalid={$errors.url}
						placeholder="Enter service URL..."
					/>
					{#if $errors.url}
						<small class="text-red-500 text-xs italic">{$errors.url}</small>
					{/if}
				</label>
				<label class="label">
					<span>Logo URL</span>
					<input
						name="logoUrl"
						class="input"
						class:input-error={$errors.logoUrl}
						type="url"
						bind:value={$form.logoUrl}
						data-invalid={$errors.logoUrl}
						placeholder="Enter service logo URL..."
					/>
					{#if $errors.logoUrl}
						<small class="text-red-500 text-xs italic">{$errors.logoUrl}</small>
					{/if}
				</label>
				{#if data.service}
					<div class="flex justify-between gap-2">
						<button
							id="btnDeleteService"
							formaction="?/deleteService"
							class="btn variant-filled-error bg-pink-500 text-white hover:bg-white hover:text-pink-500"
							type="submit"
						>
							Delete
						</button>
						<button
							id="btnUpdateService"
							formaction={`?/${data.action}`}
							class="btn variant-filled-primary bg-pink-500 text-white hover:bg-white hover:text-pink-500"
							type="submit"
						>
							Update
						</button>
					</div>
				{:else}
					<div class="flex justify-end">
						<button
							formaction={`?/${data.action}`}
							class="btn variant-filled-primary bg-pink-500 text-white hover:bg-white hover:text-pink-500"
							type="submit"
						>
							Create
						</button>
					</div>
				{/if}
			</form>
		</article>
	</div>
{/if}
