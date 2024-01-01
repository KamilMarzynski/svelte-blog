<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let id: string;
	export let image: string;
</script>

<button
	on:click={() => goto(`/posts/${id}`)}
	class="max-w-208 card-hover block rounded-lg p-4 hover:variant-glass-surface"
>
	<div class="flex content-between">
		<img class="h-1/2 max-h-72 w-1/2 max-w-72 rounded-lg object-cover" src={image} alt={title} />
		<div class="flex flex-col items-start pl-4">
			<span class="text-2xl">{title}</span>
			<span class="text-left"
				>First lines of text, very long text, lorem ipsum asjdkakjf akjdsakjldf alkjf, even longer
				text
			</span>
		</div>
	</div>
</button>
