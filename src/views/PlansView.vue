<script setup>
import api from '@/lib/api';
import { onMounted, ref, computed } from 'vue';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import { useMainStore } from '@/stores/store';
import customLoader from '@/components/customLoader.vue';

const store=useMainStore();
const data = ref([]);

// Form data state
const planData = ref({
    name: '',
    description: '',
    price: '',
    service_type: '',
    validity_days: '',
});

onMounted(async () => {
    console.log(store.showModal.value);
    store.setLoading(true); // Start loading
    try {
        const res = await api.get('/packages');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data
    }finally{
        store.setLoading(false); // Stop loading
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
const openModal = () => {
    store.showModal.value = true;
};

const closeModal = () => {
    store.showModal.value = false;
};

// Function to submit form data
const handleSubmit = async () => {
    try {
        console.log(planData.value);
        // Convert plan data to query parameters
        const queryString = new URLSearchParams(planData.value).toString();
        console.log(queryString);

        // Make the request
        const response = await api.post(`/package?${queryString}`, null, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('âœ… plan added successfully:', response.data);

        // Refresh data after successful submission
        const res = await api.get('/packages');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data


        // Close modal and reset form
        closeModal();
        planData.value = { name: '', description: '', price: '',service_type: '',validity_days: '' };
    } catch (error) {
        console.error('âŒ Error adding plan:', error.response?.data || error.message);
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
