<script>
  import { db, auth } from '$lib/firebase';
  import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc, query, limit, startAfter } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let bookings = [];
  let newTime = { start: '', end: '', date: '' };
  let availableTimes = [];
  let editMode = { status: false, id: null, type: '' };
  let updatedBooking = { name: '', email: '', telephone: '', nummerplade: '', date: '', start: '', end: '', message: '', by: '', adresse: '', kommentar: '', dyrIBilen: false };
  let updatedTime = { start: '', end: '', date: '' };
  let user = null;
  let isLoading = true;
  let lastVisible = null;
  let itemsPerPage = 5;

  async function fetchBookings() {
      const q = query(collection(db, 'bookings'), limit(itemsPerPage));
      const querySnapshot = await getDocs(q);
      bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
          if (a.date === b.date) {
              return a.start.localeCompare(b.start);
          }
          return a.date.localeCompare(b.date);
      });
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  }

  async function loadMoreBookings() {
      const q = query(collection(db, 'bookings'), startAfter(lastVisible), limit(itemsPerPage));
      const querySnapshot = await getDocs(q);
      const newBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => {
          if (a.date === b.date) {
              return a.start.localeCompare(b.start);
          }
          return a.date.localeCompare(b.date);
      });
      bookings = [...bookings, ...newBookings];
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
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
  <h1 class="text-2xl text-white mb-6">Kontrollerer godkendelse...</h1>
