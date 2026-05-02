import axios from 'axios';
import router from '@/router';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            router.push({ name: 'Login' });
        }
        return Promise.reject(error);
    }
);

export const fetchActiveHotspotUsers = (routerId) =>
    api.get(`/active_users/${routerId}/hotspot`).then((r) => r.data);

export const fetchActivePppoeUsers = (routerId) =>
    api.get(`/active_users/${routerId}/pppoe`).then((r) => r.data);

export const fetchLogs = (routerId) =>
    api.get('/logs', { params: { router_id: routerId } }).then((r) => r.data);

export const fetchPayments = (routerId) =>
    api.get('/payments', { params: { router_id: routerId } }).then((r) => r.data);

export const fetchPackages = (routerId) =>
    api.get('/packages', { params: { router_id: routerId } }).then((r) => r.data);

export const addPackage = (routerId, planData) => {
    const params = new URLSearchParams({ ...planData, router_id: routerId }).toString();
    return api.post(`/package?${params}`, null, { headers: { Accept: 'application/json' } }).then((r) => r.data);
};

export const fetchPppUsers = (routerId) =>
    api.get('/ppp_users', { params: { router_id: routerId } }).then((r) => r.data);

export const addPppUser = (routerId, clientData) => {
    const params = new URLSearchParams({ ...clientData, router_id: routerId }).toString();
    return api.post(`/ppp_user?${params}`, null, { headers: { Accept: 'application/json' } }).then((r) => r.data);
};

export const fetchHotspotUsers = (routerId) =>
    api.get('/hotspot_users', { params: { router_id: routerId } }).then((r) => r.data);

export const addHotspotUser = (routerId, clientData) => {
    const params = new URLSearchParams({ ...clientData, router_id: routerId }).toString();
    return api.post(`/hotspot_user?${params}`, null, { headers: { Accept: 'application/json' } }).then((r) => r.data);
};

export default api;
