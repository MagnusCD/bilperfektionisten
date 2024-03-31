<script>
    export let imageUrl = "services-offered.jpeg"; // Accept an image URL as a prop
</script>

<div class="flex bg-gray-900 pt-10">
    <!-- Left side with the image -->
    <div class="image w-1/3 bg-cover bg-center"
        style="background-image: url({imageUrl});"
    ></div>

    <!-- Right side with content -->
    <div class="w-2/3 flex flex-col justify-center p-10 space-y-4">
        <h2 class="text-center text-white text-3xl font-bold mb-4">Hvad tilbyder vi?</h2>
        <p class="flex items-center text-white text-lg">
            <span class="fas fa-xl fa-check-circle mr-2"></span>
            Udvending klargøring af hele bilen som en lakforsegling!
        </p>
        <p class="flex items-center text-white text-lg">
            <span class="fas fa-xl fa-check-circle mr-2"></span>
            Indvendig klargøring af hele kabinen, samt sæder.
        </p>
        <p class="flex items-center text-white text-lg">
            <span class="fas fa-xl fa-check-circle mr-2"></span>
            Fuldklargøring, som indeholder både det indvendige og det udvendige
        </p>
    </div>
</div>

<style>
    .image {
        clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
        background-position: center 25%;
    }
    .flex {
        height: 700px;
    }
    .fa-check-circle {
        color: #F8ECA3;
    }
</style>
