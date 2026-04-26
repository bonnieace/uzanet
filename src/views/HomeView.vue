<script setup>
import axios from 'axios';
import { ref,onMounted,computed } from 'vue';
import StatCard from '@/components/StatCard.vue';
import { Wallet, CalendarDays, UserCheck, Wifi } from 'lucide-vue-next';
import graph from '@/components/graph.vue';
import Table from '@/components/Table.vue';
import Chart from '@/components/chart.vue';
import CustomLoader from '@/components/customLoader.vue';

const payments=ref([])
const data=ref([])

onMounted(async () => {
    try {
            const tokenRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/token`, new URLSearchParams({
            username: import.meta.env.VITE_API_USERNAME,
            password: import.meta.env.VITE_API_PASSWORD
        }));
        const token = tokenRes.data.access_token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/logs`, config);
        data.value = res.data;
        const res2 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/payments`, config);
        payments.value = res2.data;
        console.log(payments.value);
    } catch (error) {
        console.log(error);
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
                </div>
                

                <!-- Table -->
                 
                 <Table :columns="columns" :rows="rows"></Table>
                

                <!-- Graph Container -->
               
                <graph/>
            </div>
        </div>
</template>