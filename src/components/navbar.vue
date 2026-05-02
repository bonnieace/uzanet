<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Menu, House, Users, Wifi, ClipboardList, BarChart2, CreditCard, Settings, Sun, Moon, LogOut, Activity, RefreshCw } from 'lucide-vue-next';
import { useMainStore } from '@/stores/store';

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const handleLogout = () => {
    store.logout();
    router.push({ name: 'Login' });
};

const theme = ref(localStorage.getItem('theme') || 'light');
const mobileMenuActive = ref(false);
const selectedRouterId = computed({
    get: () => store.selectedRouterId,
    set: (value) => store.setSelectedRouterId(value),
});
const showRouterControls = computed(() => ['Home', 'ActiveUsers', 'Hotspot', 'Pppoe', 'plans', 'logs', 'payments'].includes(route.name));

const handleHeaderRefresh = () => {
    store.requestRouterRefresh();
};

const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
};

const closeMobileMenu = (event = null) => {
    if (event) {
        if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.mobile-dropdown')) {
            mobileMenuActive.value = false;
        }
    } else {
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

    if (showRouterControls.value) {
        store.loadRouters();
    }
});

onUnmounted(() => {
    document.removeEventListener('click', closeMobileMenu);
});

watch(() => route.path, () => {
    mobileMenuActive.value = false;
});

watch(showRouterControls, (enabled) => {
    if (enabled) {
        store.loadRouters();
    }
}, { immediate: true });
</script>

<template>
    <header class="neo-header">
        <div class="header-left">
            <button class="neo-btn neo-btn-outline mobile-menu-toggle" @click="toggleMobileMenu">
                <Menu :size="20" />
            </button>
            <h2>{{ route.name }}</h2>
        </div>
        <div class="mobile-dropdown neo-dropdown" :class="{ active: mobileMenuActive }">
            <nav class="neo-nav">
                <ul>
                    <li><RouterLink to="/" :class="{ active: route.path === '/' }" @click="closeMobileMenu()" class="neo-nav-link"><House :size="16" /> <span>Dashboard</span></RouterLink></li>
                    <li><RouterLink to="/clients" :class="{ active: route.path === '/clients' }" @click="closeMobileMenu()" class="neo-nav-link"><Users :size="16" /> <span>PPPoE</span></RouterLink></li>
                    <li><RouterLink to="/hotspot" :class="{ active: route.path === '/hotspot' }" @click="closeMobileMenu()" class="neo-nav-link"><Wifi :size="16" /> <span>Hotspot</span></RouterLink></li>
                    <li><RouterLink to="/active-users" :class="{ active: route.path === '/active-users' }" @click="closeMobileMenu()" class="neo-nav-link"><Activity :size="16" /> <span>Active Users</span></RouterLink></li>
                    <li><RouterLink to="/plans" :class="{ active: route.path === '/plans' }" @click="closeMobileMenu()" class="neo-nav-link"><ClipboardList :size="16" /> <span>Plans</span></RouterLink></li>
                    <li><RouterLink to="/logs" :class="{ active: route.path === '/logs' }" @click="closeMobileMenu()" class="neo-nav-link"><BarChart2 :size="16" /> <span>Logs</span></RouterLink></li>
                    <li><RouterLink to="/payments" :class="{ active: route.path === '/payments' }" @click="closeMobileMenu()" class="neo-nav-link"><CreditCard :size="16" /> <span>Payments</span></RouterLink></li>
                    <li><RouterLink to="/routers" :class="{ active: route.path === '/routers' }" @click="closeMobileMenu()" class="neo-nav-link"><Settings :size="16" /> <span>Routers</span></RouterLink></li>
                </ul>
            </nav>
        </div>
        <div class="header-right">
            <div v-if="showRouterControls" class="header-tools">
                <select
                    v-model="selectedRouterId"
                    class="neo-input header-router-select"
                    :disabled="store.routersLoading"
                    aria-label="Select router"
                >
                    <option v-if="store.routersLoading" :value="null">Loading routers...</option>
                    <option v-else-if="!store.routers.length" :value="null">No routers found</option>
                    <option v-for="routerItem in store.routers" :key="routerItem.id" :value="routerItem.id">
                        {{ routerItem.name || routerItem.ip_address }}
                    </option>
                </select>

                <button
                    class="neo-btn neo-btn-outline header-refresh-button"
                    :disabled="store.routersLoading || !selectedRouterId"
                    @click="handleHeaderRefresh"
                    title="Refresh router data"
                    aria-label="Refresh router data"
                >
                    <RefreshCw :size="18" />
                    <span class="header-refresh-label">Refresh</span>
                </button>
            </div>

            <button class="neo-btn neo-btn-outline theme-button" @click="toggleTheme">
                <Sun v-if="theme === 'dark'" :size="20" />
                <Moon v-else :size="20" />
            </button>
  
            <button class="neo-btn neo-btn-outline" @click="handleLogout" title="Logout">
                <LogOut :size="18" />
            </button>
        </div>
    </header>
</template>

<style scoped>
.neo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    height: 72px;
    background-color: var(--card-background);
    border: var(--border-width) solid var(--border);
    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px 0px var(--border);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    font-weight: 700;
    text-transform: uppercase;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
}

.header-left h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: 1px;
    border: none;
    box-shadow: none;
    padding: 0;
}

.mobile-menu-toggle {
    display: none;
}

.neo-dropdown {
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background-color: var(--sidebar-background);
    z-index: 999;
    padding: 1rem;
    border: var(--border-width) solid var(--border);
    box-shadow: 6px 6px 0px 0px var(--border);
}

.neo-dropdown.active {
    display: block;
}

.neo-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.neo-nav-link {
    color: var(--foreground);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: var(--border-width) solid var(--border);
    font-weight: 700;
    text-transform: uppercase;
    transition: all 0.1s ease;
}

.neo-nav-link:hover,
.neo-nav-link.active {
    background-color: var(--border);
    color: var(--card);
    box-shadow: 2px 2px 0px 0px var(--border);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.header-tools {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.header-router-select {
    min-width: 190px;
    max-width: 220px;
    height: 2.5rem;
}

.header-refresh-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.theme-button {
    font-size: 1.25rem;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.1rem;
        height: 2.1rem;
        padding: 0.25rem;
    }

    .mobile-menu-toggle :deep(svg) {
        width: 16px;
        height: 16px;
    }

    .neo-header {
        padding: 0 1rem;
        height: 64px;
    }

    .header-left h2 {
        font-size: 1.1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    .header-right {
        gap: 0.75rem;
    }

    .header-tools {
        gap: 0.5rem;
    }

    .header-router-select {
        min-width: 0;
        width: 120px;
        max-width: 120px;
        padding-right: 1.75rem;
        font-size: 0.75rem;
    }

    .header-refresh-button {
        width: 2.1rem;
        height: 2.1rem;
        padding: 0.25rem;
        justify-content: center;
    }

    .header-refresh-label {
        display: none;
    }

    .header-right .neo-btn {
        width: 2.1rem;
        height: 2.1rem;
        padding: 0.25rem;
    }

    .header-right .neo-btn :deep(svg) {
        width: 15px;
        height: 15px;
    }

    .neo-dropdown {
        top: 64px;
        border: var(--border-width) solid var(--border);
        box-shadow: 4px 4px 0px 0px var(--border);
        max-height: calc(100vh - 64px);
        overflow-y: auto;
    }
}
</style>