<script lang="ts">
	import ListPostItem from './ListPostItem.svelte';

	export let posts: {
		id: string;
		title: string;
		image: string;
	}[];
</script>

<div class="flex flex-col items-center">
	{#each posts as { id, title, image }}
		<ListPostItem {id} {title} {image} />
	{/each}
</div>

<!-- <style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		margin-bottom: 1rem;
	} -->
<!-- </style> -->
