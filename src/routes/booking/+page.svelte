<script>
  import { db, auth } from '$lib/firebase';
  import { collection, getDocs, addDoc, query, where, deleteDoc, updateDoc, doc } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let telephone = '';
  let selectedDate = '';
  let startTime = '';
  let message = ''; 
  let availableSlots = [];
  let noSlotsAvailableMessage = '';
  let upcomingDates = getUpcomingDates(14); // Get dates for the next 14 days (2 weeks)
  let user = null;
  let bookings = [];
  let isLoading = true;
  let editMode = { status: false, id: null };
  let updatedBooking = { name: '', email: '', telephone: '', date: '', start: '', end: '', message: '' };

  const serviceDurations = {
      "Fuld Klargøring": 2,
      "Udvendig Klargøring": 1,
      "Indvendig Klargøring": 1
  };

  function getUpcomingDates(days) {
      let dates = [];
      let currentDate = new Date();
      for (let i = 0; i < days; i++) {
          let date = new Date();
          date.setDate(currentDate.getDate() + i);
          dates.push(date.toISOString().split('T')[0]);
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
                  return (slot.end <= booking.start || slot.start >= booking.end);
              });
          });

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
      end.setHours(hours + duration, minutes);
      return end.toTimeString().split(' ')[0].slice(0, 5);
  }

  async function handleBooking() {
      try {
          const endTime = calculateEndTime(startTime, message);

          await addDoc(collection(db, 'bookings'), {
              name,
              email,
              telephone,
              date: selectedDate,
              start: startTime,
              end: endTime,
              message,
              timestamp: new Date()
          });
          alert('Booking successful!');
          name = '';
          telephone = '';
          selectedDate = '';
          startTime = '';
          message = '';
          await fetchAvailableSlots();
          await fetchUserBookings();
      } catch (error) {
          console.error('Error adding document: ', error);
          alert(`Booking failed: ${error.message}`);
      }
  }

  async function fetchUserBookings() {
      if (user) {
          const bookingsSnapshot = await getDocs(query(collection(db, 'bookings'), where('email', '==', user.email)));
          bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      isLoading = false;
  }

  function setEditMode(booking) {
      editMode = { status: true, id: booking.id };
      updatedBooking = { ...booking };
  }

  async function saveEdit() {
      await updateDoc(doc(db, 'bookings', editMode.id), updatedBooking);
      editMode = { status: false, id: null };
      await fetchUserBookings();
  }

  async function deleteBooking(id) {
      await deleteDoc(doc(db, 'bookings', id));
      await fetchUserBookings();
  }

  async function cancelEdit() {
      editMode = { status: false, id: null };
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
  <h1 class="text-xl text-white font-bold mb-4 text-center">Booking Form</h1>
  <form on:submit|preventDefault={handleBooking} class="w-full max-w-lg p-4 rounded-lg">
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Navn" bind:value={name} required />
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" bind:value={email} disabled />
    <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="tel" placeholder="Telefon" bind:value={telephone} required />
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
      <option value="Fuld Klargøring">Fuld Klargøring (2 timer)</option>
      <option value="Udvendig Klargøring">Udvendig Klargøring (1 time)</option>
      <option value="Indvendig Klargøring">Indvendig Klargøring (1 time)</option>
    </select>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={noSlotsAvailableMessage}>
      Bekræft Booking
    </button>
  </form>

  <h1 class="text-xl text-white font-bold mb-4 text-center mt-8">My Bookings</h1>
  {#if isLoading}
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 class="text-2xl text-white mb-6">Loading your bookings...</h1>
    </div>
  {:else if bookings.length > 0}
    <div class="booking-table w-full max-w-lg p-4 rounded-lg">
      {#each bookings as booking}
        {#if editMode.status && editMode.id === booking.id}
          <div class="booking-row border p-2 mb-2">
            <input type="text" bind:value={updatedBooking.name} class="input-field mb-2" />
            <input type="email" bind:value={updatedBooking.email} class="input-field mb-2" disabled />
            <input type="tel" bind:value={updatedBooking.telephone} class="input-field mb-2" />
            <input type="date" bind:value={updatedBooking.date} class="input-field mb-2" />
            <input type="time" bind:value={updatedBooking.start} class="input-field mb-2" />
            <input type="time" bind:value={updatedBooking.end} class="input-field mb-2" />
            <select bind:value={updatedBooking.message} class="input-field mb-2">
              <option value="Fuld Klargøring">Fuld Klargøring</option>
              <option value="Udvendig Klargøring">Udvendig Klargøring</option>
              <option value="Indvendig Klargøring">Indvendig Klargøring</option>
            </select>
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" on:click={saveEdit}>Save</button>
            <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" on:click={cancelEdit}>Cancel</button>
          </div>
        {:else}
          <div class="booking-row border p-2 mb-2">
            <div class="booking-cell text-white mb-2"><strong>Name:</strong> {booking.name}</div>
            <div class="booking-cell text-white mb-2"><strong>Email:</strong> {booking.email}</div>
            <div class="booking-cell text-white mb-2"><strong>Telephone:</strong> {booking.telephone}</div>
            <div class="booking-cell text-white mb-2"><strong>Date:</strong> {booking.date}</div>
            <div class="booking-cell text-white mb-2"><strong>Start Time:</strong> {booking.start}</div>
            <div class="booking-cell text-white mb-2"><strong>End Time:</strong> {booking.end}</div>
            <div class="booking-cell text-white mb-2"><strong>Service:</strong> {booking.message}</div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" on:click={() => setEditMode(booking)}>Edit</button>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={() => deleteBooking(booking.id)}>Delete</button>
          </div>
        {/if}
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 class="text-2xl text-white mb-6">You have no bookings.</h1>
    </div>
  {/if}
</div>
{:else}
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
  <h1 class="text-2xl text-white mb-6">Checking authentication...</h1>
</div>
{/if}

<style>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.flex-col {
  flex-direction: column;
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

.bg-green-500 {
  background-color: #48bb78;
}

.hover\:bg-green-700:hover {
  background-color: #2f855a;
}

.bg-gray-500 {
  background-color: #a0aec0;
}

.hover\:bg-gray-700:hover {
  background-color: #4a5568;
}

.bg-red-500 {
  background-color: #f56565;
}

.hover\:bg-red-700:hover {
  background-color: #c53030;
}
</style>
