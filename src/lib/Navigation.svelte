<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  $: activePath = $page.url.pathname;

  const isSticky = writable(false);

  onMount(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      isSticky.set(scrollTop > 90);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<nav class="navbar h-16 flex items-center justify-center" class:sticky={$isSticky}>
  <ul class="ul flex justify-center gap-14">
    <li>
      <a href="/priser"
         class="no-underline text-xl text-white font-black relative overflow-hidden">
         Priser
         <div class="{activePath === '/priser' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
    <li>
      <a href="/kontakt"
         class="no-underline text-xl text-white font-black relative overflow-hidden">
         Kontakt
         <div class="{activePath === '/kontakt' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
    <li>
      <a href="/om-os"
         class="no-underline text-xl text-white font-black relative overflow-hidden">
         Om os
         <div class="{activePath === '/om-os' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
  </ul>
</nav>

<style>
  .navbar {
    z-index: 2;
    font-family: 'Montserrat', sans-serif;
  }

  .ul {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
  }

  .sticky {
    top: 0;
    position: sticky;
    background-color: #0000007b;
    transition: background-color 0.3s;
  }

  .after-hover-underline::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    bottom: -2px; /* Adjust this value to change the distance from the bottom */
    left: 0;
    border-bottom: 4px solid #F7BD4D; /* Use your brand's yellow color */
    transform-origin: bottom left;
    transition: transform 0.25s ease-out;
  }
  .after-underline::after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -2px; /* Adjust this value to change the distance from the bottom */
    left: 0;
    border-bottom: 4px solid #F7BD4D; /* This should be the same as your active color */
    transform: scaleX(1);
    transform-origin: bottom right;
  }
  a:hover .after-hover-underline::after {
    transform: scaleX(1);
  }

</style>
  