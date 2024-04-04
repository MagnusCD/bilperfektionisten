<script>
  import { onMount } from 'svelte';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import { firebaseApp } from '$lib/firebase.js';

  let offers = [];
  let showMore = [];

  onMount(async () => {
    const db = getFirestore(firebaseApp);
    const colRef = collection(db, 'servicer');
    const colSnap = await getDocs(colRef);

    if (!colSnap.empty) {
      offers = colSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      showMore = new Array(offers.length).fill(false);
    } else {
      console.log('No documents found!');
    }
  });

  const toggleMoreInfo = (index) => {
    showMore[index] = !showMore[index];
  };
</script>

<div class="offers-container flex flex-wrap justify-center gap-4 p-12 pb-20 bg-gray-900 text-black">
  {#each offers as offer, index (offer.id)}
    <div class="offer-box flex flex-col max-w-xs w-full p-3 border border-gray-700 rounded-lg bg-white">
      <h3 class="title text-xl font-bold mb-2">{offer.title}</h3>
      <p class="text-2xl font-bold my-2">Fra kr. {offer.price}</p>
      <ul class="list-none space-y-1">
        {#each offer.info.split('\n') as infoLine (infoLine)}
          <li class="flex items-center">
            <i class="fas fa-check mr-2"></i> {infoLine}
          </li>
        {/each}
      </ul>
      <div class="more-info" class:expanded={showMore[index]}>
        <p>{offer.moreInfo}</p>
      </div>
      <button
        on:click={() => toggleMoreInfo(index)}
        class="more-info-btn mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {showMore[index] ? 'Mindre' : 'Mere'} Info
      </button>
    </div>
  {/each}
</div>

<style>
  .title {
    color: #F7BD4D;
  }

  .more-info {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding-top: 20px;
  }
  .offer-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* This will push the button to the bottom */
  height: 100%; /* Set a height to make sure space-between works */
  min-height: 320px;  
  }

  .more-info-btn {
  align-self: center; /* Center the button horizontally */
  margin-top: auto; /* Push the button to the bottom */
  margin-top: 10px;
  }
  .more-info.expanded {
    max-height: 1000px; /* Adjust as needed for content */
  }
  .offer-box {
    transition: transform 0.3s ease;
  }
  .offer-box:hover {
    transform: translateY(-5px);
  }
</style>