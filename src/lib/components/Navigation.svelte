<script lang='ts'>
    import { authStore  } from "../store/authStore";
    import { authHandlers } from "../auth/auth";

    let user: any;

    authStore.subscribe((curr: any) => {
        user = curr.data;
    });
</script>


<nav>
    <a href="/">Home</a>
    <a href="/posts">Posts</a>
    {#if user != null}
        <a href="/posts/create">Add new post</a>
        <button on:click={authHandlers.logout}>Log Out</button>
    {:else}
        <a href="/auth">Log In</a>
    {/if}
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-around;
        padding: 1rem;
        background-color: #eee;
    }
    nav a {
        text-decoration: none;
        color: #333;
    }
    nav a:hover {
        text-decoration: underline;
    }
</style>