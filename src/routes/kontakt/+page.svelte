<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const form = document.getElementById('myForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const honeypotField = document.getElementById('honeypot'); // Define the honeypot field here
    const formMessageDiv = document.getElementById('formMessage'); // Combined message div for success/error

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value;
      const message = messageInput.value;

      // Reset the message div
      formMessageDiv.textContent = '';
      formMessageDiv.className = ''; // Reset the class
      
      // Validation for the name field
      if (!name) {
        formMessageDiv.textContent = 'Venligst udfyld dit navn.';
        formMessageDiv.className = 'text-red-500 my-4 max-w-lg mx-auto p-4';
        return;
      }

      // Validation for email and message
      if (!email || !message) {
        formMessageDiv.textContent = 'Venligt udfyld både e-mail og besked felterne.';
        formMessageDiv.className = 'text-red-500 my-4 max-w-lg mx-auto p-4';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessageDiv.textContent = 'Venligt indsæt en valid e-mail adresse';
        formMessageDiv.className = 'text-red-500 my-4 max-w-lg mx-auto p-4';
        return;
      }

      // AJAX submission to Formspree
      fetch('https://formspree.io/f/xeqyrlde', {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          formMessageDiv.textContent = 'Tusind tak for din besked. Vi vender tilbage hurtigst muligt.';
          formMessageDiv.className = 'text-green-500 my-4 max-w-lg mx-auto p-4';
          form.reset(); // Reset the form
        } else {
          formMessageDiv.textContent = 'Der var et problem med at sende din besked. Venligst prøv igen.';
          formMessageDiv.className = 'text-red-500 my-4 max-w-lg mx-auto p-4';
        }
      }).catch(() => {
        formMessageDiv.textContent = 'Der opstod en fejl i forbindelse med forbindelsen. Venligst prøv igen.';
        formMessageDiv.className = 'text-red-500 my-4 max-w-lg mx-auto p-4';
      });
    }); 
  });
</script>



  
<!-- This is the outer container that will take the full width and height of the viewport -->
<div class="flex flex-col w-100 bg-gray-900 p-12">
  

  <!-- This is the form container that will be centered inside the outer container -->
  <form id="myForm" action="https://formspree.io/f/xeqyrlde" method="POST" class="w-full max-w-lg p-4 rounded-lg">
  

    <p class="text-white pb-4 text-lg">Udfyld felterne nedenunder for at komme i kontakt med os</p>

    
    <!-- Name Field with Placeholder -->
    <div class="mb-4">
      <input type="text" name="name" id="name" placeholder="Dit navn" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>

    <!-- Email Field with Placeholder -->
    <div class="mb-4">
      <input type="email" name="email" id="email" placeholder="Din email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>
    
    <!-- Message Field with Placeholder -->
    <div class="mb-6">
      <textarea name="message" id="message" placeholder="Din besked" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
    </div>

    <!-- Registration Number Field -->
    <div class="mb-4">
      <input type="text" name="registrationNumber" id="registrationNumber" placeholder="Registreringsnummer" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>

    <!-- Phone Number Field -->
    <div class="mb-4">
      <input type="tel" name="phoneNumber" id="phoneNumber" placeholder="Telefonnummer" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>


<!-- Work Car Radio Button Group -->
<fieldset class="mb-4">
  <legend class="text-white">Bliver bilen brugt til arbejde?</legend>
  <div class="flex items-center">
    <input type="radio" name="Bliver bilen brugt til arbejde?" id="isWorkCarYes" value="Ja" class="mr-2">
    <label for="isWorkCarYes" class="text-white mr-4">Ja</label>
    <input type="radio" name="Bliver bilen brugt til arbejde?" id="isWorkCarNo" value="Nej" class="mr-2">
    <label for="isWorkCarNo" class="text-white">Nej</label>
  </div>
</fieldset>

<!-- Pets in Car Radio Button Group -->
<fieldset class="mb-4">
  <legend class="text-white">Bliver bilen brugt til transport af dyr?</legend>
  <div class="flex items-center">
    <input type="radio" name="Bliver bilen brugt til transport af dyr?" id="hasPetsYes" value="Ja" class="mr-2">
    <label for="hasPetsYes" class="text-white mr-4">Ja</label>
    <input type="radio" name="Bliver bilen brugt til transport af dyr?" id="hasPetsNo" value="Nej" class="mr-2">
    <label for="hasPetsNo" class="text-white">Nej</label>
  </div>
</fieldset>
    
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Send
    </button>
    
    <!-- Combined Success/Error Message Field -->
    <div id="formMessage" class="mt-4 max-w-lg mx-auto p-4"></div>
  </form>

 
</div>

<style>
  #myForm {
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }
</style>
