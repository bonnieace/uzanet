<script setup>
import { ref } from 'vue';
import card from '@/components/card.vue';
import graph from '@/components/graph.vue';
import Table from '@/components/Table.vue';
const dailytotalearnings=ref(10000);
const monthlytotalearnings=ref(20);
const dailyhotspot=ref(0);
const dailyppp=ref(10);

const tableData = ref([
    { ID: 1, Name: 'User 1', Earnings: 100 },
    { ID: 2, Name: 'User 2', Earnings: 200 },
    { ID: 3, Name: 'User 3', Earnings: 300 },
]);

const tableColumns = ref([
    'ID','Name','Earnings'
]);
</script>
<template>
    <div class="content">
                <!-- Cards -->
                <div class="cards">
                   <card title="Daily Earnings" icon="fas fa-wallet" :amount="dailytotalearnings "/>

                   <card title="Monthly Earnings" icon="fas fa-calendar-alt" :amount=" monthlytotalearnings"/>
                   <card title="PPPoE Users" :amount="dailyppp " icon="fas fa-user-check" :pay="false"/>
                   <card title="Hotspot Users" :amount="dailyhotspot " icon="fas fa-wifi" :pay="false"/>

                    
                    
                    
                </div>

                <!-- Table -->
                 
                 <Table :columns="tableColumns" :rows="tableData"></Table>
                

                <!-- Graph Container -->
               
                <graph/>
            </div>
</template>