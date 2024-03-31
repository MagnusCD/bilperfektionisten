<script>
    export let logoUrl = 'logo.png';
</script>

<!-- Preheader Container -->
<div class="preheader-container text-white flex justify-between items-center px-2">
    <!-- Social Media Icons -->
    <div class="some-container flex items-center space-x-4 sm: display-none">
        <a href="https://facebook.com" class="hover:text-gray-300">
            <i class="fab fa-lg fa-facebook-f"></i>
        </a>
        <a href="https://instagram.com" class="hover:text-gray-300">
            <i class="fab fa-lg fa-instagram"></i>
        </a>
    </div>

    <div class="flex items-center">
        <a href="/" class="logo">
            <img src={logoUrl} alt="Logo" />
        </a>
    </div>    

    <!-- Business Info -->
    <div class="flex flex-col items-start space-y-1 pr-4">
        <span class="font-bold">Ring til os</span>
        <span class="font-bold relative">
            22 94 25 54
            <div class="underline absolute left-0 bottom-0 h-1 w-full"></div>
        </span>
    </div>

</div>

<style>
    .preheader-container {
        background-color: #20252B;
    }
    .underline {
        background-color: #F8ECA3;
    }
    .logo {
        width: 140px;
        margin-left: -30px;
    }

    .some-container {
        background-color: #35475D;
        margin: 0;
        height: 100px;
        width: 125px;
        padding-left: 20px;
        margin-left: -20px;
        clip-path: polygon(0 0, 80% 0%, 50% 100%, 0% 100%);
    }
</style>
