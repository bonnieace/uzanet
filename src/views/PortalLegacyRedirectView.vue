<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { errorMessage, fetchPortal } from '@/lib/api';

const route = useRoute();
const router = useRouter();
const error = ref('');

onMounted(async () => {
    const portalSlug = String(route.params.portalSlug || '');
    if (!portalSlug) {
        error.value = 'This portal link is incomplete.';
        return;
    }

    try {
        const portal = await fetchPortal(portalSlug);
        if (!portal?.isp_identifier) {
            error.value = 'This portal does not have an ISP identifier yet.';
            return;
        }
        await router.replace({
            name: 'Portal',
            params: {
                ispIdentifier: portal.isp_identifier,
                portalSlug,
            },
            query: route.query,
        });
    } catch (err) {
        error.value = errorMessage(err, 'This ISP portal is unavailable.');
    }
});
</script>

<template>
    <main class="legacy-portal-redirect" aria-live="polite">
        <p v-if="error">{{ error }}</p>
        <p v-else>Opening your internet portal…</p>
    </main>
</template>

<style scoped>
.legacy-portal-redirect {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    font: 600 1rem/1.5 Inter, system-ui, sans-serif;
    text-align: center;
}
</style>
