<script>
    // Sample placeholder data for reviews
    const reviews = [
      { name: 'John Doe', rating: '★★★★★', review: 'Great service, highly recommend!' },
      { name: 'Jane Smith', rating: '★★★★★', review: 'Amazing experience from start to finish.' },
      { name: 'Alex Johnson', rating: '★★★★☆', review: 'Very good, but room for improvement.' },
      // Add more reviews as needed
    ];
  </script>
  
  <div class="text-black bg-gray-900 p-10">

    <h2 class="text-center text-white text-3xl mb-4">Det siger vores kunder om os</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each reviews as { name, rating, review }}
        <div class="bg-white p-4 rounded-lg ">
          <div class="font-bold">{name}</div>
          <div class="text-yellow-400">{rating}</div>
          <p>{review}</p>
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    /* Additional styles if needed */
  </style>
  