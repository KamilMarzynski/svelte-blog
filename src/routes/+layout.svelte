<script lang="ts">
    import logo from "$lib/assets/logo.png";
	import Navigation from "$lib/components/Navigation.svelte";
    import { auth, db } from "$lib/firebase/firebase";
    import { onMount } from "svelte";
    import { getDoc, doc, setDoc } from "firebase/firestore";
    import { authStore, type UserData } from "../lib/store/authStore";
    import { page } from "$app/stores";
	import { goto } from "$app/navigation";

    const nonAuthRoutes = ["/", "/posts", "/posts/[id]", "/auth/sign-in"];

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const currentPath = window.location.pathname;
            if (!user && !nonAuthRoutes.includes(currentPath)) {
                window.location.href = "/";
                return;
            }

            if (user && currentPath === "/auth/sign-in") {
                window.location.href = "/";
                return;
            }

            let dataToSetToStore: UserData = {
                role: "anonymous",
                email: '',
            };

            if (!user) {
                authStore.update((curr: any) => {
                    return {
                        ...curr,
                        ...dataToSetToStore,
                    };
                });

                return;
            }

 
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                const userRef = doc(db, "users", user.uid);
                dataToSetToStore = {
                    email: user.email,
                    role: "user",
                };
                await setDoc(userRef, dataToSetToStore, { merge: true });
            } else {
                const userData = docSnap.data();
                dataToSetToStore = {
                    email: userData.email,
                    role: userData.role,
                };
            }


            authStore.update((curr: any) => {
                return {
                    ...curr,
                    ...dataToSetToStore,
                };
            });
        });
        return unsubscribe;
    });
</script>

{#if $page.url.pathname !== '/auth/sign-in'}
    <div class="header-container">
        <div class="navigation-container">
            <Navigation />
        </div>
        {#if !$authStore || $authStore.role === 'anonymous' }  
            <button class="signin-button" on:click={() => goto('/auth/sign-in')}><b>Sign In</b></button>
        {:else} 
            <button class="logout-button" on:click={() => goto('/auth/log-out')}><b>Log Out</b></button>
        {/if}
    </div>
{/if}

<div class="logo-container">
    <img src={logo}  alt="logo"/>
</div>
<div class="content-container">
    <slot />
</div>

<style>
    img {
        height: 5rem;
    }

    button {
        border-radius: 20px;
        border: none;
        padding: 0.3rem 1.2rem;
        font-size: 15px;
        width: 6rem;
    }

    button, .signin-button {
        color: black;
        background-color: #fff;
    }

    button, .signin-button:hover {
        background-color: #eee;
    }

    button, .logout-button {
        color: white;
        background-color: #f44336;
    }

    button, .logout-button:hover {
        background-color: #da190b;
    }

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-bottom: #999 1px solid;
        padding: 0 1rem;
    }

    .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .navigation-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

</style>