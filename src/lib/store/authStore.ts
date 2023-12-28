
import { writable } from "svelte/store";

export type UserData = {
    role: string
    email: string | null
}

export const authStore = writable<UserData>(undefined)
