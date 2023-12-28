<script lang="ts">
	import Post from "$lib/components/Post.svelte";
	import { authStore } from '$lib/store/authStore';

    let user = $authStore.data as any;

    export let data: {
        post: {
            title: string;
            content: string;
            id: string;
        };
        // recents is available because of +layout.server.ts which is in parent directory
        // load function of this file does not return recents
        recents: {
            id: string;
            title: string;
        }[];
    }
</script>

<Post title={data.post.title} content={data.post.content} />

{#if user && user.role === "admin"}
    <a href='/posts/{data.post.id}/edit'>Edit</a>
{/if}

<style>
    a {
        display: block;
        margin-top: 1rem;
    }
</style>