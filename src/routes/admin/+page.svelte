<script>
    import { db, auth } from '$lib/firebase';
    import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
    import { onAuthStateChanged } from 'firebase/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let bookings = [];
    let newTime = { start: '', end: '', date: '' };
    let availableTimes = [];
    let editMode = { status: false, id: null, type: '' };
    let updatedBooking = { name: '', email: '', telephone: '', date: '', start: '', end: '', message: '' };
    let updatedTime = { start: '', end: '', date: '' };
    let newGeneralTime = { start: '', end: '' };
    let user = null;
    let isLoading = true;

    async function fetchBookings() {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async function fetchAvailableTimes() {
        const querySnapshot = await getDocs(collection(db, 'available_times'));
        availableTimes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async function addAvailableTime() {
        await addDoc(collection(db, 'available_times'), newTime);
        newTime = { start: '', end: '', date: '' };
        await fetchAvailableTimes();
    }

    async function addGeneralTime() {
        await addDoc(collection(db, 'available_times'), newGeneralTime);
        newGeneralTime = { start: '', end: '' };
        await fetchAvailableTimes();
    }

    async function deleteBooking(id) {
        await deleteDoc(doc(db, 'bookings', id));
        await fetchBookings();
    }

    async function deleteAvailableTime(id) {
        await deleteDoc(doc(db, 'available_times', id));
        await fetchAvailableTimes();
    }

    function setEditMode(item, type) {
        editMode = { status: true, id: item.id, type };
        if (type === 'booking') {
            updatedBooking = { ...item };
        } else if (type === 'time') {
            updatedTime = { ...item };
        }
    }

    async function saveEdit() {
        if (editMode.type === 'booking') {
            await updateDoc(doc(db, 'bookings', editMode.id), updatedBooking);
            await fetchBookings();
        } else if (editMode.type === 'time') {
            await updateDoc(doc(db, 'available_times', editMode.id), updatedTime);
            await fetchAvailableTimes();
        }
        editMode = { status: false, id: null, type: '' };
    }

    async function cancelEdit() {
        editMode = { status: false, id: null, type: '' };
    }

    async function fetchUserRole(uid) {
        const roleDoc = await getDoc(doc(db, 'roles', uid));
        if (roleDoc.exists()) {
            return roleDoc.data().role;
        } else {
            return null;
        }
    }

    onMount(async () => {
        onAuthStateChanged(auth, async (u) => {
            if (u) {
                const role = await fetchUserRole(u.uid);
                if (role !== 'admin') {
                    goto('/booking');
                } else {
                    user = u;
                    await fetchBookings();
                    await fetchAvailableTimes();
                }
            } else {
                goto('/login');
            }
            isLoading = false;
        });
    });
</script>

{#if isLoading}
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    <h1 class="text-2xl text-white mb-6">Checking authentication...</h1>
  </div>
{:else if user}
  <div class="flex flex-col w-100 bg-gray-900 p-12 pb-20">
    <div class="p-12 text-white max-w-4xl mx-auto">
      <h1 class="text-xl font-bold mb-4">Admin Panel</h1>
      
      <h2 class="text-lg font-bold mb-4">Bookings</h2>
      <div class="booking-table">
        {#each bookings as booking}
          {#if editMode.status && editMode.id === booking.id && editMode.type === 'booking'}
            <div class="booking-row edit-mode">
              <input type="text" bind:value={updatedBooking.name} class="input-field" placeholder="Name" />
              <input type="email" bind:value={updatedBooking.email} class="input-field" placeholder="Email" />
              <input type="tel" bind:value={updatedBooking.telephone} class="input-field" placeholder="Telephone" />
              <input type="date" bind:value={updatedBooking.date} class="input-field" placeholder="Date" />
              <input type="time" bind:value={updatedBooking.start} class="input-field" placeholder="Start Time" />
              <input type="time" bind:value={updatedBooking.end} class="input-field" placeholder="End Time" />
              <select bind:value={updatedBooking.message} class="input-field">
                <option value="Fuld Klargøring">Fuld Klargøring</option>
                <option value="Udvendig Klargøring">Udvendig Klargøring</option>
                <option value="Indvendig Klargøring">Indvendig Klargøring</option>
              </select>
              <div class="actions">
                <button class="btn btn-save" on:click={saveEdit}>Save</button>
                <button class="btn btn-cancel" on:click={cancelEdit}>Cancel</button>
              </div>
            </div>
          {:else}
            <div class="booking-row">
              <div class="booking-cell" data-label="Name">{booking.name}</div>
              <div class="booking-cell" data-label="Email">{booking.email}</div>
              <div class="booking-cell" data-label="Telephone">{booking.telephone}</div>
              <div class="booking-cell" data-label="Date">{booking.date}</div>
              <div class="booking-cell" data-label="Start Time">{booking.start}</div>
              <div class="booking-cell" data-label="End Time">{booking.end}</div>
              <div class="booking-cell" data-label="Service">{booking.message}</div>
              <div class="actions">
                <button class="btn btn-edit" on:click={() => setEditMode(booking, 'booking')}>Edit</button>
                <button class="btn btn-delete" on:click={() => deleteBooking(booking.id)}>Delete</button>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    
      <h2 class="text-lg font-bold mb-4 mt-8">Available Times</h2>
      <div class="time-table">
        {#each availableTimes as time}
          {#if editMode.status && editMode.id === time.id && editMode.type === 'time'}
            <div class="time-row edit-mode">
              <input type="date" bind:value={updatedTime.date} class="input-field" placeholder="Date" />
              <input type="text" bind:value={updatedTime.start} class="input-field" placeholder="Start Time" />
              <input type="text" bind:value={updatedTime.end} class="input-field" placeholder="End Time" />
              <div class="actions">
                <button class="btn btn-save" on:click={saveEdit}>Save</button>
                <button class="btn btn-cancel" on:click={cancelEdit}>Cancel</button>
              </div>
            </div>
          {:else}
            <div class="time-row">
              <div class="time-cell" data-label="Date">{time.date || 'General'}</div>
              <div class="time-cell" data-label="Start Time">{time.start}</div>
              <div class="time-cell" data-label="End Time">{time.end}</div>
              <div class="actions">
                <button class="btn btn-edit" on:click={() => setEditMode(time, 'time')}>Edit</button>
                <button class="btn btn-delete" on:click={() => deleteAvailableTime(time.id)}>Delete</button>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    
      <h2 class="text-lg font-bold mb-4 mt-8">Add Specific Available Time</h2>
      <form on:submit|preventDefault={addAvailableTime} class="mb-4">
        <input type="date" bind:value={newTime.date} placeholder="Date (optional)" class="input-field" />
        <input type="text" bind:value={newTime.start} placeholder="Start Time (HH:MM)" required class="input-field" />
        <input type="text" bind:value={newTime.end} placeholder="End Time (HH:MM)" required class="input-field" />
        <button class="btn btn-add" type="submit">Add Time</button>
      </form>
  
      <h2 class="text-lg font-bold mb-4 mt-8">Add General Available Time</h2>
      <form on:submit|preventDefault={addGeneralTime} class="mb-4">
        <input type="text" bind:value={newGeneralTime.start} placeholder="Start Time (HH:MM)" required class="input-field" />
        <input type="text" bind:value={newGeneralTime.end} placeholder="End Time (HH:MM)" required class="input-field" />
        <button class="btn btn-add" type="submit">Add General Time</button>
      </form>
    </div>
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

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    table-layout: fixed;
  }

  th, td {
    border: 1px solid white;
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background-color: #2d3748;
  }

  tbody tr:nth-child(odd) {
    background-color: #1a202c;
  }

  tbody tr:nth-child(even) {
    background-color: #2d3748;
  }

  .booking-table,
  .time-table {
    display: flex;
    flex-direction: column;
  }

  .booking-row,
  .time-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid white;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .booking-cell,
  .time-cell {
    flex: 1 1 calc(25% - 1rem);
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .input-field {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    appearance: none;
    line-height: 1.25;
    outline: 2px solid transparent;
    outline-offset: 2px;
    color: black;
  }

  .input-field:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  ::placeholder {
    color: black;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;
    color: white;
    display: inline-block;
  }

  .btn-edit {
    background-color: #4299e1;
  }

  .btn-edit:hover {
    background-color: #2b6cb0;
  }

  .btn-save {
    background-color: #48bb78;
  }

  .btn-save:hover {
    background-color: #2f855a;
  }

  .btn-delete {
    background-color: #f56565;
  }

  .btn-delete:hover {
    background-color: #c53030;
  }

  .btn-cancel {
    background-color: #a0aec0;
  }

  .btn-cancel:hover {
    background-color: #4a5568;
  }

  .btn-add {
    background-color: #4299e1;
  }

  .btn-add:hover {
    background-color: #2b6cb0;
  }

  @media (min-width: 769px) {
    .btn {
      width: auto;
    }
  }

  @media (max-width: 768px) {
    .booking-cell,
    .time-cell {
      flex: 1 1 100%;
      padding-left: 50%;
      position: relative;
      text-align: left;
      border: none;
      border-bottom: 1px solid white;
    }

    .booking-cell:before,
    .time-cell:before {
      content: attr(data-label);
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      white-space: nowrap;
      color: white;
    }

    .actions {
      flex: 1 1 100%;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
