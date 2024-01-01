<script lang="ts">
	import {
		AppBar,
		TabAnchor,
		TabGroup,
		getDrawerStore,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';
	import { authStore, type UserData } from '../store/authStore';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { Settings } from 'lucide-svelte';

	let user: UserData;
	const items = writable([
		{ name: 'Home', href: '/' },
		{ name: 'Posts', href: '/posts' }
	]);
	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'login-menu',
		position: 'right',
		// Provide your property overrides:
		bgDrawer: 'bg-surface-100 text-black',
		// bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
		width: 'w-48',
		height: 'h-min',
		padding: 'p-4',
		rounded: 'rounded-xl'
	};

	const openDrawer = () => {
		drawerStore.open(drawerSettings);
	};

	authStore.subscribe((curr: UserData) => {
		user = curr;
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
				<div class="px-18 placeholder py-5"></div>
			{:else if $authStore.role === 'anonymous'}
				<TabAnchor class="variant-glass-success px-8" href="/auth/sign-in">Sign In</TabAnchor>
			{:else}
				<TabAnchor on:click={openDrawer} class="btn-icon"><Settings /></TabAnchor>
			{/if}
		</TabGroup>
	</svelte:fragment>
</AppBar>
