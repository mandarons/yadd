<script lang="ts">
	import type { ServiceDB } from '$lib/config/zod-schemas';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import ServiceForm from '$lib/serviceForm.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData & { form: unknown; services: ServiceDB };
	const modalStore = getModalStore();

	// Auto-refresh interval constant
	const AUTO_REFRESH_INTERVAL = 5000;

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, AUTO_REFRESH_INTERVAL);
		// istanbul ignore next
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Dashboard - YADD</title>
</svelte:head>

<div class="logo-cloud py-4 px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
	<div
		id="btnAddNewService"
		class="relative flex rounded-xl shadow-lg overflow-hidden m-4 cursor-pointer align-center justify-between bg-gray-200 dark:bg-gray-800 dark:text-white"
	>
		<button
			class="flex flex-row items-center justify-between gap-4 w-full p-4 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: { ref: ServiceForm },
					title: 'New Service',
					body: 'Create a new service below.',
					meta: { ...data, action: 'createService' }
				})}
			aria-label="Add a new service"
			type="button"
		>
			<div class="flex m-2">
				<svg
					class="w-[48px] h-[48px] text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 18 18"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M9 1v16M1 9h16"
					/>
				</svg>
			</div>
			<div class="m-2 text-xl text-pink-500">
				<span>Add a new Service</span>
			</div>
		</button>
	</div>
	{#if data.services.length === 0}
		<div class="col-span-full text-center py-12" role="status" aria-live="polite">
			<p class="text-xl text-gray-600 dark:text-gray-400">No services added yet.</p>
			<p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
				Click "Add a new Service" to get started!
			</p>
		</div>
	{:else}
		{#each data.services as service (service.shortName)}
			<article
				class="relative flex card-hover rounded-xl shadow-lg overflow-hidden m-4"
				aria-label={`Service: ${service.name}`}
			>
				<a
					id={`link${service.shortName}`}
					target="_blank"
					rel="noreferrer"
					href={`/${service.shortName}`}
					class="flex focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
					aria-label={`Open ${service.name} in new tab`}
				>
					<div class="h-16 w-16">
						<img
							id={`img${service.shortName}`}
							alt={`${service.name} logo`}
							src={service.logoUrl}
							class="object-cover w-full h-full"
							loading="lazy"
						/>
					</div>
				</a>
				<div
					id={`status${service.shortName}`}
					class={`flex flex-col px-4 py-2 h-16 w-full text-white ${
						service.isUp ? 'bg-green-500' : 'bg-red-500'
					}`}
					role="status"
					aria-live="polite"
					aria-label={`${service.name} is ${service.isUp ? 'online' : 'offline'}`}
				>
					<span id={`text${service.shortName}Name`} class="text-xl font-semibold"
						>{service.name}</span
					>
					<div class="flex flex-row justify-between items-center">
						<span id={`text${service.shortName}ShortName`} class="text-sm mr-2"
							>{service.shortName}</span
						>
						<button
							id={`btnUpdate${service.shortName}`}
							on:click={() => {
								const meta = { ...data, service, action: 'updateService' };
								modalStore.trigger({
									type: 'component',
									component: { ref: ServiceForm },
									title: `Update Service ${service.name}`,
									body: 'Please update the service details below.',
									meta: meta
								});
							}}
							aria-label={`Edit ${service.name} service`}
							class="focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
							type="button"
						>
							<svg
								class="w-[20px] h-[20px] text-white dark:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 21 21"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279"
								/>
							</svg>
						</button>
					</div>
				</div>
			</article>
		{/each}
	{/if}
</div>
