<script lang>
	import { authHandlers } from '../auth/auth';

	let email = '';
	let password = '';
	let confirmPass = '';
	let error = false;
	let register = false;
	let authenticating = false;

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
			console.log('There was an auth error', err);
			error = true;
			authenticating = false;
		}
	}

	function handleRegister() {
		register = !register;
	}
</script>

<div class="flex flex-col items-center">
	<div class="m-4 w-4/5 max-w-[900px]">
		<form>
			<h1 class="text-xl">{register ? 'Register' : 'Login'}</h1>
			{#if error}
				<p class="error">The information you have entered is not correct</p>
			{/if}
			<label class="label">
				<p class={email ? ' above' : ' center'}>Email</p>
				<input bind:value={email} type="email" placeholder="Email" class="input" />
			</label>
			<label class="label">
				<p class={password ? ' above' : ' center'}>Password</p>
				<input bind:value={password} type="password" placeholder="Password" class="input" />
			</label>
			{#if register}
				<label class="label">
					<p class={confirmPass ? ' above' : ' center'}>Confirm Password</p>
					<input
						bind:value={confirmPass}
						type="password"
						placeholder="Confirm Password"
						class="input"
					/>
				</label>
			{/if}

			<button on:click={handleAuthenticate} type="button" class="variant-filled btn my-2">
				{#if authenticating}
					<i class="fa-solid fa-spinner loadingSpinner" />
				{:else}
					Submit
				{/if}
			</button>
		</form>
		<div>
			{#if register}
				<div>
					<p>Already have an account?</p>
					<button class="variant-filled btn my-2" on:click={handleRegister} on:keydown={() => {}}
						>Login</button
					>
				</div>
			{:else}
				<div>
					<p>Don't have an account?</p>
					<button class="variant-filled btn my-2" on:click={handleRegister} on:keydown={() => {}}
						>Register</button
					>
				</div>
			{/if}
		</div>
	</div>
</div>
