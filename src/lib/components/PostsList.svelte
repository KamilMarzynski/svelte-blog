<script lang='ts'>
    import ListPostItem from './ListPostItem.svelte';

    export let posts: {
        id: string;
        title: string;
    }[]
</script>

<ul>
    {#each posts as { id, title }}
        <li>
            <ListPostItem id={id} title={title} />
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    li {
        margin-bottom: 1rem;
    }
</style>