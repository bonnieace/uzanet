<script setup>
import api, { fetchActiveHotspotUsers, fetchActivePppoeUsers, fetchLogs, fetchPayments } from '@/lib/api';
import { ref,onMounted,computed, watch } from 'vue';
import StatCard from '@/components/StatCard.vue';
import { Wallet, CalendarDays, UserCheck, Wifi, Activity } from 'lucide-vue-next';
import graph from '@/components/graph.vue';
import Table from '@/components/Table.vue';
import Chart from '@/components/chart.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();

const payments=ref([])
const data=ref([])
const dashboardLoading = ref(true)

// ── Active users (per-router) ────────────────────────────────────
const selectedRouterId = computed({
    get: () => store.selectedRouterId,
    set: (val) => store.setSelectedRouterId(val),
});

const hotspotActiveCount = ref(null);
const pppoeActiveCount = ref(null);
const activeUsersLoading = ref(false);
const activeUsersError = ref('');

const loadActiveUsers = async () => {
    if (!selectedRouterId.value) return;
    activeUsersLoading.value = true;
    activeUsersError.value = '';
    try {
        const [hotspotRes, pppoeRes] = await Promise.all([
            fetchActiveHotspotUsers(selectedRouterId.value),
            fetchActivePppoeUsers(selectedRouterId.value),
        ]);
        hotspotActiveCount.value = (hotspotRes.hotspot_active || []).length;
        pppoeActiveCount.value = (pppoeRes.pppoe_active || []).length;
    } catch (e) {
        activeUsersError.value = e.response?.data?.detail || 'Failed to load active user counts.';
        hotspotActiveCount.value = null;
        pppoeActiveCount.value = null;
    } finally {
        activeUsersLoading.value = false;
    }
};

watch(() => store.routerRefreshKey, async () => {
    if (!selectedRouterId.value) return;
    loadActiveUsers();
    try {
        const [logsRes, paymentsRes] = await Promise.all([
            fetchLogs(selectedRouterId.value),
            fetchPayments(selectedRouterId.value),
        ]);
        data.value = logsRes;
        payments.value = paymentsRes;
    } catch (error) {
        console.log(error);
    }
});

onMounted(async () => {
    dashboardLoading.value = true;
    try {
        await store.loadRouters();
    } catch (e) {
        console.error('Failed to load routers on dashboard:', e);
    }

    if (selectedRouterId.value) {
        try {
            const [logsRes, paymentsRes] = await Promise.all([
                fetchLogs(selectedRouterId.value),
                fetchPayments(selectedRouterId.value),
            ]);
            data.value = logsRes;
            payments.value = paymentsRes;
        } catch (error) {
            console.log(error);
        }
        loadActiveUsers();
    }
    dashboardLoading.value = false;
});

watch(selectedRouterId, async (id) => {
    if (!id) return;
    dashboardLoading.value = true;
    data.value = [];
    payments.value = [];
    loadActiveUsers();
    try {
        const [logsRes, paymentsRes] = await Promise.all([
            fetchLogs(id),
            fetchPayments(id),
        ]);
        data.value = logsRes;
        payments.value = paymentsRes;
    } catch (error) {
        console.log(error);
    } finally {
        dashboardLoading.value = false;
    }
});
const dailytotalearnings = computed(() => {
    return payments.value.reduce((total, payment) => {
        const paymentDate = new Date(payment.created_at);
        const today = new Date();
        if (paymentDate.toDateString() === today.toDateString()) {
            return total + payment.amount;
        }
        return total;
    }, 0);
});

const monthlytotalearnings = computed(() => {
    return payments.value.reduce((total, payment) => {
        const paymentDate = new Date(payment.created_at);
        const today = new Date();
        if (paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear()) {
            return total + payment.amount;
        }
        return total;
    }, 0);
});

const dailyppp = computed(() => {
    return payments.value.reduce((total, payment) => {
        const paymentDate = new Date(payment.created_at);
        const today = new Date();
        if (paymentDate.toDateString() === today.toDateString() && payment.user_type === 'pppoe') {
            return total + payment.amount;
        }
        return total;
    }, 0);
});

const dailyhotspot = computed(() => {
    return payments.value.reduce((total, payment) => {
        const paymentDate = new Date(payment.created_at);
        const today = new Date();
        if (paymentDate.toDateString() === today.toDateString() && payment.user_type === 'hotspot') {
            return total + payment.amount;
        }
        return total;
    }, 0);
});

const yesterdayEarnings = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return payments.value.reduce((total, p) => {
        return new Date(p.created_at).toDateString() === yesterday.toDateString()
            ? total + p.amount : total;
    }, 0);
});

const lastMonthEarnings = computed(() => {
    const today = new Date();
    const lm = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const lmYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return payments.value.reduce((total, p) => {
        const d = new Date(p.created_at);
        return d.getMonth() === lm && d.getFullYear() === lmYear ? total + p.amount : total;
    }, 0);
});

