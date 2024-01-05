<script lang="ts">
	import Post from '$lib/components/post/Post.svelte';

	export let content: string;
	export let id: string;
</script>

<Post {content} {id} editable={false} />
