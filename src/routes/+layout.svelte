<script>
    import "../app.css";
    import Preheader from "../lib/Preheader.svelte";
    import Navigation from "../lib/Navigation.svelte";
    import Hero from "../lib/Hero.svelte";
    import Footer from "../lib/Footer.svelte";
    import CookieConsent from '$lib/CookieConsent.svelte';
</script>


<Preheader />
<Navigation />
<Hero />

<slot></slot>

<Footer />
<CookieConsent />

<style>

</style>
