<script lang='ts'>
    import { authStore, type UserData  } from "../store/authStore";
    import { authHandlers } from "../auth/auth";
	import { slide } from "svelte/transition";

    let user: UserData;
    let items: { name: string, href: string }[] = [];
    
    authStore.subscribe((curr: UserData) => {
        user = curr;

        items = [
            { name: "Home", href: "/" },
            { name: "Posts", href: "/posts" },
        ];

        if (user && user.role === "admin") {
            items.push({ name: "Add new post", href: "/posts/create" });
        }

        if (user && user.role !== "anonymous") {
            items.push({ name: "Log Out", href: "/auth" });
        } else {
            items.push({ name: "Log In", href: "/auth" });
        }
    });
</script>

<ul>
    {#if user}
        {#each items as {name, href}}
        <li transition:slide|global>
            <a href={href}>{name}</a>
        </li>
        {/each}
    {/if}
</ul>

<style>
    ul {
        display: flex;
        justify-content: space-around;
        padding: 1rem;
        background-color: #eee;
        height: 1.5em;
    }
    ul a {
        text-decoration: none;
        color: #333;
    }
    ul a:hover {
        text-decoration: underline;
    }

    li {
        list-style: none;
    }
</style>