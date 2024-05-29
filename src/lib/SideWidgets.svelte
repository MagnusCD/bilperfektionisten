<script>
    import { auth } from '$lib/firebase';
    import { onAuthStateChanged, signOut } from 'firebase/auth';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let user = null;
    const menuVisible = writable(false);

    onMount(() => {
        onAuthStateChanged(auth, (u) => {
            user = u;
        });
    });

    function toggleMenu() {
        menuVisible.update(visible => !visible);
    }

    async function handleSignOut() {
        await signOut(auth);
        user = null;
        menuVisible.set(false);
    }
</script>

<div class="widgets-container">
    <div class="widget call-us-widget">
        <a href="tel:+4522942554" class="hover:text-gray-300">
            <i class="fas fa-phone-volume"></i>
        </a>
    </div>

    <div class="widget user-widget" on:click={toggleMenu}>
        <i class="fas fa-user"></i>
        {#if $menuVisible}
            <div class="user-menu">
                {#if user}
                    <p class="user-info">Logget ind som <span>{user.email}</span></p>
                    <button class="sign-out-button" on:click={handleSignOut}>Log ud</button>
                {:else}
                    <p class="user-info">Du er ikke logget ind</p>
                    <a href="/login" class="login-button">Log ind</a>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .widgets-container {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        z-index: 1000;
    }

    .widget {
        background-color: #20252b;
        padding: 10px;
        border-radius: 5px 0 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        width: 50px;
        height: 50px;
        cursor: pointer;
    }

    .widget i {
        color: white;
        font-size: 24px;
    }

    .user-widget {
        position: relative;
    }

    .user-menu {
        position: absolute;
        top: 0;
        right: 100%;
        background-color: #20252b;
        border: 1px solid black;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 5px 0 0 5px;
        padding: 10px;
        z-index: 1001;
        width: 300px;
    }

    .user-menu p,
    .user-menu a,
    .user-menu button {
        color: white;
        font-size: 16px;
        margin: 0;
        padding: 5px 0;
        text-align: left;
        word-wrap: break-word; /* Ensure long text breaks into a new line */
        overflow-wrap: break-word; /* Ensure long text breaks into a new line */
    }

    .user-menu button,
    .user-menu a {
        display: inline-block;
        width: 100%;
    }

    .user-menu .login-button {
        background-color: #4299e1; /* bg-blue-500 */
        color: white;
        font-weight: bold;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        text-align: center;
        cursor: pointer;
        text-decoration: none;
    }

    .user-menu .login-button:hover {
        background-color: #2b6cb0; /* hover:bg-blue-700 */
    }

    .user-menu .sign-out-button {
        background-color: #f56565; /* bg-red-500 */
        color: white;
        font-weight: bold;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        text-align: center;
        cursor: pointer;
        border: none;
    }

    .user-menu .sign-out-button:hover {
        background-color: #c53030; /* hover:bg-red-700 */
    }

    .user-menu .login-button:focus,
    .user-menu .sign-out-button:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* focus:shadow-outline */
    }

    .call-us-widget a:hover {
        color: #f7bd4d;
    }
</style>
