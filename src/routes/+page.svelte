<script lang='ts'>
	import PostsList from "$lib/components/PostsList.svelte";

    export let data: {
        recents: {
            slug: string;
            title: string;
        }[];
    };
</script>

<h1>Start page with most recent posts</h1>

<PostsList posts={data.recents} />

<style>
    h1 {
        margin-bottom: 1rem;
    }
</style>