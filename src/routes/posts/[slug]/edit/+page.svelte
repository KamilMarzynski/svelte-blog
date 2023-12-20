<script lang='ts'>
	import PostEditable from "$lib/components/PostEditable.svelte";

    export let data: {
        post: {
            title: string;
            content: string;
            slug: string;
        };
    }
</script>

<PostEditable title={data.post.title} content={data.post.content} slug={data.post.slug} />