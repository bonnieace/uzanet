<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.name);

const theme = ref(localStorage.getItem('theme') || 'light');

const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
};

onMounted(() => {
    document.body.setAttribute('data-theme', theme.value);
});

</script>

<template>
    <header>
        <div class="header-left">
            <div class="mobile-menu-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <h2>{{ route.name }}</h2>
        </div>
        <div class="header-right">
            <div class="theme-toggle" @click="toggleTheme">
                <i :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </div>
            <div class="user-profile">
                <span> Admin</span>
            </div>
        </div>
    </header>
</template>
