<script>
    export let logoUrl = 'logo.png';
</script>

<!-- Preheader Container -->
<div class="preheader-container text-white flex justify-between items-center px-2">
    <!-- Social Media Icons -->
    <div class="some-container flex items-center space-x-4 sm: display-none">
        <a href="https://www.facebook.com/profile.php?id=61552712496834" class="hover:text-gray-300">
            <i class="fab fa-lg fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/bilperfektionisten/?fbclid=IwAR11mIVIprrjUjppDJlRzL8WvRjcOQw2WIMl3OquZN328OLVGR_b2Vyz1Nk" class="hover:text-gray-300">
            <i class="fab fa-lg fa-instagram"></i>
        </a>
    </div>

    <div class="flex items-center">
        <a href="/" class="logo">
            <img src={logoUrl} alt="Logo" />
        </a>
    </div>    

    <div class="flex pr-4 flex-col items-start space-y-1 pr-4">
        <a href="tel:+22942554" class="hover:text-gray-300">
            <span class="call-us font-bold">Ring til os</span><br>
            <i class="fas fa-phone-volume flex justify-center"></i> 
        </a>
    </div>
</div>

<style>
    .call-us {
        font-family: 'Montserrat', sans-serif;
    }

    .fa-phone-volume {
        color: #F7BD4D;
    }
    .preheader-container {
        background-color: #20252B;
        height: 90px;
    }
    .logo {
        width: 140px;
        margin-left: -35px;
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
