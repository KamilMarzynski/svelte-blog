<script lang="ts">
	import ListPostItem from './ListPostItem.svelte';

	export let posts: {
		id: string;
		title: string;
		image: string;
	}[];
</script>

<ul>
	{#each posts as { id, title, image }}
		<li>
			<ListPostItem {id} {title} {image} />
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
