<script>
    import { onMount } from 'svelte';
  
    let consentGiven = false;
  
    onMount(() => {
      consentGiven = localStorage.getItem('cookieConsent') === 'true';
    });
  
    function giveConsent() {
      localStorage.setItem('cookieConsent', 'true');
      consentGiven = true;
    }
  </script>
  
  {#if !consentGiven}
  <div class="shadow fixed bottom-0 left-0 right-0 bg-white text-black p-4 flex justify-between items-center">
    <p>Vi bruger cookies! Ved at forstætte med at bruge denne hjemmeside, accepterer du brug af cookies.</p>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={giveConsent}>Accepter</button>
  </div>
  {/if}
  