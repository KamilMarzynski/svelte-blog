<script lang="ts">
	import { cn } from '../../helpers';
	import { type ComponentType, createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher<{
		active: HTMLElement;
	}>();
	export let text = '';
	export let description = '';
	export let icon: ComponentType | null = null;
	export let active = false;
	export let onClick = () => {};
	let element: HTMLElement;
	$: {
		if (active) {
			// wait for next tick make sure layout is ready
			setTimeout(() => {
				dispatcher('active', element);
			});
		}
	}
</script>

<button
	on:click={onClick}
	bind:this={element}
	class={cn(
		`hover:bg-muted/70 grid h-[60px] w-full cursor-pointer 
     grid-cols-[40px,auto] items-center rounded-lg border-none outline-none`,
		active && 'bg-secondary'
	)}
>
	<div class="flex h-10 w-10 items-center justify-center pl-4">
		<svelte:component this={icon} size={24} />
	</div>
	<div class="ml-4 w-full text-left">
		<p class="text-base font-medium">
			{text}
		</p>
		<p class="text-sm">
			{description}
		</p>
	</div>
</button>
