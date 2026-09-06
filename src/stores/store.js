import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchMe, fetchRouters, logoutOperator } from '@/lib/api';

export const useMainStore = defineStore('main', () => {
    const showModal = ref(false);
    const isLoading = ref(false);
    const sidebarExpanded = ref(true);
    const filteredData = ref([]);
    const routers = ref([]);
    const routersLoading = ref(false);
    const routerRefreshKey = ref(0);
    const user = ref(null);
    const authChecked = ref(false);

    const token = ref(localStorage.getItem('auth_token'));
    const isAuthenticated = computed(() => Boolean(token.value && user.value));
    const selectedRouterUid = ref(localStorage.getItem('selected_router_uid'));
    // Compatibility alias while the existing views are migrated from numeric IDs.
    const selectedRouterId = selectedRouterUid;

    const setSelectedRouterId = (uid) => {
        selectedRouterUid.value = uid || null;
        filteredData.value = [];
        if (uid) localStorage.setItem('selected_router_uid', uid);
        else localStorage.removeItem('selected_router_uid');
    };

    const loadRouters = async ({ force = false } = {}) => {
        if (routersLoading.value || (!force && routers.value.length)) return;
        routersLoading.value = true;
        try {
            routers.value = await fetchRouters();
            if (!selectedRouterUid.value && routers.value.length) setSelectedRouterId(routers.value[0].uid);
            if (selectedRouterUid.value && !routers.value.some((item) => item.uid === selectedRouterUid.value)) {
                setSelectedRouterId(routers.value[0]?.uid || null);
            }
        } finally {
            routersLoading.value = false;
        }
    };

    const bootstrapAuth = async () => {
        if (authChecked.value) return isAuthenticated.value;
        if (!token.value) {
            authChecked.value = true;
            return false;
        }
        try {
            user.value = await fetchMe();
            return true;
        } catch {
            clearSession();
            return false;
        } finally {
            authChecked.value = true;
        }
    };

    const login = async (newToken) => {
        token.value = newToken;
        localStorage.setItem('auth_token', newToken);
        user.value = await fetchMe();
        authChecked.value = true;
    };

    const clearSession = () => {
        token.value = null;
        user.value = null;
        routers.value = [];
        authChecked.value = true;
        localStorage.removeItem('auth_token');
        setSelectedRouterId(null);
    };

    const logout = async () => {
        try {
            if (token.value) await logoutOperator();
        } finally {
            clearSession();
        }
    };

    return {
        showModal,
        isLoading,
        sidebarExpanded,
        filteredData,
        routers,
        routersLoading,
        token,
        user,
        isAuthenticated,
        selectedRouterUid,
        selectedRouterId,
        routerRefreshKey,
        setSelectedRouterId,
        loadRouters,
        bootstrapAuth,
        requestRouterRefresh: () => { routerRefreshKey.value += 1; },
        login,
        logout,
        handleFilteredListUpdate: (list) => { filteredData.value = list; },
        setLoading: (value) => { isLoading.value = value; },
        openModal: () => { showModal.value = true; },
        closeModal: () => { showModal.value = false; },
    };
});
