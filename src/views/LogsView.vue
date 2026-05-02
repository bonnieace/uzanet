<script setup>
import Table from '@/components/Table.vue';
import { fetchLogs } from '@/lib/api';
import { ref, onMounted, computed, watch } from 'vue';
import { useMainStore } from '@/stores/store';
import customLoader from '@/components/customLoader.vue';
import search from '@/components/search.vue';
const store = useMainStore();
const data = ref([]);

const selectedRouterId = computed(() => store.selectedRouterId);

const loadLogs = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        const res = await fetchLogs(selectedRouterId.value);
        data.value = res;
        store.filteredData = res;
    } catch (error) {
        console.log(error);
    } finally {
        store.setLoading(false);
    }
};

watch(selectedRouterId, (id) => { if (id) loadLogs(); });
watch(() => store.routerRefreshKey, () => { if (selectedRouterId.value) loadLogs(); });

onMounted(async () => {
    await store.loadRouters();
    if (selectedRouterId.value) loadLogs();
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