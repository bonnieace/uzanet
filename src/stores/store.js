import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMainStore = defineStore('main', () => {
    const showModal = ref(false);
    const isLoading= ref(true);
    const sidebarExpanded = ref(true);
    const filteredData = ref([]); // Holds the filtered data

    // Auth state — persisted in localStorage
    const token = ref(localStorage.getItem('auth_token') || null);
    const isAuthenticated = computed(() => !!token.value);

    // Selected router — persisted in localStorage
    const selectedRouterId = ref(
        localStorage.getItem('selected_router_id')
            ? Number(localStorage.getItem('selected_router_id'))
            : null
    );

    // Refresh trigger — incremented by the navbar refresh button
    const refreshCount = ref(0);
    const triggerRefresh = () => { refreshCount.value++; };

    const setSelectedRouterId = (id) => {
        selectedRouterId.value = id;
        if (id !== null && id !== undefined) {
            localStorage.setItem('selected_router_id', String(id));
        } else {
            localStorage.removeItem('selected_router_id');
        }
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
        token,
        isAuthenticated,
        selectedRouterId,
        setSelectedRouterId,
        refreshCount,
        triggerRefresh,
        login,
        logout,
        handleFilteredListUpdate,
        setLoading,
        openModal,
        closeModal,
    };
});