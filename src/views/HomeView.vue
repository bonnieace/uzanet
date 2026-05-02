<script setup>
import api from '@/lib/api';
import { ref,onMounted,computed, watch } from 'vue';
import StatCard from '@/components/StatCard.vue';
import { Wallet, CalendarDays, UserCheck, Wifi, Activity, Users } from 'lucide-vue-next';
import graph from '@/components/graph.vue';
import Table from '@/components/Table.vue';
import Chart from '@/components/chart.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';
import { fetchActiveHotspotUsers, fetchActivePppoeUsers } from '@/services/activeUsers';

const store = useMainStore();
const payments=ref([])
const data=ref([])

// ── Router selection for active-user cards ──────────────────
const routersLoading = ref(false);

const loadRouters = async () => {
    if (store.routers.length) return;
    routersLoading.value = true;
    try {
        const res = await api.get('/routers');
        store.routers = res.data || [];
        if (store.routers.length && !store.selectedRouterId) {
            store.selectedRouterId = store.routers[0].id;
        }
    } catch {
        // silently ignore — stat cards will show error state
    } finally {
        routersLoading.value = false;
    }
};

// ── Active user counts ──────────────────────────────────────
const hotspotCount = ref(null);
const pppoeCount = ref(null);
const hotspotError = ref(false);
const pppoeError = ref(false);
const hotspotCountLoading = ref(false);
const pppoeCountLoading = ref(false);

const loadActiveCounts = async () => {
    if (!store.selectedRouterId) return;

    hotspotCountLoading.value = true;
    pppoeCountLoading.value = true;
    hotspotError.value = false;
    pppoeError.value = false;

    const [hotspotResult, pppoeResult] = await Promise.allSettled([
        fetchActiveHotspotUsers(store.selectedRouterId),
        fetchActivePppoeUsers(store.selectedRouterId),
    ]);

    if (hotspotResult.status === 'fulfilled') {
        hotspotCount.value = Array.isArray(hotspotResult.value) ? hotspotResult.value.length : 0;
    } else {
        hotspotError.value = true;
        hotspotCount.value = null;
    }
    hotspotCountLoading.value = false;

    if (pppoeResult.status === 'fulfilled') {
        pppoeCount.value = Array.isArray(pppoeResult.value) ? pppoeResult.value.length : 0;
    } else {
        pppoeError.value = true;
        pppoeCount.value = null;
    }
    pppoeCountLoading.value = false;
};

watch(() => store.selectedRouterId, (id) => {
    if (id) loadActiveCounts();
});

onMounted(async () => {
    try {
        const res = await api.get('/logs');
        data.value = res.data;
        const res2 = await api.get('/payments');
        payments.value = res2.data;
    } catch (error) {
        console.log(error);
    }
    await loadRouters();
    if (store.selectedRouterId) loadActiveCounts();
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
    <CustomLoader v-if="!data.length" />
        <div v-else>
                <!-- Router selector for active user cards -->
                <div class="hv-router-bar" v-if="store.routers.length || routersLoading">
                    <label for="hv-router-select" class="hv-router-label">Router</label>
                    <select
                        id="hv-router-select"
                        v-model="store.selectedRouterId"
                        class="hv-router-select"
                        :disabled="routersLoading"
                    >
                        <option v-if="routersLoading" disabled value="">Loading…</option>
                        <option
                            v-for="r in store.routers"
                            :key="r.id"
                            :value="r.id"
                        >{{ r.name }}</option>
                    </select>
                </div>

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
                    <StatCard
                        title="Hotspot Active Users"
                        :icon="Activity"
                        :value="hotspotCountLoading ? '…' : (hotspotError ? '—' : (hotspotCount ?? '—'))"
                        :change="null"
                        color="primary"
                        :subtitle="hotspotError ? 'unavailable' : 'live sessions'"
                    />
                    <StatCard
                        title="PPPoE Active Users"
                        :icon="Users"
                        :value="pppoeCountLoading ? '…' : (pppoeError ? '—' : (pppoeCount ?? '—'))"
                        :change="null"
                        color="warning"
                        :subtitle="pppoeError ? 'unavailable' : 'live sessions'"
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
.hv-router-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
}

.hv-router-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    color: var(--muted-foreground);
}

.hv-router-select {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    background-color: var(--card);
    color: var(--foreground);
    border: var(--border-width) solid var(--border);
    box-shadow: 3px 3px 0px 0px var(--border);
    border-radius: var(--radius);
    outline: none;
    cursor: pointer;
    min-width: 160px;
}

.hv-router-select:focus {
    box-shadow: 0 0 0 3px var(--primary);
}
</style>