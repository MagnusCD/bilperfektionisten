<script>
    import { auth, signInWithEmailAndPassword, fetchUserRole } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';

    let email = '';
    let password = '';
    let errorMessage = writable('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const role = await fetchUserRole(userCredential.user.uid);
            if (role === 'admin') {
                goto('/admin');
            } else {
                goto('/booking');
            }
        } catch (error) {
            errorMessage.set(error.message);
        }
    };
</script>

<div class="login-container bg-gray-900 text-white">
    <h1>Login</h1>
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Password" bind:value={password} />
    <button on:click={handleLogin}>Login</button>
    <button on:click={() => goto('/register')}>Register</button>
    {#if $errorMessage}
        <p class="error">{$errorMessage}</p>
    {/if}
</div>

<style>
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
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
