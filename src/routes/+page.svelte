<script lang="ts">
	import PostsCarousel from '$lib/components/PostsCarousel.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	export let data: {
		recents: {
			id: string;
			title: string;
			image: string;
		}[];
	};
</script>

<PostsCarousel posts={data.recents} />

<!-- <PostsList posts={data.recents} /> -->
