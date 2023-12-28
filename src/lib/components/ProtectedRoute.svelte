<script lang='ts'>
    export let roles: string[] = [];
	import { authStore } from "$lib/store/authStore";
	import { onMount } from "svelte";

    let loading = $authStore.loading;
    let user = $authStore.data as any;

    onMount(() => {
        if(user === null || !roles.includes(user.role)) {
            window.location.href = '/';
        }
    });
</script>

{#if loading}
    <i class="fa-solid fa-spinner loadingSpinner" />
{/if}

{#if user && roles.includes(user.role)}
    <slot />
{/if}