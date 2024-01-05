<script lang="ts">
	import { EditablePost } from '$lib/components/post';
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';

	export let data: {
		post: {
			data: {
				content: string;
				title: string;
			};
			id: string;
		};
	};
</script>

<ProtectedRoute roles={['admin']}>
	<EditablePost content={data.post.data.content} id={data.post.id} />
</ProtectedRoute>
