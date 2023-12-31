<script lang="ts">
	import PostsList from '$lib/components/PostsList.svelte';

	export let data: {
		recents: {
			id: string;
			title: string;
			image: string;
		}[];
	};
</script>

<PostsList posts={data.recents} />
