<script>
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import Post from '$lib/components/Post.svelte';
</script>

<ProtectedRoute roles={['admin']}>
	<Post />
</ProtectedRoute>
