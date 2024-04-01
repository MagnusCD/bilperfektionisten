<script>
  import { onMount } from 'svelte';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import { firebaseApp } from '$lib/firebase.js';

  let sectionTitle = '';
  let sectionContent = '';

  onMount(async () => {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, 'pages', 'nrrsNzdScllnKIlWq46t'); // Use the actual ID of your document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Check to make sure data is in the expected structure
      if (data.content && data.content.length > 0) {
        // Assuming you have a 'content' field that is an array of sections
        const firstSection = data.content[0]; // Taking the first section for simplicity
        if (firstSection.type === 'section' && firstSection.value) {
          sectionTitle = firstSection.value.title; // Here we assume 'title' is a string
          sectionContent = firstSection.value.content; // Assuming 'content' is a string
        }
      }
    } else {
      console.log('No such document!');
    }
  });
</script>

<div class="bg-gray-900 p-12 text-white flex flex-col items-center">
    <h1 class="text-2xl pb-6 font-bold">{sectionTitle}</h1>
    <p class="about-text">
      {@html sectionContent.split('\n').join('<br>')} <!-- Split and join to convert line breaks to <br> tags -->
    </p>
  </div>

<style>
  .about-text {
    padding-left: 10vw;
    padding-right: 10vw;
  }
</style>