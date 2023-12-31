<script lang="ts">
	import { authStore } from '$lib/store/authStore';
	import { authHandlers } from '../auth/auth';

	let user;

	authStore.subscribe(async (curr) => {
		user = curr;

		if (user?.role !== 'anonymous') {
			await authHandlers.logout();
		}
	});
</script>
