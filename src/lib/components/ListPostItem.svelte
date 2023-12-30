<script lang="ts">
	export let title: string;
	export let id: string;
</script>

<a href={`/posts/${id}`}>{title}</a>

<style>
	a {
		display: block;
		margin-top: 1rem;
	}
</style>
