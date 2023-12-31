<script lang="ts">
	export let title: string;
	export let id: string;
	export let image: string;
</script>

<div>
	<img src={image} alt={title} />
	<a href={`/posts/${id}`}>{title}</a>
</div>

<style>
	div {
		margin-bottom: 1rem;
		display: flex;
		align-items: left;
	}
	a {
		display: block;
		margin-top: 1rem;
	}

	img {
		float: left;
		width: 15rem;
		height: 10rem;
		object-fit: cover;
	}
</style>
