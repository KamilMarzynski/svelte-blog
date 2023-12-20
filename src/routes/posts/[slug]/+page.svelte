<script lang="ts">
    import { page } from '$app/stores';
	import Post from "$lib/components/Post.svelte";

    export let data: {
        post: {
            title: string;
            content: string;
            slug: string;
        };
        // recents is available because of +layout.server.ts which is in parent directory
        // load function of this file does not return recents
        recents: {
            slug: string;
            title: string;
        }[];
    }
</script>

<Post title={data.post.title} content={data.post.content} />

<a href='{$page.url}/edit'>Edit</a>

<style>
    a {
        display: block;
        margin-top: 1rem;
    }
</style>