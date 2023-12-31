<script>
	// import PostEditable from '$lib/components/PostEditable.svelte';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import TipTapEdit from '$lib/components/TipTapEdit.svelte';
</script>

<ProtectedRoute roles={['admin']}>
	<TipTapEdit />
</ProtectedRoute>
