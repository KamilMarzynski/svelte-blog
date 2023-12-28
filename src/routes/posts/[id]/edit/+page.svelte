<script lang='ts'>
	import PostEditable from "$lib/components/PostEditable.svelte";
	import ProtectedRoute from "$lib/components/ProtectedRoute.svelte";

    export let data: {
        post: {
            title: string;
            content: string;
            id: string;
        };
    }
</script>


<ProtectedRoute roles={['admin']}>
    <PostEditable title={data.post.title} content={data.post.content} id={data.post.id} />
</ProtectedRoute>