<script setup>
import Table from '@/components/Table.vue';
import axios from 'axios';
import { ref,onMounted,computed } from 'vue';
import { useMainStore } from '@/stores/store';
import customLoader from '@/components/customLoader.vue';
import search from '@/components/search.vue';
const store=useMainStore();
const data=ref([])

onMounted(async () => {
    store.setLoading(true);
    try {
        const res = await axios.get('https://wifi.swahilipro.com/logs');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data

    } catch (error) {
        console.log(error);
    }finally{
        store.setLoading(false);
    }
});

const columns = computed(() => {
    if (data.value && data.value.length > 0) {
        return Object.keys(data.value[0]);
    }
    return [];
});

const rows = computed(() => store.filteredData);

const handleFilteredListUpdate = (updatedList) => {
    store.filteredData = updatedList;
};

</script>
<template>
<main class="content">
    <search 
            :clicked="store.openModal" 
            :list="data" 
            :search-keys="columns" 
            @updateFilteredList="handleFilteredListUpdate" 
            title="log"
        />
    <customLoader v-if="store.isLoading" />
    <Table :rows="rows" :columns="columns" title="System Logs" v-else></Table>

</main>
</template>