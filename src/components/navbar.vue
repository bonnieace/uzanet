<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.name);

const theme = ref(localStorage.getItem('theme') || 'light');
const mobileMenuActive = ref(false);

const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
};

// Modified closeMobileMenu function that works both with and without an event
const closeMobileMenu = (event = null) => {
    if (event) {
        // Only check for outside clicks when called from document event listener
        if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.mobile-dropdown')) {
            mobileMenuActive.value = false;
        }
    } else {
        // Directly close the menu when called from navigation links
        mobileMenuActive.value = false;
    }
};

const toggleMobileMenu = (event) => {
    event.stopPropagation();
    mobileMenuActive.value = !mobileMenuActive.value;
};

onMounted(() => {
    document.body.setAttribute('data-theme', theme.value);
    document.addEventListener('click', closeMobileMenu);
});

onUnmounted(() => {
    document.removeEventListener('click', closeMobileMenu);
});

// Add route watcher to close menu on navigation
watch(() => route.path, () => {
    mobileMenuActive.value = false;
});
</script>

<template>
    <header>
        <div class="header-left">
            <div class="mobile-menu-toggle " @click="toggleMobileMenu">
                <i class="fas fa-bars"></i>
            </div>
            <h2>{{ route.name }}</h2>
        </div>
        <div class="mobile-dropdown" :class="{ active: mobileMenuActive }">
            <nav>
                <ul>
                    <li><RouterLink to="/" :class="{ active: route.path === '/' }" @click="closeMobileMenu()"><i class="fas fa-home"></i> <span>Dashboard</span></RouterLink></li>
                    <li><RouterLink to="clients" :class="{ active: route.path === '/clients' }" @click="closeMobileMenu()"><i class="fas fa-users"></i> <span>PPPoE</span></RouterLink></li>
                    <li><RouterLink to="hotspot" :class="{ active: route.path === '/hotspot' }" @click="closeMobileMenu()"><i class="fas fa-wifi"></i> <span>Hotspot</span></RouterLink></li>
                    <li><RouterLink to="plans" :class="{ active: route.path === '/plans' }" @click="closeMobileMenu()"><i class="fas fa-list-alt"></i> <span>Plans</span></RouterLink></li>
                    <li><RouterLink to="logs" :class="{ active: route.path === '/logs' }" @click="closeMobileMenu()"><i class="fas fa-chart-bar"></i> <span>Logs</span></RouterLink></li>
                    <li><RouterLink to="payments" :class="{ active: route.path === '/payments' }" @click="closeMobileMenu()"><i class="fas fa-credit-card"></i> <span>Payments</span></RouterLink></li>
                    <li><RouterLink to="settings" :class="{ active: route.path === '/settings' }" @click="closeMobileMenu()"><i class="fas fa-cog"></i> <span>Settings</span></RouterLink></li>
                </ul>
            </nav>
        </div>
        <div class="header-right">
            <!--   <div class="theme-toggle" @click="toggleTheme">
                <i :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </div>-->
            <div class="user-profile">
                <i class="fas fa-user-circle"></i>
                <span> Admin</span>
            </div>
        </div>
    </header>
</template>