<script lang="ts">
	import { AppBar, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
	import { authStore, type UserData } from '../store/authStore';
	import { writable } from 'svelte/store';

	let user: UserData;
	const items = writable([
		{ name: 'Home', href: '/' },
		{ name: 'Posts', href: '/posts' }
	]);

	authStore.subscribe((curr: UserData) => {
		user = curr;

		if (user && user.role === 'admin') {
			items.update((items) => {
				items.push({ name: 'Add new post', href: '/posts/create' });
				return items;
			});
		}
	});
</script>

<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		<TabGroup border="" rounded="rounded-container-token">
			{#each $items as { name, href }}
				<TabAnchor {href}>
					{name}
				</TabAnchor>
			{/each}
		</TabGroup>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<TabGroup border="" rounded="rounded-container-token">
			{#if !$authStore}
				<div class="placeholder px-12 py-5"></div>
				<!-- <TabAnchor class="placeholder  px-4 py-2" /> -->
			{:else if $authStore.role === 'anonymous'}
				<TabAnchor class="variant-glass-success" href="/auth/sign-in">Sign In</TabAnchor>
				<!-- <a class="variant-ghost-surface btn btn-sm" href="/auth/sign-in"> Sign In </a> -->
			{:else}
				<TabAnchor class="variant-glass-warning" href="/auth/sign-out">Sign Out</TabAnchor>
				<!-- <a class="variant-ghost-surface btn btn-sm" href="/auth/sign-out"> Sign Out </a> -->
			{/if}
		</TabGroup>
	</svelte:fragment>
</AppBar>
