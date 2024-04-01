<script>
  import { page } from '$app/stores';

// Define hero content for each route
const heroContent = {
  '/priser': {
    imageUrl: 'prices-hero-image.jpeg',
    title: 'Priser',
    subtitle: 'Se vores priser her'
  },
  '/kontakt': {
    imageUrl: 'contact-hero-image.jpeg',
    title: 'Kontakt os',
    subtitle: 'Vi er kun en mail væk'
  },
  '/om-os': {
    imageUrl: 'about-hero-image.jpeg',
    title: 'Om os',
    subtitle: 'Lær mere om, hvem vi er her.'
  },
  // Add more routes as needed
};

// Reactive statement to update hero content based on the current route
$: currentContent = heroContent[$page.url.pathname] || {
  imageUrl: 'hero-image.jpeg', // Default image if route not found
  title: 'Bilperfektionisten',
  subtitle: 'Bilpleje direkte til dig!'
};

</script>

<div class="hero-image bg-cover bg-center" style="background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url({currentContent.imageUrl});">
  <div class="text-white pt-20">
    <h1 class="font-ltsaeada font-bold text-4xl text-center font-bold mb-2 flex justify-center pt-20">{currentContent.title}</h1>
    <p class="text-xl text-center flex justify-center">{currentContent.subtitle}<span class="orange pl-1"></span></p>
  </div>
</div>

<style>
  .hero-image {
    margin-top: -65px;
    height: 90vh;
  }
</style>
