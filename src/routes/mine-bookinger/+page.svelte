<script>
    import { db, auth } from '$lib/firebase';
    import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
    import { onAuthStateChanged } from 'firebase/auth';
    import { onMount } from 'svelte';
  
    let user = null;
    let bookings = [];
    let isLoading = true;
  
    async function fetchUserBookings() {
      if (user) {
        const bookingsSnapshot = await getDocs(query(collection(db, 'bookings'), where('email', '==', user.email)));
        bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
          if (a.date === b.date) {
            return a.start.localeCompare(b.start);
          }
          return a.date.localeCompare(b.date);
        });
      }
      isLoading = false;
    }
  
    function isDeletable(date) {
      const bookingDate = new Date(date);
      const now = new Date();
      const diff = (bookingDate - now) / (1000 * 60 * 60);
      return diff >= 48;
    }
  
    async function deleteBooking(id) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
        await fetchUserBookings();
      } catch (error) {
        console.error('Fejl ved sletning af booking: ', error);
        alert(`Sletning mislykkedes: ${error.message}`);
      }
    }
  
    onMount(() => {
      onAuthStateChanged(auth, async (u) => {
        if (u) {
          user = u;
          await fetchUserBookings();
        } else {
          // Redirect to login if not authenticated
          goto('/login');
        }
      });
    });
  </script>
  
  {#if user}
  <div class="flex flex-col w-100 bg-gray-900 p-12 pb-20">
    <h1 class="text-xl text-white font-bold mb-4 text-center">Mine Bookinger</h1>
    {#if isLoading}
      <div class="flex flex-col items-center justify-center bg-gray-900">
        <h1 class="text-lg text-white">Indlæser dine bookinger...</h1>
      </div>
    {:else if bookings.length > 0}
      <div class="booking-table w-full max-w-lg p-4 rounded-lg">
        {#each bookings as booking}
          <div class="booking-row border p-2 mb-2">
            <div class="booking-cell text-white mb-2"><strong>Navn:</strong> {booking.name}</div>
            <div class="booking-cell text-white mb-2"><strong>Email:</strong> {booking.email}</div>
            <div class="booking-cell text-white mb-2"><strong>Telefon:</strong> {booking.telephone}</div>
            <div class="booking-cell text-white mb-2"><strong>Nummerplade:</strong> {booking.nummerplade}</div>
            <div class="booking-cell text-white mb-2"><strong>Dato:</strong> {booking.date}</div>
            <div class="booking-cell text-white mb-2"><strong>Starttid:</strong> {booking.start}</div>
            <div class="booking-cell text-white mb-2"><strong>Sluttid:</strong> {booking.end}</div>
            <div class="booking-cell text-white mb-2"><strong>Service:</strong> {booking.message}</div>
            <div class="booking-cell text-white mb-2"><strong>Har der været dyr i bilen:</strong> {booking.dyrIBilen ? 'Ja' : 'Nej'}</div>
            {#if isDeletable(booking.date)}
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={() => deleteBooking(booking.id)}>Slet</button>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center bg-gray-900">
        <h1 class="text-lg text-white">Du har ingen bookinger.</h1>
      </div>
    {/if}
  </div>
  {:else}
  <div class="flex flex-col items-center justify-center bg-gray-900">
    <h1 class="text-2xl text-white">Kontrollerer godkendelse...</h1>
  </div>
  {/if}
  
  <style>
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .min-h-screen {
    min-height: 100vh;
  }
  
  .p-12 {
    padding: 3rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .mt-8 {
    margin-top: 2rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .font-bold {
    font-weight: 700;
  }
  
  .border {
    border-width: 1px;
    border-color: white;
  }
  
  .rounded {
    border-radius: 0.25rem;
  }
  
  .p-2 {
    padding: 0.5rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .shadow {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }
  
  .appearance-none {
    appearance: none;
  }
  
  .leading-tight {
    line-height: 1.25;
  }
  
  .focus\:outline-none {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  
  .focus\:shadow-outline {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
  
  .bg-blue-500 {
    background-color: #4299e1;
  }
  
  .hover\:bg-blue-700:hover {
    background-color: #2b6cb0;
  }
  
  .text-white {
    color: #ffffff;
  }
  
  .bg-red-500 {
    background-color: #f56565;
  }
  
  .hover\:bg-red-700:hover {
    background-color: #c53030;
  }
  
  .bg-gray-500 {
    background-color: #a0aec0;
  }
  
  .hover\:bg-gray-700:hover {
    background-color: #4a5568;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .block {
    display: block;
  }
  
  .focus\:outline-none {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  
  .focus\:shadow-outline:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
  
  .booking-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  .booking-row {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid white;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .booking-cell {
    padding: 0.5rem;
    border: 1px solid #444;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  @media (max-width: 768px) {
    .booking-row {
      grid-template-columns: 1fr;
    }
    
    .booking-cell {
      border-bottom: 1px solid #444;
    }
  
    .booking-cell:last-child {
      border-bottom: none;
    }
  }
  </style>
  