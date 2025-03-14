<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';

const data = ref([]);
const showModal = ref(false);

// Form data state
const clientData = ref({
    otp: '',
    phone_number: '',
    amount: ''
});

onMounted(async () => {
    console.log(showModal.value);
    try {
        const res = await axios.get('https://uzanet.duckdns.org/hotspot_users');
        data.value = res.data;
        console.log(data.value);
    } catch (error) {
        console.error('Error fetching hotspot users:', error);
    }
});

const columns = computed(() => {
    if (data.value && data.value.length > 0) {
        return Object.keys(data.value[0]);
    }
    return [];
});

const rows = computed(() => data.value);

const openModal = () => {
    console.log('CLICKED');
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

// Function to submit form data
const handleSubmit = async () => {
    try {
        console.log(clientData.value);
        // Convert client data to query parameters
        const queryString = new URLSearchParams(clientData.value).toString();
        console.log(queryString);

        // Make the request
        const response = await axios.post(`https://uzanet.duckdns.org/hotspot_user?${queryString}`, null, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('✅ Client added successfully:', response.data);

        // Refresh data after successful submission
        const res = await axios.get('https://uzanet.duckdns.org/hotspot_users');
        data.value = res.data;

        // Close modal and reset form
        closeModal();
        clientData.value = { otp: '', phone_number: '', amount: '' };
    } catch (error) {
        console.error('❌ Error adding client:', error.response?.data || error.message);
    }
};
</script>

<template>
    <div class="content">
        <Search :clicked="openModal" />

        <!-- Add Client Modal -->
        <div v-show="showModal" id="add-client-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" @click="closeModal">&times;</span>
                <h3>Add New Client</h3>
                <form id="add-client-form" @submit.prevent="handleSubmit">
                    <!-- OTP Field -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="otp">OTP*</label>
                            <input type="text" id="otp" v-model="clientData.otp" placeholder="user1234" required>
                        </div>
                    </div>

                    <!-- Phone Number -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone_number">Phone Number*</label>
                            <input type="text" id="phone_number" v-model="clientData.phone_number" placeholder="0712345678" required>
                        </div>
                    </div>

                    <!-- Amount -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="amount">Amount*</label>
                            <input type="text" id="amount" v-model="clientData.amount" placeholder="10,50,300,1000" required>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="submit-button">Add Client</button>
                </form>
            </div>
        </div>

        <!-- Content Area -->
        <div class="tables">
            <Table title="Client details" :columns="columns" :rows="rows"></Table>
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
       