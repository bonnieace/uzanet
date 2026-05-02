<script setup>
import { fetchHotspotUsers, addHotspotUser } from '@/lib/api';
import { onMounted, ref, computed, watch } from 'vue';
import Table from '@/components/Table.vue';
import Modal from '@/components/Modal.vue';
import { useMainStore } from '@/stores/store';
import Search from '@/components/search.vue';
import CustomLoader from '@/components/customLoader.vue';

const store = useMainStore();
const data = ref([]);
const clientData = ref({ otp: '', phone_number: '', amount: '' });

const selectedRouterId = computed(() => store.selectedRouterId);

const loadHotspotUsers = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        const res = await fetchHotspotUsers(selectedRouterId.value);
        data.value = res;
        store.filteredData = res;
    } catch (error) {
        console.error('Error fetching hotspot users:', error);
    } finally {
        store.setLoading(false);
    }
};

watch(selectedRouterId, (id) => { if (id) loadHotspotUsers(); });
watch(() => store.routerRefreshKey, () => { if (selectedRouterId.value) loadHotspotUsers(); });

onMounted(async () => {
    await store.loadRouters();
    if (selectedRouterId.value) loadHotspotUsers();
});

const columns = computed(() => data.value.length ? Object.keys(data.value[0]) : []);
const rows = computed(() => store.filteredData);
const handleFilteredListUpdate = (list) => { store.filteredData = list; };

const handleSubmit = async () => {
    try {
        await addHotspotUser(selectedRouterId.value, clientData.value);
        const res = await fetchHotspotUsers(selectedRouterId.value);
        data.value = res;
        store.filteredData = res;
        store.closeModal();
        clientData.value = { otp: '', phone_number: '', amount: '' };
    } catch (error) {
        console.error('Error adding client:', error.response?.data || error.message);
    }
};
</script>

<template>
    <div class="content">
        <Search :clicked="store.openModal" :list="data" :search-keys="columns" @updateFilteredList="handleFilteredListUpdate" />

        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">Add Hotspot Client</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-row">
                    <div class="form-group">
                        <label for="otp">OTP*</label>
                        <input type="text" id="otp" v-model="clientData.otp" placeholder="Enter OTP" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="phone_number">Phone*</label>
                        <input type="text" id="phone_number" v-model="clientData.phone_number" placeholder="0712345678" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="amount">Amount (Ksh)*</label>
                        <input type="number" id="amount" v-model="clientData.amount" placeholder="50" required>
                    </div>
                </div>
                <button type="submit" class="submit-button" :disabled="store.isLoading">
                    {{ store.isLoading ? 'Adding...' : 'Add Client' }}
                </button>
            </form>
        </Modal>

        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="Hotspot Clients" :columns="columns" :rows="rows" />
    </div>
</template>
