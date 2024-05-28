<script>
    import { auth, registerUser } from '$lib/firebase';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';

    let email = '';
    let password = '';
    let errorMessage = writable('');
    let successMessage = writable('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            errorMessage.set('Ugyldig emailadresse. Tjek din emailadresse og prøv igen.');
            return;
        }
        try {
            await registerUser(email, password);
            successMessage.set('Bruger oprettet! Du kan nu logge ind.');
            errorMessage.set('');
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage.set('Emailadressen er allerede i brug. Prøv en anden emailadresse.');
                    break;
                case 'auth/weak-password':
                    errorMessage.set('Adgangskoden er for svag. Vælg en stærkere adgangskode.');
                    break;
                default:
                    errorMessage.set('Der opstod en fejl under oprettelsen af brugeren. Prøv igen.');
                    break;
            }
            successMessage.set('');
        }
    };
</script>

<div class="register-container bg-gray-900 text-white">
    <h1 class="text-2xl mb-6">Opret bruger</h1>
    <input type="email" placeholder="Email" bind:value={email} class="input-field" />
    <input type="password" placeholder="Adgangskode" bind:value={password} class="input-field" />
    <button on:click={handleRegister} class="register-button">Bekræft Oprettelse</button>
    {#if $errorMessage}
        <p class="error">{$errorMessage}</p>
    {/if}
    {#if $successMessage}
        <p class="success">{$successMessage} <a href="/login" class="login-link">Fortsæt til login</a></p>
    {/if}
</div>

<style>
    .register-container {
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

    .register-button {
        margin: 0.5rem 0;
        padding: 0.75rem 1.5rem;
        width: 300px;
        border-radius: 0.25rem;
        font-weight: bold;
        color: white;
        background-color: #48bb78; /* Tailwind's green-500 */
        cursor: pointer;
        text-align: center;
    }

    .register-button:hover {
        background-color: #2f855a; /* Tailwind's green-700 */
    }

    .error {
        color: red;
        margin-top: 1rem;
    }

    .success {
        color: green;
        margin-top: 1rem;
    }

    .login-link {
        color: #4299e1; /* Tailwind's blue-500 */
        text-decoration: underline;
        cursor: pointer;
    }

    .login-link:hover {
        color: #2b6cb0; /* Tailwind's blue-700 */
    }
</style>
