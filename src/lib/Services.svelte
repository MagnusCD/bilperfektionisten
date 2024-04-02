<script>
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    export let imageUrl = "services-offered.jpeg";
  
    let servicesInView = false;
  
    onMount(() => {
      // We will use IntersectionObserver directly for client-side handling.
      const observer = new IntersectionObserver(
        (entries) => {
          // The callback will return an array of entries, even if we're only observing one item.
          if (entries[0].isIntersecting) {
            servicesInView = true;
            // We stop observing once we have set servicesInView to true.
            observer.unobserve(entries[0].target);
          }
        },
        {
          // We only need the element to be visible at all (0.1) to start the animation.
          threshold: 0.1
        }
      );
  
      // Now we get the reference to our section and start observing it.
      const section = document.querySelector('#services-section');
      observer.observe(section);
    });
  </script>
  
  <div class="flex bg-gray-900 pt-10">
    <!-- Left side with the image -->
    <div class="image w-1/3 bg-cover bg-center" style="background-image: url({imageUrl});"></div>
  
    <!-- Right side with content -->
    <div id="services-section" class="w-2/3 flex flex-col justify-center p-10 space-y-4">
      <h2 class="title text-center text-white text-2xl font-bold mb-4">Hvad tilbyder vi?</h2>
      
      {#if servicesInView}
        <p in:fly="{{ x: -300, delay: 100, duration: 800 }}" class="flex items-center text-white text-lg">
          <span class="fas fa-xl fa-check-circle mr-2"></span>
          Udvending klargøring af hele bilen som en lakforsegling!
        </p>
        <p in:fly="{{ x: -300, delay: 300, duration: 800 }}" class="flex items-center text-white text-lg">
          <span class="fas fa-xl fa-check-circle mr-2"></span>
          Indvendig klargøring af hele kabinen, samt sæder.
        </p>
        <p in:fly="{{ x: -300, delay: 500, duration: 800 }}" class="flex items-center text-white text-lg">
          <span class="fas fa-xl fa-check-circle mr-2"></span>
          Fuldklargøring, som indeholder både det indvendige og det udvendige
        </p>
      {/if}
    </div>
  </div>
  
  <style>
    .image {
      clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
      background-position: center 25%;
    }
    .flex {
      height: 700px;
    }
    .fa-check-circle {
      color: #F8ECA3;
    }
  </style>
  