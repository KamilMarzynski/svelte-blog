<script lang="ts">
	import '../app.pcss';
	import { Drawer, Toast, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';
	import logo from '$lib/assets/logo.png';
	import Navigation from '$lib/components/Navigation.svelte';
	import { auth, db } from '$lib/firebase/firebase';
	import { onMount } from 'svelte';
	import { getDoc, doc, setDoc } from 'firebase/firestore';
	import { authStore, type UserData } from '../lib/store/authStore';
	import { page } from '$app/stores';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	const restrictedRoutes = ['/posts/[id]/edit', '/posts/create'];
	initializeStores();
	const drawerStore = getDrawerStore();

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;
			if (!user && restrictedRoutes.includes(currentPath)) {
				window.location.href = '/';
			}

			if (user && currentPath === '/auth/sign-in') {
				window.location.href = '/';
			}

			if (!user && currentPath === '/auth/sign-out') {
				window.location.href = '/';
			}

			let dataToSetToStore: UserData = {
				id: '',
				role: 'anonymous',
				email: ''
			};

			if (!user) {
				authStore.update((curr: any) => {
					return {
						...curr,
						...dataToSetToStore
					};
				});

				return;
			}

			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				const userRef = doc(db, 'users', user.uid);
				dataToSetToStore = {
					id: user.uid,
					email: user.email,
					role: 'user'
				};
				await setDoc(userRef, dataToSetToStore, { merge: true });
			} else {
				const userData = docSnap.data();
				dataToSetToStore = {
					id: userData.id,
					email: userData.email,
					role: userData.role
				};
			}

			authStore.update((curr: any) => {
				return {
					...curr,
					...dataToSetToStore
				};
			});
		});
		return unsubscribe;
	});
</script>

<Drawer>
	{#if $drawerStore.id === 'login-menu'}
		<ul>
			<li class="p-4" on:click={() => drawerStore.close()}>Close</li>
			<li class="p-4" on:click={() => drawerStore.close()}>Profile</li>
			{#if $authStore.role === 'admin'}
				<li
					class="p-4"
					on:click={() => {
						goto('/posts/create');
						drawerStore.close();
					}}
				>
					New post
				</li>
			{/if}
			<li
				class="p-4"
				on:click={() => {
					goto('/auth/sign-out');
					drawerStore.close();
				}}
			>
				Sign out
			</li>
		</ul>
	{:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>
<Toast />
<AppShell>
	<svelte:fragment slot="header">
		{#if $page.url.pathname !== '/auth/sign-in'}
			<Navigation />
			<div class="flex flex-col items-center">
				<img class="h-12" src={logo} alt="logo" />
			</div>
		{/if}
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
