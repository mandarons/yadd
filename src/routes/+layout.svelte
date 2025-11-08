<script lang="ts">
	import '../app.postcss';
	import { AppBar, AppShell, LightSwitch, Modal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
</script>

<svelte:head>
	<title>YADD - Yet Another Dashboard</title>
	<meta name="description" content="A minimalistic dashboard for all your services" />
</svelte:head>

<AppBar>
	<svelte:fragment slot="lead">
		<a href="/" aria-label="Go to homepage">
			<img src="/yadd.png" alt="YADD Logo" style="max-width: 150px;" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch name="toggle-dark-mode" />
	</svelte:fragment>
</AppBar>

<Modal />

<AppShell>
	<div id="main-content">
		<slot />
	</div>
</AppShell>
