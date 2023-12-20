<script lang='ts'>
    export let data: {
        summaries: {
            slug: string;
            title: string;
        }[];
    };
</script>

<h1>Page with list of posts, pagination etc</h1>

<ul>
    {#each data.summaries as { slug, title }}
        <li>
            <a href="/posts/{slug}">{title}</a>
        </li>
    {/each}
</ul>