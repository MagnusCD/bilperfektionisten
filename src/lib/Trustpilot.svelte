<script>
  import { onMount } from 'svelte';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import { firebaseApp } from '$lib/firebase.js';

  let reviews = [];

  onMount(async () => {
    const db = getFirestore(firebaseApp);
    const colRef = collection(db, 'anmeldelser'); // Replace 'anmeldelser' with your actual collection name if different
    const colSnap = await getDocs(colRef);

    if (!colSnap.empty) {
      reviews = colSnap.docs.map(doc => ({
        id: doc.id, // Assuming you need a unique key for each review
        ...doc.data()
      }));
    } else {
      console.log('No documents found!');
    }
  });
</script>

<div class="text-black bg-gray-900 p-10">
  <h2 class="text-center text-white font-bold text-2xl mb-4">Det siger vores kunder om os</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each reviews as review (review.id)}
    <div class="bg-white p-4 rounded-lg ">
      <div class="font-bold">{review.navn}</div>
      <!-- Static 5-star rating -->
      <div class="text-yellow-400 text-lg">
        ★★★★★
      </div>
      <p>{review.anmeldelse}</p>
    </div>
  {/each}
  
  </div>
</div>
