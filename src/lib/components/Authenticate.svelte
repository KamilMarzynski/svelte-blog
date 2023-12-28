<script lang>
	import { goto } from "$app/navigation";
	import { authStore } from "$lib/store/authStore";
    import { authHandlers } from "../auth/auth";

    let email = "";
    let password = "";
    let confirmPass = "";
    let error = false;
    let register = false;
    let authenticating = false;

    let user;

    authStore.subscribe((curr) => {
        user = curr;

        if (user?.role !== "anonymous") {
            authHandlers.logout();
            goto("/");
        }
    });

    async function handleAuthenticate() {
        if (authenticating) {
            return;
        }
        if (!email || !password || (register && !confirmPass)) {
            error = true;
            return;
        }
        authenticating = true;

        try {
            if (!register) {
                await authHandlers.login(email, password);
            } else {
                await authHandlers.signup(email, password);
            }
        } catch (err) {
            console.log("There was an auth error", err);
            error = true;
            authenticating = false;
        }
    }

    function handleRegister() {
        register = !register;
    }
</script>

<div class="authContainer">
    <form>
        <h1>{register ? "Register" : "Login"}</h1>
        {#if error}
            <p class="error">The information you have entered is not correct</p>
        {/if}
        <label>
            <p class={email ? " above" : " center"}>Email</p>
            <input bind:value={email} type="email" placeholder="Email" />
        </label>
        <label>
            <p class={password ? " above" : " center"}>Password</p>
            <input
                bind:value={password}
                type="password"
                placeholder="Password"
            />
        </label>
        {#if register}
            <label>
                <p class={confirmPass ? " above" : " center"}>
                    Confirm Password
                </p>
                <input
                    bind:value={confirmPass}
                    type="password"
                    placeholder="Confirm Password"
                />
            </label>
        {/if}

        <button on:click={handleAuthenticate} type="button" class="submitBtn">
            {#if authenticating}
                <i class="fa-solid fa-spinner loadingSpinner" />
            {:else}
                Submit
            {/if}
        </button>
    </form>
    <div class="options">
        <p>Or</p>
        {#if register}
            <div>
                <p>Already have an account?</p>
                <p on:click={handleRegister} on:keydown={() => {}}>Login</p>
            </div>
        {:else}
            <div>
                <p>Don't have an account?</p>
                <p on:click={handleRegister} on:keydown={() => {}}>Register</p>
            </div>
        {/if}
    </div>
</div>