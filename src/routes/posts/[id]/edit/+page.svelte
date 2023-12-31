<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';

	export let data: {
		post: {
			title: string;
			content: string;
			id: string;
		};
	};
</script>

<ProtectedRoute roles={['admin']}>
	<Post content={data.post.content} id={data.post.id} />
</ProtectedRoute>
