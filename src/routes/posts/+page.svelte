<script lang="ts">
	import PostsList from '$lib/components/PostsList.svelte';

	export let data: {
		summaries: {
			id: string;
			title: string;
			image: string;
		}[];
	};
</script>

<PostsList posts={data.summaries} />
