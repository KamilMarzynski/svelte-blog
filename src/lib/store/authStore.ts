
import { writable } from "svelte/store";

export type UserData = {
    id: string,
    role: string
    email: string | null
}

export const authStore = writable<UserData>(undefined)
