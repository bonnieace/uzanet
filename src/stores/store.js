import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/lib/api';

export const useMainStore = defineStore('main', () => {
    const showModal = ref(false);
    const isLoading= ref(true);
    const sidebarExpanded = ref(true);
    const filteredData = ref([]); // Holds the filtered data
    const routers = ref([]);
    const routersLoading = ref(false);
    const routerRefreshKey = ref(0);

    // Auth state — persisted in localStorage
    const token = ref(localStorage.getItem('auth_token') || null);
    const isAuthenticated = computed(() => !!token.value);

    // Selected router — persisted in localStorage
    const selectedRouterId = ref(
        localStorage.getItem('selected_router_id')
            ? Number(localStorage.getItem('selected_router_id'))
            : null
    );

    const setSelectedRouterId = (id) => {
        selectedRouterId.value = id;
        if (id !== null && id !== undefined) {
            localStorage.setItem('selected_router_id', String(id));
        } else {
            localStorage.removeItem('selected_router_id');
        }
    };

    const loadRouters = async ({ force = false } = {}) => {
        if (routersLoading.value) return;
        if (!force && routers.value.length) return;

        routersLoading.value = true;
        try {
            const res = await api.get('/routers');
            routers.value = res.data || [];

            if (!selectedRouterId.value && routers.value.length) {
                setSelectedRouterId(routers.value[0].id);
            }

            if (
                selectedRouterId.value &&
                !routers.value.some((router) => router.id === selectedRouterId.value)
            ) {
                setSelectedRouterId(routers.value[0]?.id ?? null);
            }
        } finally {
            routersLoading.value = false;
        }
    };

    const requestRouterRefresh = () => {
        routerRefreshKey.value += 1;
    };

    const login = (newToken) => {
        token.value = newToken;
        localStorage.setItem('auth_token', newToken);
    };

    const logout = () => {
        token.value = null;
        localStorage.removeItem('auth_token');
    };

    const setLoading = (value) => {
        isLoading.value = value;
    };
    
    const openModal = () => {
        showModal.value = true;
    };
    
    const closeModal = () => {
        showModal.value = false;
    };
    // Handle the filtered list update from the Search component
    const handleFilteredListUpdate = (updatedList) => {
        filteredData.value = updatedList;
    };

    return {
        showModal,
        isLoading,
        sidebarExpanded,
        filteredData,
        routers,
        routersLoading,
        token,
        isAuthenticated,
        selectedRouterId,
        routerRefreshKey,
        setSelectedRouterId,
        loadRouters,
        requestRouterRefresh,
        login,
        logout,
        handleFilteredListUpdate,
        setLoading,
        openModal,
        closeModal,
    };
});