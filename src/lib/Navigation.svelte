<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  $: activePath = $page.url.pathname;

  const isSticky = writable(false);
  const menuOpen = writable(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    isSticky.set(scrollTop > 90);
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      menuOpen.set(false);
    }
  };

  const toggleMenu = () => {
    menuOpen.update(state => !state);
    if ($menuOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  });

  $: if ($page) {
    menuOpen.set(false);
  }
</script>

<nav class="navbar h-16 flex items-center justify-between px-4" class:sticky={$isSticky}>
  <div id="nav-icon4" class:open={$menuOpen} on:click={toggleMenu}>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <ul class="ul hidden md:flex justify-center gap-14">
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
    <li>
      <a href="/booking"
         class="no-underline text-xl text-white font-black relative overflow-hidden">
         Booking
         <div class="{activePath === '/booking' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
  </ul>
</nav>

<div class="mobile-menu bg-gray-900 md:hidden" class:open={$menuOpen}>
  <ul class="flex flex-col items-center space-y-8">
    <li>
      <a href="/priser" class="no-underline text-xl text-white font-black relative overflow-hidden text-center">
        Priser
        <div class="{activePath === '/priser' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
    <li>
      <a href="/kontakt" class="no-underline text-xl text-white font-black relative overflow-hidden text-center">
        Kontakt
        <div class="{activePath === '/kontakt' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
    <li>
      <a href="/om-os" class="no-underline text-xl text-white font-black relative overflow-hidden text-center">
        Om os
        <div class="{activePath === '/om-os' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
    <li>
      <a href="/booking" class="no-underline text-xl text-white font-black relative overflow-hidden text-center">
        Booking
        <div class="{activePath === '/booking' ? 'after-underline' : 'after-hover-underline'}"></div>
      </a>
    </li>
  </ul>
</div>

<style>
  .navbar {
    z-index: 1;
    font-family: 'Montserrat', sans-serif;
    width: 100%;
  }

  .ul {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
  }

  @media screen and (min-width: 769px) {
    .sticky {
      top: 0;
      position: sticky;
      background-color: #0000007b;
      transition: background-color 0.3s;
    }
  }

  .after-hover-underline::after,
  .after-underline::after {
    content: '';
    position: absolute;
    width: 0;
    bottom: -2px; /* Adjust this value to change the distance from the bottom */
    left: 0;
    border-bottom: 4px solid #F7BD4D; /* Use your brand's yellow color */
    transform-origin: bottom left;
    transform: scaleX(0);
    transition: transform 0.25s ease-out;
  }

  .after-hover-underline:hover::after,
  .after-underline::after {
    width: 100%;
    transform: scaleX(1);
  }

  .menu-item {
    display: inline-block;
    position: relative;
  }

  a:hover .after-hover-underline::after {
    width: 100%;
    transform: scaleX(1);
  }

  #nav-icon4 {
    width: 40px;
    height: 30px;
    position: fixed;
    right: 1rem;
    top: 1.7rem;
    z-index: 9999;
    cursor: pointer;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .5s ease-in-out;
    -moz-transition: .5s ease-in-out;
    -o-transition: .5s ease-in-out;
    transition: .5s ease-in-out;
  }

  #nav-icon4 span {
    display: block;
    position: absolute;
    height: 4px;
    width: 100%;
    background: white;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
  }

  #nav-icon4 span:nth-child(1) {
    top: 0px;
  }

  #nav-icon4 span:nth-child(2) {
    top: 12px;
  }

  #nav-icon4 span:nth-child(3) {
    top: 24px;
  }

  #nav-icon4.open span:nth-child(1) {
    top: 12px;
    -webkit-transform: rotate(135deg);
    -moz-transform: rotate(135deg);
    -o-transform: rotate(135deg);
    transform: rotate(135deg);
  }

  #nav-icon4.open span:nth-child(2) {
    opacity: 0;
    left: -60px;
  }

  #nav-icon4.open span:nth-child(3) {
    top: 12px;
    -webkit-transform: rotate(-135deg);
    -moz-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }

  @media (max-width: 768px) {
    #nav-icon4 {
      display: block;
    }

    .ul {
      display: none; /* Hide regular menu on small screens */
    }
  }

  @media (min-width: 769px) {
    #nav-icon4 {
      display: none;
    }
  }

  .mobile-menu {
    display: none;
    padding: 1rem;
    position: relative;
    overflow: auto; /* Ensure it handles overflow content */
  }

  .mobile-menu.open {
    margin-top: -65px;
    display: block;
    animation: slideDown 0.3s ease-in-out;
    height: 400px;
  }

  .mobile-menu ul {
    width: 100%; /* Ensure it spans full width */
  }

  .mobile-menu ul li {
    width: 100%; /* Ensure it spans full width */
  }

  .mobile-menu ul li a {
    display: block;
    width: 100%; /* Ensure it spans full width */
    text-align: center; /* Center text in each link */
    padding: 1rem 0; /* Add padding for better spacing */
  }
</style>
