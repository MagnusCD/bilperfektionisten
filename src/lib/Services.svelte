<script>
  import { onMount } from 'svelte';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import { firebaseApp } from '$lib/firebase.js';

  export let imageUrl = 'services-offered.jpeg'

  let sectionTitle = '';
  let sectionContent = '';

  onMount(async () => {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, 'pages', 'RByjP06Vej1w6zQKT0Q2'); // Use the actual document ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Assuming 'content' is an array with the first item being the section
      const section = data.content.find(item => item.type === 'section');
      if (section && section.value) {
        sectionTitle = section.value.title; // Accessing the title
        sectionContent = section.value.content; // Accessing the content
      }
    } else {
      console.log('No such document!');
    }
  });
</script>


<div class="flex bg-gray-900 pt-20">
  <!-- Left side with the image -->
    <div class="image w-1/3 bg-cover bg-center" style="background-image: url({imageUrl});"></div>

    <div class="wrapper">
        <h2 class="title text-center text-white text-2xl font-bold mb-4 mt-8">{sectionTitle}</h2>

        <!-- Right side with content -->
        <div id="services-section" class="pl-4 pr-1 space-y-6 overflow-scroll">
          {#if sectionContent}
            {@html sectionContent.split('\n\n').map((paragraph, index) => {
              const lines = paragraph.split('\n');
              return `<div class="${index > 0 ? 'pt-4' : ''}">` + // Add space before all paragraphs except the first
                `<p class="flex items-center text-white text-lg"><span class="text-[#F8ECA3] fas fa-check-circle mr-2"></span>${lines[0]}</p>` +
                `${lines.slice(1).map(line => `<p class="text-white text-lg pl-[26px]">${line}</p>`).join('')}` +
                `</div>`;
            }).join('')}
          {/if}
        </div>
    </div>
</div>

<style>
  .image {
    clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
    background-position: center 25%;
    min-height: 70vh;
  }
</style>
