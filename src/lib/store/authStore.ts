
import { writable } from "svelte/store";

export const authStore = writable({
    loading: true,
    user: null,
    data: null,
})
