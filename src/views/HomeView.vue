<script setup>
import axios from 'axios';
import { ref,onMounted,computed } from 'vue';
import card from '@/components/card.vue';
import graph from '@/components/graph.vue';
import Table from '@/components/Table.vue';
import Chart from '@/components/chart.vue';
import CustomLoader from '@/components/customLoader.vue';

const payments=ref([])
const data=ref([])

onMounted(async () => {
    try {
        const res = await axios.get('https://wifi.swahilipro.com/logs');
        data.value = res.data;
        const res2=await axios.get('https://wifi.swahilipro.com/payments')
        payments.value=res2.data
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
                <!-- Cards -->
                <div class="cards">
                   <card title="Daily Earnings" icon="fas fa-wallet" :amount="dailytotalearnings "/>

                   <card title="Monthly Earnings" icon="fas fa-calendar-alt" :amount=" monthlytotalearnings"/>
                   <card title="Daily PPPoE Earnings" :amount="dailyppp " icon="fas fa-user-check" />
                   <card title="Daily Hotspot Earnings" :amount="dailyhotspot " icon="fas fa-wifi" />
                   

                    
                    
                    
                </div>
                

                <!-- Table -->
                 
                 <Table :columns="columns" :rows="rows"></Table>
                

                <!-- Graph Container -->
               
                <graph/>
            </div>
        </div>
</template>