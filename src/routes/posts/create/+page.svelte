<script>
	import PostEditable from "$lib/components/PostEditable.svelte";
	import ProtectedRoute from "$lib/components/ProtectedRoute.svelte";

</script>

<ProtectedRoute roles={['admin']}>
	<h1>Create a new post</h1>

	<PostEditable />
</ProtectedRoute>