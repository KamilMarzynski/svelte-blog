<script lang="ts">
	import Navigation from "$lib/components/Navigation.svelte";
    import { auth, db } from "$lib/firebase/firebase";
    import { onMount } from "svelte";
    import { getDoc, doc, setDoc } from "firebase/firestore";
    import { authStore, type UserData } from "../lib/store/authStore";
    import { page } from "$app/stores";
	import { goto } from "$app/navigation";

    const nonAuthRoutes = ["/", "posts", "posts/[id]", "/auth"];

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const currentPath = window.location.pathname;
            if (!user && !nonAuthRoutes.includes(currentPath)) {
                window.location.href = "/";
                return;
            }

            if (user && currentPath === "/auth") {
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

<h1> My blog </h1> <button on:click={() => goto('/auth')}> {#if !$authStore || $authStore.role === 'anonymous' } Log In {:else} Log Out {/if} </button>
{#if $page.url.pathname !== '/auth'}
    <Navigation />
{/if}
<slot />

<style>
    h1 {
        margin-bottom: 1rem;
    }

    button {
        margin-bottom: 1rem;
    }
</style>