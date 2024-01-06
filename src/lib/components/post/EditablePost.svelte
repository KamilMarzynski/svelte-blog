<script lang="ts">
	import EditorTheme from '$lib/components/post/EditorTheme.svelte';
	import Post from '$lib/components/post/Post.svelte';

	export let content: string | undefined = undefined;
	export let id: string | undefined = undefined;
</script>

<EditorTheme>
	<Post {content} {id} editable={true} />
</EditorTheme>
