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
            let message = '';
            switch (error.code) {
                default:
                    message = 'Email eller adgangskode er forkert. Prøv igen.';
            }
            errorMessage.set(message);
        }
    };
</script>

<div class="login-container bg-gray-900 text-white">
    <h1 class="text-2xl mb-6">Log ind</h1>
    <input type="email" placeholder="Email" bind:value={email} class="input-field" />
    <input type="password" placeholder="Adgangskode" bind:value={password} class="input-field" />
    <button on:click={handleLogin} class="login-button">Log ind</button>
    <button on:click={() => goto('/register')} class="register-button">Opret Bruger</button>
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

    .input-field {
        margin: 0.5rem 0;
        padding: 0.75rem;
        width: 300px;
        border-radius: 0.25rem;
        border: 1px solid #ccc;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        outline: none;
        color: black;
    }

    .login-button,
    .register-button {
        margin: 0.5rem 0;
        padding: 0.75rem 1.5rem;
        width: 300px;
        border-radius: 0.25rem;
        font-weight: bold;
        color: white;
        cursor: pointer;
        text-align: center;
    }

    .login-button {
        background-color: #4299e1; /* Tailwind's blue-500 */
    }

    .login-button:hover {
        background-color: #2b6cb0; /* Tailwind's blue-700 */
    }

    .register-button {
        background-color: #48bb78; /* Tailwind's green-500 */
    }

    .register-button:hover {
        background-color: #2f855a; /* Tailwind's green-700 */
    }

    .error {
        color: red;
        margin-top: 1rem;
    }
</style>
