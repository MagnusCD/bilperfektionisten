<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const form = document.getElementById('myForm');
    const nameInput = document.getElementById('name'); // Add variable for the name input
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const errorDiv = document.getElementById('formError');
    const successDiv = document.getElementById('formSuccess');

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = nameInput.value.trim(); // Trim whitespace from the name
      const email = emailInput.value;
      const message = messageInput.value;
      
      // Reset error and success messages
      errorDiv.textContent = '';
      successDiv.textContent = '';
      
      // Validation for the name field
      if (!name) {
        errorDiv.textContent = 'Please fill out your name.';
        return;
      }
      // Optionally, add more specific validation for the name here
      
      // Existing validation for email and message
      if (!email || !message) {
          errorDiv.textContent = 'Please fill out both the email and message fields.';
          return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          errorDiv.textContent = 'Please enter a valid email address.';
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
              successDiv.textContent = 'Tusind tak for din besked. Vi vender tilbage hurtigst muligt.';
              form.reset(); // Optionally reset the form
          } else {
              errorDiv.textContent = 'Der var et problem med at sende din besked. Venligst prøv igen.';
          }
      });
    });
  });
</script>

  
<!-- This is the outer container that will take the full width and height of the viewport -->
<div class="flex flex-col w-100 bg-gray-900 p-12">
  

  <!-- This is the form container that will be centered inside the outer container -->
  <form id="myForm" action="https://formspree.io/f/xeqyrlde" method="POST" class="w-full max-w-lg p-4 rounded-lg">
    <div id="formError" class="text-red-500 mb-2"></div>

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

    <p class="text-white pb-4">Kryds felterne af, hvis det er gældende for dig</p>

    <!-- Work Car Checkbox -->
    <div class="mb-4 flex items-center">
      <input type="checkbox" name="isWorkCar" id="isWorkCar" class="mr-2">
      <label for="isWorkCar" class="text-white">Er din bil en arbejdsbil?</label>
    </div>

    <!-- Pets in Car Checkbox -->
    <div class="mb-4 flex items-center">
      <input type="checkbox" name="hasPets" id="hasPets" class="mr-2">
      <label for="hasPets" class="text-white">Bliver din bil brugt til transport af dyr?</label>
    </div>

    
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Send
    </button>
  </form>

  <div id="formSuccess" class="text-green-500 mt-4 max-w-lg mx-auto p-4"></div>
</div>

<style>
  #myForm {

    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }
</style>
