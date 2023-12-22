<script>
	import Navigation from "$lib/components/Navigation.svelte";
</script>

<h1> My blog </h1>
<Navigation />

<slot />

<style>
    h1 {
        margin-bottom: 1rem;
    }
</style>