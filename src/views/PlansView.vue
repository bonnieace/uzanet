<script setup>
import { fetchPackages, addPackage } from '@/lib/api';
import { onMounted, ref, computed, watch } from 'vue';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import { useMainStore } from '@/stores/store';
import customLoader from '@/components/customLoader.vue';

const store = useMainStore();
const data = ref([]);

const selectedRouterId = computed(() => store.selectedRouterId);

// Form data state
const planData = ref({
    name: '',
    description: '',
    price: '',
    service_type: '',
    validity_days: '',
});

const loadPackages = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        const res = await fetchPackages(selectedRouterId.value);
        data.value = res;
        store.filteredData = res;
    } finally {
        store.setLoading(false);
    }
};

watch(selectedRouterId, (id) => { if (id) loadPackages(); });
watch(() => store.routerRefreshKey, () => { if (selectedRouterId.value) loadPackages(); });

onMounted(async () => {
    await store.loadRouters();
    if (selectedRouterId.value) loadPackages();
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
const openModal = () => {
    store.showModal.value = true;
};

const closeModal = () => {
    store.showModal.value = false;
};

// Function to submit form data
const handleSubmit = async () => {
    try {
        await addPackage(selectedRouterId.value, planData.value);

        // Refresh data after successful submission
        const res = await fetchPackages(selectedRouterId.value);
        data.value = res;
        store.filteredData = res;

        // Close modal and reset form
        closeModal();
        planData.value = { name: '', description: '', price: '', service_type: '', validity_days: '' };
    } catch (error) {
        console.error('Error adding plan:', error.response?.data || error.message);
    }
};
</script>


<template>
    <div class="content">
        <Search
            :clicked="store.openModal"
            :list="data"
            :search-keys="columns"
            @updateFilteredList="handleFilteredListUpdate"
            title="Add Plan"
        />

        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">Add New Plan</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Plan Name*</label>
                        <input type="text" id="name" v-model="planData.name" placeholder="e.g. Basic" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="description">Description*</label>
                        <input type="text" id="description" v-model="planData.description" placeholder="1 week connection" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="price">Price (Ksh)*</label>
                        <input type="number" id="price" v-model="planData.price" placeholder="300" required>
                    </div>
                    <div class="form-group">
                        <label for="validity_days">Validity (Days)*</label>
                        <input type="number" id="validity_days" v-model="planData.validity_days" placeholder="7" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="service_type">Service Type*</label>
                        <select id="service_type" v-model="planData.service_type" required>
                            <option value="pppoe">PPPoE</option>
                            <option value="hotspot">Hotspot</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="submit-button">Add Plan</button>
            </form>
        </Modal>

        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="Plans" :columns="columns" :rows="rows" />
    </div>
</template>
