<script>
    import "../app.css";
    import Preheader from "$lib/Preheader.svelte";
    import Navigation from "$lib/Navigation.svelte";
    import Hero from "$lib/Hero.svelte";
    import Footer from "$lib/Footer.svelte";
    import CookieConsent from '$lib/CookieConsent.svelte';
    import SideWidgets from "$lib/SideWidgets.svelte";
</script>


<Preheader />
<SideWidgets />
<Navigation />
<Hero />

<slot></slot>

<Footer />
<CookieConsent />

<style>

</style>
