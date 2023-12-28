
import { writable } from "svelte/store";

export type UserData = {
    role: string
    email: string
}

export const authStore = writable({
    loading: true,
    user: null,
    data: null,
})