const yesterdayPPP = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return payments.value.reduce((total, p) => {
        return new Date(p.created_at).toDateString() === yesterday.toDateString() && p.user_type === 'pppoe'
            ? total + p.amount : total;
    }, 0);
});

const yesterdayHotspot = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return payments.value.reduce((total, p) => {
        return new Date(p.created_at).toDateString() === yesterday.toDateString() && p.user_type === 'hotspot'
            ? total + p.amount : total;
    }, 0);
});

const trendChange = (current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const diff = ((current - previous) / previous * 100).toFixed(1);
    return diff > 0 ? `+${diff}%` : `${diff}%`;
};

const trendDir = (current, previous) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
};

const columns = computed(() => {
    if (data.value && data.value.length > 0) {
        return Object.keys(data.value[0]);
    }
    return [];
});

const rows = computed(() => {
    return data.value.slice(-5);
});


</script>
<template>
    <div class="content">
        <CustomLoader :show="dashboardLoading" />

        <div v-if="!dashboardLoading && !selectedRouterId" class="dashboard-empty">
            <div class="dashboard-empty-card">
                <span class="dashboard-empty-icon">🔌</span>
                <h3>No Router Selected</h3>
                <p>Select a router from the header to view the dashboard.</p>
            </div>
        </div>

        <div v-else-if="!dashboardLoading && !payments.length && !data.length" class="dashboard-empty">
            <div class="dashboard-empty-card">
                <span class="dashboard-empty-icon">📭</span>
                <h3>No Data Found</h3>
                <p>No records found for the selected router yet.</p>
            </div>
        </div>

        <div v-else-if="!dashboardLoading">
                <!-- Stat Cards -->
                <div class="cards">
                    <StatCard
                        title="Daily Earnings"
                        :icon="Wallet"
                        :value="'KES ' + dailytotalearnings.toLocaleString()"
                        :change="trendChange(dailytotalearnings, yesterdayEarnings)"
                        :trend="trendDir(dailytotalearnings, yesterdayEarnings)"
                        color="success"
                        subtitle="vs yesterday"
                    />
                    <StatCard
                        title="Monthly Earnings"
                        :icon="CalendarDays"
                        :value="'KES ' + monthlytotalearnings.toLocaleString()"
                        :change="trendChange(monthlytotalearnings, lastMonthEarnings)"
                        :trend="trendDir(monthlytotalearnings, lastMonthEarnings)"
                        color="primary"
                        subtitle="vs last month"
                    />
                    <StatCard
                        title="Daily PPPoE Earnings"
                        :icon="UserCheck"
                        :value="'KES ' + dailyppp.toLocaleString()"
                        :change="trendChange(dailyppp, yesterdayPPP)"
                        :trend="trendDir(dailyppp, yesterdayPPP)"
                        color="warning"
                        subtitle="vs yesterday"
                    />
                    <StatCard
                        title="Daily Hotspot Earnings"
                        :icon="Wifi"
                        :value="'KES ' + dailyhotspot.toLocaleString()"
                        :change="trendChange(dailyhotspot, yesterdayHotspot)"
                        :trend="trendDir(dailyhotspot, yesterdayHotspot)"
                        color="secondary"
                        subtitle="vs yesterday"
                    />
                    <!-- Active user cards -->
                    <StatCard
                        title="Hotspot Active Users"
                        :icon="Wifi"
                        :value="activeUsersLoading ? '…' : activeUsersError ? 'Error' : (hotspotActiveCount ?? '—')"
                        :change="activeUsersError ? activeUsersError : null"
                        :trend="activeUsersError ? 'down' : 'neutral'"
                        color="primary"
                        subtitle="currently online"
                    />
                    <StatCard
                        title="PPPoE Active Users"
                        :icon="Activity"
                        :value="activeUsersLoading ? '…' : activeUsersError ? 'Error' : (pppoeActiveCount ?? '—')"
                        :change="activeUsersError ? activeUsersError : null"
                        :trend="activeUsersError ? 'down' : 'neutral'"
                        color="success"
                        subtitle="currently online"
                    />
                </div>
                

                <!-- Table -->
                 
                 <Table :columns="columns" :rows="rows"></Table>
                

                <!-- Graph Container -->
               
                <graph/>
            </div>
        </div>
</template>

<style scoped>
.dashboard-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
}

.dashboard-empty-card {
    text-align: center;
    padding: 2.5rem 3rem;
    background: var(--card-background);
    border: var(--border-width) solid var(--border);
    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px 0px var(--border);
    border-radius: var(--border-radius, 0);
}

.dashboard-empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
}

.dashboard-empty-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.dashboard-empty-card p {
    color: var(--text-muted, #666);
    font-size: 0.9rem;
}
</style>