<script setup>
import { ref, onMounted, computed } from 'vue';
import Table from '@/components/Table.vue';
import axios from 'axios';
import Search from '@/components/search.vue';
import { useMainStore } from '@/stores/store';
import CustomLoader from '@/components/customLoader.vue';

const store=useMainStore()
const data = ref([]);






async function addClient(clientData) {
    try {
        // Convert client data to query parameters
        const queryString = new URLSearchParams(clientData).toString();
        console.log(queryString);
        
        // Make the request
        const response = await axios.post(`https://uzanet.duckdns.org/ppp_user?${queryString}`, null, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('✅ Client added successfully:', response.data);
        return response.data; // Return response data for further processing
    } catch (error) {
        console.error('❌ Error adding client:', error.response?.data || error.message);
        throw error; // Rethrow error for handling in UI
    }
}

// Add handleSubmit function
const handleSubmit = async (event) => {
    try {
        const formData = new FormData(event.target);
        const clientData = Object.fromEntries(formData.entries());
        
        await addClient(clientData);
        
        // Reset form and close modal on success
        event.target.reset();
        store.closeModal();
        
        // Refresh client list
        const res = await axios.get('https://uzanet.duckdns.org/ppp_users');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data

    } catch (error) {
        console.error('Failed to submit form:', error);
        // Handle form submission error (you could add error messaging here)
    }
};

onMounted(async () => {
    store.setLoading(true);
    try {
        const res = await axios.get('https://uzanet.duckdns.org/ppp_users');
        data.value = res.data;
        store.filteredData = res.data; // Initialize filtered data

        console.log(data.value);
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
    <div class="content">
        <Search :clicked="store.openModal" :list="data" :search-keys="columns" @updateFilteredList="store.handleFilteredListUpdate"/>

        <!-- Add Client Modal -->
        <div v-show="store.showModal" id="add-client-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" @click="store.closeModal">&times;</span>
                <h3>Add New Client</h3>
                <form id="add-client-form" @submit.prevent="handleSubmit">
                    <!-- PPPoE Username -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pppoe_username">PPPoE Username*</label>
                            <input type="text" id="pppoe_username" name="pppoe_username" placeholder="user1234" required>
                        </div>
                        <div class="form-group">
                            <label for="name">Name*</label>
                            <input type="text" id="name" name="name" placeholder="E.g Ibrahim Swaleh" required>
                        </div>
                    </div>

                    <!-- Email and Phone -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email (Optional)</label>
                            <input type="email" id="email" name="email" placeholder="client@email.com">
                        </div>
                        <div class="form-group">
                            <label for="mobile_number">Phone*</label>
                            <input type="text" id="mobile_number" name="mobile_number" placeholder="0712345678" required>
                        </div>
                    </div>

                    <!-- Location and Apartment Block -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="location">Location (Optional)</label>
                            <input type="text" id="location" name="location" placeholder="Mtwapa Creek">
                        </div>
                        <div class="form-group">
                            <label for="apartment">Apartment Block (Optional)</label>
                            <input type="text" id="apartment" name="apartment" placeholder="Block C">
                        </div>
                    </div>

                    <!-- Profile/Plan and PPPoE Password -->
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
                            <label for="pppoe_password">PPPoE Password*</label>
                            <input type="password" id="pppoe_password" name="pppoe_password" placeholder="user1234" required>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="submit-button">Add Client</button>
                </form>
            </div>
        </div>
        <CustomLoader v-if="store.isLoading" />
        <Table title="Client Details" :columns="columns" :rows="rows" v-else></Table>
    </div>
</template>