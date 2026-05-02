<script setup>
import { fetchPayments } from '@/lib/api';
import { ref, onMounted, computed, watch } from 'vue';
import Table from '@/components/Table.vue';
import search from '@/components/search.vue';
import { useMainStore } from '@/stores/store';
import customLoader from '@/components/customLoader.vue';
const store = useMainStore();
const data = ref([]);

const selectedRouterId = computed(() => store.selectedRouterId);

const loadPayments = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        const res = await fetchPayments(selectedRouterId.value);
        data.value = res;
        console.log(data.value);
    } catch (error) {
        console.error('Error fetching payment records:', error);
    } finally {
        store.setLoading(false);
    }
};

watch(selectedRouterId, (id) => { if (id) loadPayments(); });
watch(() => store.routerRefreshKey, () => { if (selectedRouterId.value) loadPayments(); });

onMounted(async () => {
    await store.loadRouters();
    if (selectedRouterId.value) loadPayments();
});

const rows=computed(()=>{
    return data.value


})

const columns=computed(()=>{
    if (data.value && data.value.length > 0) {
        return Object.keys(data.value[0]);
    }
    return [];
    
})
</script>
<template>
    <main class="content">
        <customLoader  v-if="store.isLoading"/>

        <Table title="Payment Records" :rows="rows" :columns="columns" v-else></Table>

    </main>
</template>