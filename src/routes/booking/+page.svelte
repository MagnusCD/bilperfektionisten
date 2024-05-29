<script>
  import { db, auth } from '$lib/firebase';
  import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let telephone = '';
  let nummerplade = '';
  let by = ''; // Added field for city
  let adresse = ''; // Added field for street number
  let kommentar = ''; // Added field for comments
  let selectedDate = '';
  let startTime = '';
  let message = ''; 
  let dyrIBilen = false;
  let gdprAccepted = false; // Added GDPR checkbox
  let availableSlots = [];
  let noSlotsAvailableMessage = '';
  let upcomingDates = getUpcomingDates(14);
  let user = null;
  let bookings = [];
  let isLoading = true;

  const serviceDurations = {
      "Fuld Klargøring": 119, // Updated to subtract one minute
      "Udvendig Klargøring": 59, // Updated to subtract one minute
      "Indvendig Klargøring": 59 // Updated to subtract one minute
  };

  function getUpcomingDates(days) {
      let dates = [];
      let currentDate = new Date();
      for (let i = 0; i < days; i++) {
          let date = new Date();
          date.setDate(currentDate.getDate() + i);
          // Exclude weekends
          if (date.getDay() !== 0 && date.getDay() !== 6) {
              dates.push(date.toISOString().split('T')[0]);
          }
      }
      return dates;
  }

  async function fetchAvailableSlots() {
      if (selectedDate) {
          const timesSnapshot = await getDocs(collection(db, 'available_times'));
          let definedSlots = timesSnapshot.docs.map(doc => doc.data());

          const bookingsSnapshot = await getDocs(query(collection(db, 'bookings'), where('date', '==', selectedDate)));
          let bookings = bookingsSnapshot.docs.map(doc => doc.data());

          availableSlots = definedSlots.filter(slot => {
              return bookings.every(booking => {
                  const bookingStart = new Date(`${selectedDate}T${booking.start}`);
                  const bookingEnd = new Date(`${selectedDate}T${booking.end}`);
                  const slotStart = new Date(`${selectedDate}T${slot.start}`);
                  const slotEnd = new Date(`${selectedDate}T${slot.end}`);
                  return (slotEnd <= bookingStart || slotStart >= bookingEnd);
              });
          }).sort((a, b) => a.start.localeCompare(b.start));

          noSlotsAvailableMessage = availableSlots.length === 0 ? 'Ingen ledige tider denne dag' : '';
      } else {
          availableSlots = [];
          noSlotsAvailableMessage = '';
      }
  }

  function calculateEndTime(start, serviceType) {
      const [hours, minutes] = start.split(':').map(Number);
      const duration = serviceDurations[serviceType];
      const end = new Date();
      end.setHours(hours, minutes + duration);
      return end.toTimeString().split(' ')[0].slice(0, 5);
  }

  function isBookingWithin12Hours(selectedDate, startTime) {
      const now = new Date();
      const bookingDateTime = new Date(`${selectedDate}T${startTime}`);
      const hoursDifference = (bookingDateTime - now) / (1000 * 60 * 60);
      return hoursDifference < 12;
  }

  async function handleBooking() {
      try {
          if (isBookingWithin12Hours(selectedDate, startTime)) {
              alert('Du kan ikke booke tider mindre end 12 timer fra nu.');
              return;
          }

          if (!gdprAccepted) {
              alert('Du skal acceptere behandlingen af personfølsomme data.');
              return;
          }

          const endTime = calculateEndTime(startTime, message);

          await addDoc(collection(db, 'bookings'), {
              name,
              email,
              telephone,
              nummerplade,
              by, // Added field for city
              adresse, // Added field for street number
              kommentar, // Added field for comments
              date: selectedDate,
              start: startTime,
              end: endTime,
              message,
              dyrIBilen,
              timestamp: new Date()
          });
          alert('Booking bekræftet!');
          name = '';
          telephone = '';
          nummerplade = '';
          by = ''; // Reset city field
          adresse = ''; // Reset street number field
          kommentar = ''; // Reset comments field
          selectedDate = '';
          startTime = '';
          message = '';
          dyrIBilen = false;
          gdprAccepted = false; // Reset GDPR checkbox
          await fetchAvailableSlots();
          await fetchUserBookings();
      } catch (error) {
          console.error('Fejl ved oprettelse af booking: ', error);
          alert(`Booking mislykkedes: ${error.message}`);
      }
  }

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
              email = u.email;
              if (selectedDate) {
                  fetchAvailableSlots();
              }
              await fetchUserBookings();
          } else {
              goto('/login');
          }
      });
  });
