import api from '@/lib/api';

/**
 * Fetch active hotspot users for a given router.
 * @param {number|string} routerId
 * @returns {Promise<Array>}
 */
export const fetchActiveHotspotUsers = async (routerId) => {
    const res = await api.get(`/active_users/${routerId}/hotspot`);
    return res.data;
};

/**
 * Fetch active PPPoE users for a given router.
 * @param {number|string} routerId
 * @returns {Promise<Array>}
 */
export const fetchActivePppoeUsers = async (routerId) => {
    const res = await api.get(`/active_users/${routerId}/pppoe`);
    return res.data;
};
