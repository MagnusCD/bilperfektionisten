<script>
    import { db } from '$lib/firebase';
    import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';

    let name = '';
    let email = '';
    let telephone = '';
    let selectedDate = '';
    let startTime = '';
    let endTime = '';
    let message = ''; 
    let availableSlots = [];
    let noSlotsAvailableMessage = '';
    let upcomingDates = getUpcomingDates(14); // Get dates for the next 14 days (2 weeks)

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

    async function handleBooking() {
        try {
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
            email = '';
            telephone = '';
            selectedDate = '';
            startTime = '';
            endTime = '';
            message = '';
            await fetchAvailableSlots();
        } catch (error) {
            console.error('Error adding document: ', error);
            alert(`Booking failed: ${error.message}`);
        }
    }

    onMount(async () => {
        if (selectedDate) {
            await fetchAvailableSlots();
        }
    });
</script>

<div class="flex flex-col w-100 bg-gray-900 p-12 pb-20">
    <h1 class="text-xl text-white font-bold mb-4 text-center">Booking Form</h1>
    <form on:submit|preventDefault={handleBooking} class="w-full max-w-lg p-4 rounded-lg">
      <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Navn" bind:value={name} required />
      <input class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" bind:value={email} required />
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
      <select class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={endTime} required disabled={!startTime}>
        <option value="" disabled selected>{noSlotsAvailableMessage || 'Vælg sluttidspunkt'}</option>
        {#each availableSlots.filter(slot => slot.start >= startTime) as slot}
          <option value={slot.end}>{slot.end}</option>
        {/each}
      </select>
      <select class="mb-4 p-2 border rounded w-full shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={message} required>
        <option value="" disabled selected>Vælg service type</option>
        <option value="Fuld Klargøring">Fuld Klargøring</option>
        <option value="Udvendig Klargøring">Udvendig Klargøring</option>
        <option value="Indvendig Klargøring">Indvendig Klargøring</option>
      </select>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full focus:outline-none focus:shadow-outline" type="submit" disabled={noSlotsAvailableMessage}>
        Bekræft Booking
      </button>
    </form>
  </div>
  
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
  </style>
