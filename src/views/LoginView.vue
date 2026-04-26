<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/store';
import { LogIn } from 'lucide-vue-next';

const router = useRouter();
const store = useMainStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
    error.value = '';
    loading.value = true;
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/token`, new URLSearchParams({
            username: username.value,
            password: password.value,
        }));
        store.login(res.data.access_token);
        router.push({ name: 'Home' });
    } catch (err) {
        if (err.response?.status === 401) {
            error.value = 'Invalid username or password.';
        } else {
            error.value = 'Unable to connect. Please try again.';
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-wrapper">
        <div class="login-card">
            <div class="login-brand">
                <span class="login-brand-dot"></span>
                <span class="login-brand-name">UzaNet</span>
            </div>

            <div class="login-header">
                <h1 class="login-title">Welcome Back</h1>
                <p class="login-subtitle">Enter your credentials to access your account</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="login-field">
                    <label for="username" class="login-label">USERNAME</label>
                    <input
                        id="username"
                        type="text"
                        v-model="username"
                        class="login-input"
                        placeholder="admin"
                        autocomplete="username"
                        required
                    />
                </div>

                <div class="login-field">
                    <label for="password" class="login-label">PASSWORD</label>
                    <input
                        id="password"
                        type="password"
                        v-model="password"
                        class="login-input"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                    />
                </div>

                <div v-if="error" class="login-error">
                    {{ error }}
                </div>

                <button type="submit" class="login-btn" :disabled="loading">
                    <LogIn v-if="!loading" :size="16" />
                    <span class="login-btn-spinner" v-if="loading"></span>
                    {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg);
    padding: 1rem;
}

.login-card {
    width: 100%;
    max-width: 420px;
    background-color: var(--card);
    border: var(--border-width, 2px) solid var(--border);
    box-shadow: 6px 6px 0px 0px var(--border);
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.login-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.login-brand-dot {
    width: 14px;
    height: 14px;
    background-color: var(--main, #88aaee);
    border: 2px solid var(--border);
    display: inline-block;
}

.login-brand-name {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.login-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.login-title {
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.2;
    margin: 0;
}

.login-subtitle {
    font-size: 0.875rem;
    color: var(--text-muted, #666);
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.login-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.login-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--fg);
}

.login-input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    font-weight: 500;
    background-color: var(--card);
    color: var(--fg);
    border: var(--border-width, 2px) solid var(--border);
    box-shadow: 3px 3px 0px 0px var(--border);
    outline: none;
    transition: box-shadow 0.1s ease, transform 0.1s ease;
    box-sizing: border-box;
    font-family: inherit;
}

.login-input:focus {
    box-shadow: 1px 1px 0px 0px var(--border);
    transform: translate(2px, 2px);
}

.login-error {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--error, #e03e3e);
    background-color: color-mix(in srgb, var(--error, #e03e3e) 10%, transparent);
    border: 2px solid var(--error, #e03e3e);
    padding: 0.5rem 0.75rem;
}

.login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
    background-color: var(--main, #88aaee);
    color: var(--fg);
    border: var(--border-width, 2px) solid var(--border);
    box-shadow: 4px 4px 0px 0px var(--border);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    font-family: inherit;
}

.login-btn:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border);
}

.login-btn:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px 0px var(--border);
}

.login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-btn-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--border);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
