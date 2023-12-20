<script lang="ts">
    export let title: string;
    export let slug: string;
</script>

<a href={`/posts/${slug}`}>{title}</a>

<style>
    a {
        display: block;
        margin-top: 1rem;
    }
</style>