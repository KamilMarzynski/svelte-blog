<script lang="ts">
	import { AppBar, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
	import { authStore, type UserData } from '../store/authStore';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	let user: UserData;
	const items = writable([
		{ name: 'Home', href: '/' },
		{ name: 'Posts', href: '/posts' }
	]);

	authStore.subscribe((curr: UserData) => {
		user = curr;

		if (user && user.role === 'admin') {
			items.update((items) => {
				// workaround for now
				if (items[2] && items[2].name === 'Add new post') return items;

				items.push({ name: 'Add new post', href: '/posts/create' });
				return items;
			});
		}
	});
</script>

<!-- App Bar -->
<AppBar>
	<svelte:fragment slot="lead">
		<TabGroup
			border=""
			rounded="rounded-container-token"
			class="bg-glass-100-800-token"
			active="variant-glass-primary"
		>
			{#each $items as { name, href }}
				<TabAnchor {href} class="mx-2 px-8" selected={$page.url.pathname === href}>{name}</TabAnchor
				>
			{/each}
		</TabGroup>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<TabGroup border="" rounded="rounded-container-token">
			{#if !$authStore}
				<div class="placeholder px-20 py-5"></div>
			{:else if $authStore.role === 'anonymous'}
				<TabAnchor class="variant-glass-success px-8" href="/auth/sign-in">Sign In</TabAnchor>
			{:else}
				<TabAnchor class="variant-glass-warning px-8" href="/auth/sign-out">Sign Out</TabAnchor>
			{/if}
		</TabGroup>
	</svelte:fragment>
</AppBar>
