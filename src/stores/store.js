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

    // Router selection — shared across dashboard and active users
    const routers = ref([]);
    const selectedRouterId = ref(null);

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
        routers,
        selectedRouterId,
        login,
        logout,
        handleFilteredListUpdate,
        setLoading,
        openModal,
        closeModal,
    };
});