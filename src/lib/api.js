import axios from 'axios';
import router from '@/router';

const configuredBase = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
const apiBase = configuredBase.endsWith('/api/v1') ? configuredBase : `${configuredBase}/api/v1`;

const api = axios.create({
    baseURL: apiBase,
    timeout: 15_000,
    headers: { Accept: 'application/json' },
});

export const publicApi = axios.create({
    baseURL: apiBase,
    timeout: 15_000,
    headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('selected_router_uid');
            if (router.currentRoute.value.name !== 'Login') router.push({ name: 'Login' });
        }
        return Promise.reject(error);
    },
);

export const errorMessage = (error, fallback = 'Request failed. Please try again.') =>
    error.response?.data?.detail || (error.code === 'ECONNABORTED' ? 'The request timed out.' : fallback);

export const loginOperator = (username, password) => {
    const body = new URLSearchParams({ username, password });
    return publicApi.post('/auth/token', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((response) => response.data);
};
export const fetchMe = () => api.get('/me').then((response) => response.data);
export const logoutOperator = () => api.post('/auth/logout');

export const fetchRouters = () => api.get('/routers').then((response) => response.data);
export const fetchRouterStatuses = () => api.get('/routers/status').then((response) => response.data);
export const beginRouterOnboarding = (data) => api.post('/routers/onboarding', data).then((response) => response.data);
export const addRouter = (data) => api.post('/routers', data).then((response) => response.data);
export const updateRouter = (routerUid, data) => api.patch(`/routers/${routerUid}`, data).then((response) => response.data);
export const removeRouter = (routerUid) => api.delete(`/routers/${routerUid}`);

export const fetchActiveUsers = (routerUid) =>
    api.get(`/routers/${routerUid}/active-users`).then((response) => response.data);
export const fetchActiveHotspotUsers = async (routerUid) => {
    const data = await fetchActiveUsers(routerUid);
    return { generated_at: data.generated_at, hotspot_active: data.hotspot || [] };
};
export const fetchActivePppoeUsers = async (routerUid) => {
    const data = await fetchActiveUsers(routerUid);
    return { generated_at: data.generated_at, pppoe_active: data.pppoe || [] };
};
export const fetchLogs = (routerUid) =>
    api.get(`/routers/${routerUid}/logs`).then((response) => response.data);
export const fetchPayments = (routerUid) =>
    api.get(`/routers/${routerUid}/payments`).then((response) => response.data);
export const fetchPaymentSessions = (routerUid) =>
    api.get(`/routers/${routerUid}/payment-sessions`).then((response) => response.data);
export const retryPaymentProvisioning = (paymentId) =>
    api.post(`/payments/${paymentId}/retry-provisioning`).then((response) => response.data);

export const fetchPackages = (routerUid) =>
    api.get(`/routers/${routerUid}/packages`).then((response) => response.data);
export const addPackage = (routerUid, data) =>
    api.post(`/routers/${routerUid}/packages`, data).then((response) => response.data);
export const updatePackage = (routerUid, packageUid, data) =>
    api.patch(`/routers/${routerUid}/packages/${packageUid}`, data).then((response) => response.data);
export const retirePackage = (routerUid, packageUid) =>
    api.delete(`/routers/${routerUid}/packages/${packageUid}`).then((response) => response.data);

export const fetchPppUsers = (routerUid) =>
    api.get(`/routers/${routerUid}/pppoe-users`).then((response) => response.data);
export const addPppUser = (routerUid, data) =>
    api.post(`/routers/${routerUid}/pppoe-users`, data).then((response) => response.data);
export const setPppUserEnabled = (routerUid, userUid, enabled) =>
    api.post(`/routers/${routerUid}/pppoe-users/${userUid}/${enabled ? 'enable' : 'disable'}`).then((response) => response.data);
export const removePppUser = (routerUid, userUid) => api.delete(`/routers/${routerUid}/pppoe-users/${userUid}`);

export const fetchHotspotUsers = (routerUid) =>
    api.get(`/routers/${routerUid}/hotspot-users`).then((response) => response.data);
export const addHotspotUser = (routerUid, data) =>
    api.post(`/routers/${routerUid}/hotspot-users`, data).then((response) => response.data);
export const setHotspotUserEnabled = (routerUid, userUid, enabled) =>
    api.post(`/routers/${routerUid}/hotspot-users/${userUid}/${enabled ? 'enable' : 'disable'}`).then((response) => response.data);
export const removeHotspotUser = (routerUid, userUid) => api.delete(`/routers/${routerUid}/hotspot-users/${userUid}`);

export const fetchPortal = (portalSlug) =>
    publicApi.get(`/public/portals/${encodeURIComponent(portalSlug)}`).then((response) => response.data);
export const initiatePortalPayment = (portalSlug, data, idempotencyKey) =>
    publicApi.post(`/public/portals/${encodeURIComponent(portalSlug)}/payments`, data, {
        headers: { 'Idempotency-Key': idempotencyKey },
    }).then((response) => response.data);
export const fetchPaymentStatus = (paymentId, statusToken) =>
    publicApi.get(`/public/payments/${encodeURIComponent(paymentId)}`, {
        headers: { 'X-Payment-Token': statusToken },
    }).then((response) => response.data);

export default api;
