<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Table from '@/components/Table.vue';
import { useMainStore } from '@/stores/store';
import search from '@/components/search.vue';
import customLoader from '@/components/customLoader.vue';
const store = useMainStore();
const data = ref([]);

// Default client data structure
const defaultClientData = { otp: '', phone_number: '', amount: '' };
const clientData = ref({ ...defaultClientData });

onMounted(async () => {
    store.setLoading(true); // Start loading

    try {
        

        const res = await axios.get('https://wifi.swahilipro.com/hotspot_users');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data
        

    } catch (error) {
        console.error('Error fetching hotspot users:', error);
    }finally {
        store.setLoading(false); // Stop loading
    }
});
// Dynamically extract table columns from the data
const columns = computed(() => data.value.length ? Object.keys(data.value[0]) : []);

// Use filtered data from the store
const rows = computed(() => store.filteredData);

// Handle updates from Search component
const handleFilteredListUpdate = (updatedList) => {
    store.filteredData = updatedList;
};

// Submit form data
const handleSubmit = async () => {
    try {

        const queryString = new URLSearchParams(clientData.value).toString();
        const response = await axios.post(`https://wifi.swahilipro.com/hotspot_user?${queryString}`, null, {
            headers: { 'Accept': 'application/json' }
        });

        console.log('✅ Client added successfully:', response.data);

        // Refresh data after successful submission
        const res = await axios.get('https://wifi.swahilipro.com/hotspot_users');
        data.value = res.data;
        store.filteredData = res.data;

        store.closeModal();
        clientData.value = { ...defaultClientData }; // Reset form
    } catch (error) {
        console.error('❌ Error adding client:', error.response?.data || error.message);
    } finally {
        store.setLoading(false); // Stop loading
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
        />

        <!-- Add Client Modal -->
        <div  v-show="store.showModal" id="add-client-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" @click="store.closeModal">&times;</span>
                <h3>Add New Client</h3>
                <form @submit.prevent="handleSubmit">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="otp">OTP*</label>
                            <input type="text" id="otp" v-model="clientData.otp" placeholder="user1234" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone_number">Phone Number*</label>
                            <input type="text" id="phone_number" v-model="clientData.phone_number" placeholder="0712345678" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="amount">Amount*</label>
                            <input type="text" id="amount" v-model="clientData.amount" placeholder="10,50,300,1000" required>
                        </div>
                    </div>

                    <button type="submit" class="submit-button" :disabled="store.isLoading">
                        {{ store.isLoading ? 'Adding...' : 'Add Client' }}
                    </button>
                </form>
            </div>
        </div>
        <customLoader  v-if="store.isLoading"/>

        <div class="tables" v-else>
            <Table title="Client details" :columns="columns" :rows="rows" />
        </div>
    </div>
</template>
