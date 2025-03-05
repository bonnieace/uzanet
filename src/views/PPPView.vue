<script setup>
import { ref,onMounted,computed } from 'vue';
import Table from '@/components/Table.vue';
import axios from 'axios';
import Search from '@/components/search.vue';
const data=ref([])

onMounted(async () => {
    try {
        const res = await axios.get('http://16.171.240.128:8000/ppp_users');
        data.value = res.data;
        console.log(data.value)
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
    <div class="content">
        <Search/>
        <Table title="Client Details" :columns="columns" :rows="rows"></Table>

    </div>
</template>