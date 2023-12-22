<script lang='ts'>
	import PostEditable from "$lib/components/PostEditable.svelte";

    export let data: {
        post: {
            title: string;
            content: string;
            id: string;
        };
    }
</script>

<PostEditable title={data.post.title} content={data.post.content} id={data.post.id} />