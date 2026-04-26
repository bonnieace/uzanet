<script setup>
import { RouterView, useRoute } from 'vue-router'
import navbar from './components/navbar.vue';
import Sideview from './components/sideview.vue';
import { useMainStore } from './stores/store';
const store = useMainStore();
const route = useRoute();
</script>

<template>
    <template v-if="store.isAuthenticated && route.name !== 'Login'">
        <navbar />
        <Sideview />
    </template>
    <RouterView
        class="main-content"
        :class="store.isAuthenticated ? { 'sidebar-expanded': store.sidebarExpanded, 'sidebar-collapsed': !store.sidebarExpanded } : ''"
    />
</template>
