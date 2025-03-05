<script setup>
import Table from '@/components/Table.vue';
import axios from 'axios';
import { ref,onMounted,computed } from 'vue';
const data=ref([])

onMounted(async () => {
    try {
        const res = await axios.get('https://16.171.240.128:8000/logs');
        data.value = res.data;
    } catch (error) {
        console.log(error);
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
    <Table :rows="rows" :columns="columns" title="System Logs"></Table>

</main>
</template>