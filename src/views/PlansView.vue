<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Table from '@/components/Table.vue';
const data = ref('');
import { computed } from 'vue';
import Search from '@/components/search.vue';

onMounted(async () => {
    try {
        const res = await axios.get('https://uzanet.duckdns.org/packages');
        data.value = res.data; 
        console.log(data.value);
    } catch (error) {
        console.error('Error fetching hotspot users:', error);
    }
});

const columns = computed(() => {
    if (data.value && data.value.length > 0) {
        return Object.keys(data.value[0]);
    }
    return [];
});

const rows = computed(() => {
    return data.value;
});


</script>
<template>
    <main class="content">
        <Search title="add plan"/>
        <Table title="Plan Details" :rows="rows" :columns="columns"></Table>


    </main>


</template>