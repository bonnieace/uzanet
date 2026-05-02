<script setup>
import api, { fetchActiveHotspotUsers, fetchActivePppoeUsers } from '@/lib/api';
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

// ── Active users (per-router) ────────────────────────────────────
const selectedRouterId = computed(() => store.selectedRouterId);

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

watch(selectedRouterId, (id) => {
    if (id) loadActiveUsers();
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

    if (selectedRouterId.value) {
        loadActiveUsers();
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
    <CustomLoader v-if="!data.length" />
        <div v-else>
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
</style>