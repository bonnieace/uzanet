<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
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
        const res = await axios.get('https://wifi.swahilipro.com/packages');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data

        console.log(data.value);
    } catch (error) {
        console.error('Error fetching hotspot users:', error);
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
        const response = await axios.post(`https://wifi.swahilipro.com/package?${queryString}`, null, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('✅ plan added successfully:', response.data);

        // Refresh data after successful submission
        const res = await axios.get('https://wifi.swahilipro.com/packages');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data


        // Close modal and reset form
        closeModal();
        planData.value = { name: '', description: '', price: '',service_type: '',validity_days: '' };
    } catch (error) {
        console.error('❌ Error adding plan:', error.response?.data || error.message);
    }
};
</script>

<template>
    <div class="content">
        <search 
            :clicked="store.openModal" 
            :list="data" 
            :search-keys="columns" 
            @updateFilteredList="handleFilteredListUpdate" 
            title="plan"
        />

        <!-- Add plan Modal -->
        <div v-show="store.showModal" id="add-plan-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" @click="store.closeModal">&times;</span>
                <h3>Add New plan</h3>
                <form id="add-plan-form" @submit.prevent="handleSubmit">
                    <!-- name Field -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">name*</label>
                            <input type="text" id="name" v-model="planData.name" placeholder="user1234" required>
                        </div>
                    </div>

                    <!-- Phone Number -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="description">description*</label>
                            <input type="text" id="description" v-model="planData.description" placeholder="1 week connection" required>
                        </div>
                    </div>

                    <!-- price -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="price">price*</label>
                            <input type="text" id="price" v-model="planData.price" placeholder="50,300,1000" required>
                        </div>
                    </div>

                    <!-- service type -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="service_type">service_type*</label>
                            <input type="text" id="service_type" v-model="planData.service_type" placeholder="pppoe or hotspot" required>
                        </div>
                    </div>
                    <!-- validity_days -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="validity_days">validity_days*</label>
                            <input type="text" id="validity_days" v-model="planData.validity_days" placeholder="1,7,30" required>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="submit-button">Add plan</button>
                </form>
            </div>
        </div>

        <!-- Content Area -->
         <customLoader v-if="store.isLoading" />
        <div class="tables" v-else>
            <Table title="plan details" :columns="columns" :rows="rows"></Table>
        </div>
    </div>
</template>

                    <!-- Profile/Plan and PPPoE Password 
                    <div class="form-row">
                        <div class="form-group">
                            <label for="profile">Select Profile/Plan*</label>
                            <select id="profile" name="profile" required>
                                <option value="10 Mbps">10 Mbps</option>
                                <option value="20 Mbps">20 Mbps</option>
                                <option value="50 Mbps">50 Mbps</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pppoe-password">PPPoE Password*</label>
                            <input type="password" id="pppoe-password" name="pppoe-password" placeholder="user1234" required>
                        </div>
                    </div>-->

                    <!-- Coordinates and House 
                    <div class="form-row">
                        <div class="form-group">
                            <label for="coordinates">Coordinates (Optional)</label>
                            <input type="text" id="coordinates" name="coordinates" placeholder="-3.5000,35.4000">
                        </div>
                        <div class="form-group">
                            <label for="house">House (Optional)</label>
                            <input type="text" id="house" name="house" placeholder="C8">
                        </div>
                    </div>-->

                    <!-- Expiry Date 
                    <div class="form-group">
                        <label for="expiry">Select Expiry Date (Recommended)</label>
                        <input type="date" id="expiry" name="expiry" required>
                    </div>-->

                    <!-- Submit Button -->
                  
        <!-- Content Area -->
       