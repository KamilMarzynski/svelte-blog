<script lang>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/store/authStore';
	import { redirect } from '@sveltejs/kit';
	import { authHandlers } from '../auth/auth';

	let user;

	authStore.subscribe((curr) => {
		user = curr;

		if (user?.role !== 'anonymous') {
			authHandlers.logout();
			throw redirect(302, '/');
		} else {
			throw redirect(302, '/');
		}
	});
</script>
