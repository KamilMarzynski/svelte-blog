<script>
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import { EditablePost } from '$lib/components/post';
</script>

<ProtectedRoute roles={['admin']}>
	<EditablePost />
</ProtectedRoute>
