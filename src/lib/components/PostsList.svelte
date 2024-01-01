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
