<script lang="ts">
	import '../app.postcss';
	import { AppBar, AppShell, Modal, getModalStore } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import ServiceForm from '$lib/serviceForm.svelte';
	export let data;
	initializeStores();
	const modalStore = getModalStore();
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<a href="/">
			<img src="/yadd.png" alt="yadd" style="max-width: 150px;" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button
			class="btn variant-filled-primary"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: { ref: ServiceForm },
					title: 'New Service',
					body: 'This is the body of the modal',
					meta: { ...data, action: 'createService' }
				})}
		>
			New Service
		</button>
	</svelte:fragment>
</AppBar>

<Modal />

<AppShell>
	<slot />
</AppShell>
