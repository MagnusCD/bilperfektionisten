<script>
  import { page } from '$app/stores';

  // Define hero content for each route
  const heroContent = {
    '/priser': {
      imageUrl: 'prices-hero-image.jpeg',
      title: 'Priser',
      subtitle: 'Find vores knivskarpe tilbud her'
    },
    '/kontakt': {
      imageUrl: 'contact-hero-image.jpeg',
      title: 'Kontakt os',
      subtitle: 'Vi er kun en mail væk'
    },
    '/om-os': {
      imageUrl: 'about-hero-image.jpeg',
      title: 'Om os',
      subtitle: 'Lær mere om hvem vi er her'
    },
    '/booking': {
      imageUrl: 'hero-image.jpeg',
      title: 'Booking',
      subtitle: 'Book en tid til bilpleje herunder'
    },
    '/admin': {
      imageUrl: 'hero-image.jpeg',
      title: 'Admin Panel',
      subtitle: ''
    },
    '/login': {
      imageUrl: 'hero-image.jpeg',
      title: 'Log ind side',
      subtitle: 'Log ind eller opret en bruger herunder'
    },
    '/register': {
      imageUrl: 'hero-image.jpeg',
      title: 'Opret bruger herunder',
      subtitle: ''
    },
  };

  // Reactive statement to update hero content based on the current route
  $: currentContent = heroContent[$page.url.pathname] || {
    imageUrl: 'hero-image.jpeg', // Default image if route not found
    title: 'Bilperfektionisten',
    subtitle: 'Bilpleje direkte til dig!'
  };

</script>

<div class="hero-image bg-cover bg-center" style="background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url({currentContent.imageUrl});">
  <div class="text-white pt-20">
    <h1 class="font-ltsaeada font-bold text-4xl text-center font-bold mb-2 flex justify-center pt-20">{currentContent.title}</h1>
    <p class="text-xl text-center flex justify-center">{currentContent.subtitle}<span class="orange pl-1"></span></p>
  </div>
  <div class="arrow-down">
    <svg class="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

<style>
  .hero-image {
    margin-top: -65px;
    height: 70vh;
    position: relative;
    z-index: -1;
  }
  
  .arrow-down {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    animation: jump 1.5s infinite, fade 1.5s infinite;
  }

  .arrow {
    width: 24px;
    height: 24px;
    color: white;
  }

  @keyframes jump {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(-10px);
    }
  }

  @keyframes fade {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
