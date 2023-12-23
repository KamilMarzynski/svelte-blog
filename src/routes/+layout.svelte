<script lang="ts">
	import Navigation from "$lib/components/Navigation.svelte";
    import { auth, db } from "$lib/firebase/firebase";
    import { onMount } from "svelte";
    import { getDoc, doc, setDoc } from "firebase/firestore";
    import { authStore } from "../lib/store/authStore";


    const nonAuthRoutes = ["/", "posts", "posts/[id]"];

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const currentPath = window.location.pathname;
            if (!user && !nonAuthRoutes.includes(currentPath)) {
                window.location.href = "/";
                return;
            }

            if (user && currentPath === "/auth") {
                window.location.href = "/posts";
                return;
            }

            if (!user) {
                return;
            }

            let dataToSetToStore: any;
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
                dataToSetToStore = userData;
            }

            authStore.update((curr: any) => {
                return {
                    ...curr,
                    user,
                    data: dataToSetToStore,
                    loading: false,
                };
            });
        });
        return unsubscribe;
    });
</script>

<h1> My blog </h1>
<Navigation />

<slot />

<style>
    h1 {
        margin-bottom: 1rem;
    }
</style>