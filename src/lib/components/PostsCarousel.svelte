<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	let elemCarousel: HTMLDivElement;
	export let posts: {
		id: string;
		title: string;
		image: string;
	}[];

	function carouselLeft(): void {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
	}

	function carouselRight(): void {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
	}
</script>

<div class="flex flex-col items-center">
	<div class="grid max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
		<!-- Button: Left -->
		<button type="button" class="variant-filled btn-icon" on:click={carouselLeft}>
			<ArrowLeft />
		</button>
		<!-- Full Images -->
		<div
			bind:this={elemCarousel}
			class="flex snap-x snap-mandatory overflow-x-hidden scroll-smooth"
		>
			{#each posts as { id, title, image }}
				<div
					class="relative min-w-fit cursor-pointer snap-center flex-col"
					on:click={() => goto(`/posts/${id}`)}
				>
					<img
						class="aspect-[2/1] w-[1440px] snap-center object-cover"
						src={image}
						alt={title}
						loading="lazy"
					/>
					<span class="absolute bottom-2 left-2 text-white sm:bottom-8 sm:left-6 sm:text-6xl">
						{title}
					</span>
				</div>
			{/each}
		</div>
		<!-- Button: Right -->
		<button type="button" class="variant-filled btn-icon" on:click={carouselRight}>
			<ArrowRight />
		</button>
	</div>
</div>
