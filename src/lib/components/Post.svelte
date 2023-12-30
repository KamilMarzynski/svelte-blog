<script lang="ts">
	export let title: string;
	export let content: string;
</script>

<h1>{title}</h1>
<div>{@html content}</div>

<style>
	h1 {
		margin-bottom: 1rem;
	}
	div {
		margin-bottom: 1rem;
	}
</style>
