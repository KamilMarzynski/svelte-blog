<script lang='ts'>
	import PostsList from "$lib/components/PostsList.svelte";

    export let data: {
        summaries: {
            id: string;
            title: string;
        }[];
    };
</script>

<h1>Page with list of posts, pagination etc</h1>
<PostsList posts={data.summaries} />

<style>
    h1 {
        margin-bottom: 1rem;
    }
</style>