<script lang="ts">
	import { serviceSchema, type ServiceSchema } from '$lib/config/zod-schemas';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from '../routes/$types';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: PageData & {
		form: SuperValidated<typeof serviceSchema>;
		action: string;
		service?: ServiceSchema;
	};
	const modelStore = getModalStore();
	const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validators: serviceSchema,
		delayMs: 0,
		onResult(event) {
			console.log(event);
			if (event.result.type === 'success') {
				modelStore.close();
			}
		}
	});
	if (data.service) {
		form.set(data.service);
	}
</script>

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
	<div class="flex justify-end">
		<button
			formaction={`?/${data.action}`}
			class="btn variant-filled-primary bg-pink-500 text-white hover:bg-white hover:text-pink-500"
			type="submit"
		>
			{#if data.service}
				Update
			{:else}
				Create
			{/if}
		</button>
		{#if data.service}
			<button
				formaction="?/deleteService"
				class="btn variant-filled-error bg-pink-500 text-white hover:bg-white hover:text-pink-500"
				type="submit"
			>
				Delete
			</button>
		{/if}
	</div>
</form>
