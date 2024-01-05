<script lang="ts">
	import { NonEditablePost } from '$lib/components/post';
	import { authStore, type UserData } from '$lib/store/authStore';

	let user: UserData;

	authStore.subscribe((curr: UserData) => {
		user = curr;
	});

	export let data: {
		post: {
			data: {
				content: string;
			};
			id: string;
		};
		// recents is available because of +layout.server.ts which is in parent directory
		// load function of this file does not return recents
		recents: {
			id: string;
			title: string;
		}[];
	};
</script>

<NonEditablePost content={data.post.data.content} id={data.post.id} />

{#if user && user.role === 'admin'}
	<a href="/posts/{data.post.id}/edit">Edit</a>
{/if}
