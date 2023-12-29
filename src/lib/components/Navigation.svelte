<script lang='ts'>
    import { authStore, type UserData  } from "../store/authStore";
	import { fade } from "svelte/transition";

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
    });
</script>

<ul>
    {#if user}
        {#each items as {name, href}}
        <li in:fade|global>
            <a href={href}><b>{name}</b></a>
        </li>
        {/each}
    {/if}
</ul>

<style>
    ul {
        display: flex;
        justify-content: left;
        background-color: #fff;
        width: 100%;
        margin: 0;
    }
    ul a {
        text-decoration: none;
        color: #333;
    }

    li {
        border-radius: 25px;
        list-style: none;
        margin-right: 5rem;
        padding: 0.3rem 1.2rem;
    }

    li:hover {
        background-color: #eee;
    }
</style>