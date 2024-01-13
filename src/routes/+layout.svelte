<script lang="ts">
	import '../app.postcss';
	import { AppBar, AppShell, LightSwitch, Modal, getModalStore } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<a href="/">
			<img src="/yadd.png" alt="yadd" style="max-width: 150px;" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
	</svelte:fragment>
</AppBar>

<Modal />

<AppShell>
	<slot />
</AppShell>
