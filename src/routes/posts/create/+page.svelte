<script>
	import PostEditable from "$lib/components/PostEditable.svelte";
	import ProtectedRoute from "$lib/components/ProtectedRoute.svelte";

</script>
<h1>Create a new post</h1>

<ProtectedRoute roles={['admin']}>
	<PostEditable />
</ProtectedRoute>