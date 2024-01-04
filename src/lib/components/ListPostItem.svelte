<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let id: string;
	export let image: string;
</script>

<button on:click={() => goto(`/posts/${id}`)} class="my-2 block max-w-208 p-4">
	<div class="flex content-between">
		<img
			class="aspect-square h-1/2 max-h-72 w-1/2 max-w-72 object-cover shadow-lg"
			src={image}
			alt={title}
		/>
		<div class="flex flex-col items-start pl-4">
			<span class="text-2xl">{title}</span>
			<span class="text-left"
				>First lines of text, very long text, lorem ipsum asjdkakjf akjdsakjldf alkjf, even longer
				text
			</span>
		</div>
	</div>
</button>