</script>

{#if user}
<div class="flex flex-col w-100 bg-gray-900 p-12 pb-20">
  <h1 class="text-xl text-white font-bold mb-4 text-center">Booking Formular</h1>
  <form on:submit|preventDefault={handleBooking} class="w-full max-w-lg p-4 rounded-lg">
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Navn" bind:value={name} required />
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" bind:value={email} disabled />
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="tel" placeholder="Telefon" bind:value={telephone} required />
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Nummerplade" bind:value={nummerplade} required />
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="By" bind:value={by} required /> <!-- Added city field -->
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Adresse" bind:value={adresse} required /> <!-- Added street number field -->
    <textarea class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Kommentar (valgfri)" bind:value={kommentar}></textarea> <!-- Added comments field -->
    <select class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={selectedDate} on:change={fetchAvailableSlots} required>
      <option value="" disabled selected>Vælg dato</option>
      {#each upcomingDates as date}
        <option value={date}>{date}</option>
      {/each}
    </select>
    <select class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={startTime} required disabled={!availableSlots.length}>
      <option value="" disabled selected>{noSlotsAvailableMessage || 'Vælg starttidspunkt'}</option>
      {#each availableSlots as slot}
        <option value={slot.start}>{slot.start}</option>
      {/each}
    </select>
    <select class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={message} required>
      <option value="" disabled selected>Vælg service type</option>
      <option value="Fuld Klargøring">Fuld Klargøring (1 time 59 minutter)</option>
      <option value="Udvendig Klargøring">Udvendig Klargøring (59 minutter)</option>
      <option value="Indvendig Klargøring">Indvendig Klargøring (59 minutter)</option>
    </select>
    <label class="inline-flex items-center mt-3">
      <span class="mr-2 text-white">Har der været dyr i bilen?</span> 
      <input type="checkbox" bind:checked={dyrIBilen} class="form-checkbox h-5 w-5 text-blue-600">
    </label>
    <label class="inline-flex items-center mt-3">
      <span class="mr-2 text-white">Jeg accepterer behandlingen af personfølsomme data</span> 
      <input type="checkbox" bind:checked={gdprAccepted} class="form-checkbox h-5 w-5 text-blue-600" required>
    </label>
    <br><br>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" type="submit" disabled={noSlotsAvailableMessage}>
      Bekræft Booking
    </button>
    <br><br>
    <p class="text-white"><strong>Bemærk:</strong> bookinger kan kun slettes op til 48 timer inden aftalen indtræffer. Ønsker du at ændre noget ved din aftale, så ring eller skriv til os. Ved udeblivelse uden forudgående aftale, afregnes et gebyr på 200 kr.</p>
  </form>

  <h1 class="text-xl text-white font-bold mb-4 text-center mt-8">Mine Bookinger</h1>
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
          <div class="booking-cell text-white mb-2"><strong>By:</strong> {booking.by}</div> <!-- Added city field -->
          <div class="booking-cell text-white mb-2"><strong>Adresse:</strong> {booking.adresse}</div> <!-- Added street number field -->
          <div class="booking-cell text-white mb-2"><strong>Kommentar:</strong> {booking.kommentar}</div> <!-- Added comments field -->
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
</style>
