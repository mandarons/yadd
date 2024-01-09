<script lang="ts">
	import '../app.postcss';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<a href="/">
			<img src="/yadd.png" alt="yadd" style="max-width: 150px;" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Create button for new service -->
		<a href="/services/new" class="btn bg-pink-500 text-white hover:bg-white hover:text-pink-500">
			New Service
		</a>
	</svelte:fragment>
</AppBar>

<AppShell>
	<slot />
</AppShell>
