<script>
    import { auth, registerUser } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';

    let email = '';
    let password = '';
    let errorMessage = writable('');

    const handleRegister = async () => {
        try {
            await registerUser(email, password);
            goto('/login');
        } catch (error) {
            errorMessage.set(error.message);
        }
    };
</script>

<div class="register-container">
    <h1>Register</h1>
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Password" bind:value={password} />
    <button on:click={handleRegister}>Register</button>
    {#if $errorMessage}
        <p class="error">{$errorMessage}</p>
    {/if}
</div>

<style>
    .register-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #f7f7f7;
    }

    input {
        margin: 0.5rem 0;
        padding: 0.5rem;
        width: 200px;
    }

    button {
        margin: 0.5rem 0;
        padding: 0.5rem 1rem;
        width: 200px;
    }

    .error {
        color: red;
    }
</style>
