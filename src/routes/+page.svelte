<script lang="ts">
	import type { ServiceDB } from '$lib/config/zod-schemas';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import ServiceForm from '$lib/serviceForm.svelte';
	export let data: PageData & { form: any; services: ServiceDB };
	const modalStore = getModalStore();
</script>

<div class="logo-cloud columns-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
	{#each data.services as service}
		<div class="card card-hover p-2">
			<section class="flex justify-between m-2 align-middle">
				<div class="flex">
					<img src={service.logoUrl} alt={service.name} class="w-12 h-12" />
					<div class="px-2">
						<div class="text-lg capitalize">
							{service.name}
						</div>
						<div class="text-sm">
							{service.shortName}
						</div>
					</div>
				</div>
				<div class="flex">
					<button
						class="btn variant-outline-primary hover:variant-filled-primary"
						on:click={() => {
							const meta = { ...data, service, action: 'updateService' };
							modalStore.trigger({
								type: 'component',
								component: { ref: ServiceForm },
								title: `Update Service ${service.name}`,
								body: 'Please update the service details below.',
								meta: meta
							});
						}}>Edit</button
					>
				</div>
			</section>
		</div>
	{/each}
</div>
