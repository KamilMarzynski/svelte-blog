<script lang="ts">
    export let data: {
        post: {
            title: string;
            content: string;
        };
        // summaries is available because of +layout.server.ts which is in parent directory
        // load function of this file does not return summaries
        summaries: {
            slug: string;
            title: string;
        }[];
    }
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
