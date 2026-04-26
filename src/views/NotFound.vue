<script setup>
import { useRouter } from 'vue-router';
import { House } from 'lucide-vue-next';
const router = useRouter();
</script>

<template>
    <div class="neo-404">
        <div class="neo-card neo-404-card">
            <div class="neo-404-code">404</div>
            <h1 class="neo-404-title">Page Not Found</h1>
            <p class="neo-404-msg">The page you are looking for does not exist.</p>
            <button class="neo-btn neo-btn-primary" @click="router.push('/')">
                <House :size="16" /> Back to Dashboard
            </button>
        </div>
    </div>
</template>

<style scoped>
.neo-404 {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 72px);
    padding: 2rem;
}

.neo-404-card {
    text-align: center;
    max-width: 480px;
    width: 100%;
    padding: 3rem 2rem;
}

.neo-404-code {
    font-size: 8rem;
    font-weight: 900;
    line-height: 1;
    color: var(--primary);
    letter-spacing: -4px;
    margin-bottom: 1rem;
    text-shadow: 6px 6px 0 var(--border);
}

.neo-404-title {
    font-size: 1.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
}

.neo-404-msg {
    font-size: 1rem;
    color: var(--muted-foreground);
    margin-bottom: 2rem;
    text-transform: none;
    font-weight: 500;
}
</style>
