<script lang='ts'>
    export let roles: string[] = [];
	import { authStore, type UserData } from "$lib/store/authStore";

    let user: UserData;

    authStore.subscribe((curr: UserData) => {
        user = curr;
    });
</script>

{#if !user}
    Loading...
    <i class="fa-solid fa-spinner loadingSpinner" />
{:else}
    {#if roles.includes(user.role)}
        <slot />
    {:else}
        404
    {/if}
{/if}

