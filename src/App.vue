<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import navbar from './components/navbar.vue';
import Sideview from './components/sideview.vue';
import { useMainStore } from './stores/store';
const store = useMainStore();
const route = useRoute();
const showShell = computed(() => store.isAuthenticated && !route.meta.hideShell);
</script>

<template>
    <template v-if="showShell">
        <navbar />
        <Sideview />
    </template>
    <RouterView
        :class="showShell ? ['main-content', store.sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'] : ''"
    />
</template>
