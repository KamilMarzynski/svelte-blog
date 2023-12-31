<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { authStore, type UserData } from '../store/authStore';

	let user: UserData;
	let items: { name: string; href: string }[] = [];

	authStore.subscribe((curr: UserData) => {
		user = curr;

		items = [
			{ name: 'Home', href: '/' },
			{ name: 'Posts', href: '/posts' }
		];

		if (user && user.role === 'admin') {
			items.push({ name: 'Add new post', href: '/posts/create' });
		}
	});
</script>

<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		{#if user}
			{#each items as { name, href }}
				<a class="btn btn-sm variant-ghost-surface" {href}><b>{name}</b></a>
			{/each}
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="trail">
		{#if !$authStore || $authStore.role === 'anonymous'}
			<a class="btn btn-sm variant-ghost-surface" href="/auth/sign-in"> Sign In </a>
		{:else}
			<a class="btn btn-sm variant-ghost-surface" href="/auth/sign-out"> Sign Out </a>
		{/if}
	</svelte:fragment>
</AppBar>
