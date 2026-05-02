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

export default api;