</div>
{:else if user}
<div class="flex flex-col w-100 bg-gray-900 p-12 pb-20">
  <div class="p-12 text-white max-w-4xl mx-auto">
    <h1 class="text-xl font-bold mb-4">Admin Panel</h1>
    
    <h2 class="text-lg font-bold mb-4">Bookinger</h2>
    <div class="booking-table">
      {#each bookings as booking}
        {#if editMode.status && editMode.id === booking.id && editMode.type === 'booking'}
          <div class="booking-row edit-mode">
            <input type="text" bind:value={updatedBooking.name} class="input-field" placeholder="Navn" />
            <input type="email" bind:value={updatedBooking.email} class="input-field" placeholder="Email" />
            <input type="tel" bind:value={updatedBooking.telephone} class="input-field" placeholder="Telefon" />
            <input type="text" bind:value={updatedBooking.nummerplade} class="input-field" placeholder="Nummerplade" />
            <input type="text" bind:value={updatedBooking.by} class="input-field" placeholder="By" />
            <input type="text" bind:value={updatedBooking.adresse} class="input-field" placeholder="Adresse" />
            <textarea bind:value={updatedBooking.kommentar} class="input-field" placeholder="Kommentar"></textarea>
            <input type="date" bind:value={updatedBooking.date} class="input-field" placeholder="Dato" />
            <input type="time" bind:value={updatedBooking.start} class="input-field" placeholder="Starttid" />
            <input type="time" bind:value={updatedBooking.end} class="input-field" placeholder="Sluttid" />
            <select bind:value={updatedBooking.message} class="input-field">
              <option value="Fuld Klargøring">Fuld Klargøring</option>
              <option value="Udvendig Klargøring">Udvendig Klargøring</option>
              <option value="Indvendig Klargøring">Indvendig Klargøring</option>
            </select>
            <label class="inline-flex items-center mt-2">
              <input type="checkbox" bind:checked={updatedBooking.dyrIBilen} class="form-checkbox h-5 w-5 text-blue-600">
              <span class="ml-2 text-white">Har der været dyr i bilen</span>
            </label>
            <div class="actions">
              <button class="btn btn-save" on:click={saveEdit}>Gem</button>
              <button class="btn btn-cancel" on:click={cancelEdit}>Annuller</button>
            </div>
          </div>
        {:else}
          <div class="booking-row">
            <div class="booking-cell">Navn: {booking.name}</div>
            <div class="booking-cell">Email: {booking.email}</div>
            <div class="booking-cell">Telefon: {booking.telephone}</div>
            <div class="booking-cell">Nummerplade: {booking.nummerplade}</div>
            <div class="booking-cell">By: {booking.by}</div>
            <div class="booking-cell">Adresse: {booking.adresse}</div>
            <div class="booking-cell">Dato: {booking.date}</div>
            <div class="booking-cell">Starttid: {booking.start}</div>
            <div class="booking-cell">Sluttid: {booking.end}</div>
            <div class="booking-cell">Service: {booking.message}</div>
            <div class="booking-cell">Kommentar: {booking.kommentar}</div>
            <div class="booking-cell">Har der været dyr i bilen: {booking.dyrIBilen ? 'Ja' : 'Nej'}</div>
            <div class="actions">
              <button class="btn btn-edit" on:click={() => setEditMode(booking, 'booking')}>Rediger</button>
              <button class="btn btn-delete" on:click={() => deleteBooking(booking.id)}>Slet</button>
            </div>
          </div>
        {/if}
      {/each}
    </div>
    <button class="btn btn-load-more mt-4" on:click={loadMoreBookings}>Indlæs Mere</button>
  
    <h2 class="text-lg font-bold mb-4 mt-8">Ledige Tider</h2>
    <div class="time-table">
      {#each availableTimes as time}
        {#if editMode.status && editMode.id === time.id && editMode.type === 'time'}
          <div class="time-row edit-mode">
            <input type="date" bind:value={updatedTime.date} class="input-field" placeholder="Dato" />
            <input type="text" bind:value={updatedTime.start} class="input-field" placeholder="Starttid" />
            <input type="text" bind:value={updatedTime.end} class="input-field" placeholder="Sluttid" />
            <div class="actions">
              <button class="btn btn-save" on:click={saveEdit}>Gem</button>
              <button class="btn btn-cancel" on:click={cancelEdit}>Annuller</button>
            </div>
          </div>
        {:else}
          <div class="time-row">
            <div class="time-cell">Dato: {time.date || 'Generel'}</div>
            <div class="time-cell">Starttid: {time.start}</div>
            <div class="time-cell">Sluttid: {time.end}</div>
            <div class="actions">
              <button class="btn btn-edit" on:click={() => setEditMode(time, 'time')}>Rediger</button>
              <button class="btn btn-delete" on:click={() => deleteAvailableTime(time.id)}>Slet</button>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  
    <h2 class="text-lg font-bold mb-4 mt-8">Tilføj Specifik Tilgængelig Tid</h2>
    <form on:submit|preventDefault={addAvailableTime} class="mb-4">
      <input type="date" bind:value={newTime.date} placeholder="Dato (valgfri)" class="input-field" />
      <input type="text" bind:value={newTime.start} placeholder="Starttid (HH:MM)" required class="input-field" />
      <input type="text" bind:value={newTime.end} placeholder="Sluttid (HH:MM)" required class="input-field" />
      <button class="btn btn-add" type="submit">Tilføj Tid</button>
    </form>
  </div>
</div>
{:else}
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900">
  <h1 class="text-2xl text-white mb-6">Kontrollerer godkendelse...</h1>
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

.booking-table, .time-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.booking-header, .time-header {
  background-color: #2d3748;
  font-weight: bold;
}

.booking-row, .time-row {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid white;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.booking-cell, .time-cell {
  padding: 0.5rem;
  border: 1px solid #444;
  word-wrap: break-word;
  overflow-wrap: break-word;
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

.btn-load-more {
  background-color: #4299e1;
  margin-top: 1rem;
}

.btn-load-more:hover {
  background-color: #2b6cb0;
}

.booking-row, .time-row {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

@media (max-width: 768px) {
  .booking-row, .time-row {
    grid-template-columns: 1fr;
  }
  
  .booking-cell, .time-cell {
    border-bottom: 1px solid #444;
  }

  .booking-cell:last-child, .time-cell:last-child {
    border-bottom: none;
  }
}
</style>
