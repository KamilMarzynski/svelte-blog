<script>
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import Post from '$lib/components/Post.svelte';
	import EditorTheme from '$lib/components/EditorTheme.svelte';
</script>

<ProtectedRoute roles={['admin']}>
	<EditorTheme>
		<Post />
	</EditorTheme>
</ProtectedRoute>
