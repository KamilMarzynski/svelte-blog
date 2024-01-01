<script lang="ts">
	import EditorTheme from '$lib/components/EditorTheme.svelte';
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
	<EditorTheme>
		<Post content={data.post.content} id={data.post.id} />
	</EditorTheme>
</ProtectedRoute>
