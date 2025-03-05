<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Table from '@/components/Table.vue';
import { computed } from 'vue';
import Search from '@/components/search.vue';

const data = ref('');
const showModal = ref(false);

onMounted(async () => {
    console.log(showModal.value)
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

const rows = computed(() => {
    return data.value;
});

const openModal = () => {
    console.log('CLICKED')
    
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const addClient = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const clientData = Object.fromEntries(formData.entries());

    try {
        const res = await axios.post('https://uzanet.duckdns.org/ppp_user', clientData);
        console.log('Client added:', res.data);
        // Optionally, refresh the data or update the table
        showModal.value = false;
    } catch (error) {
        console.error('Error adding client:', error);
    }
};
</script>

<template>
    <div class="content">
        <Search :onClick="openModal"/>

        <!-- Add Client Modal -->
        <div v-show="showModal" id="add-client-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal" @click="closeModal">&times;</span>
                <h3>Add New Client</h3>
                <form id="add-client-form" @submit="addClient">
                    <!-- PPPoE Username -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pppoe-username">PPPoE Username*</label>
                            <input type="text" id="pppoe-username" name="pppoe-username" placeholder="user1234" required>
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
                            <label for="phone">Phone*</label>
                            <input type="text" id="phone" name="phone" placeholder="0712345678" required>
                        </div>
                    </div>

                    <!-- Location and Apartment Block -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="location">Location (Optional)</label>
                            <input type="text" id="location" name="location" placeholder="Mtwapa Creek">
                        </div>
                        <div class="form-group">
                            <label for="apartment-block">Apartment Block (Optional)</label>
                            <input type="text" id="apartment-block" name="apartment-block" placeholder="Block C">
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
                            <label for="pppoe-password">PPPoE Password*</label>
                            <input type="password" id="pppoe-password" name="pppoe-password" placeholder="user1234" required>
                        </div>
                    </div>

                    <!-- Coordinates and House -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="coordinates">Coordinates (Optional)</label>
                            <input type="text" id="coordinates" name="coordinates" placeholder="-3.5000,35.4000">
                        </div>
                        <div class="form-group">
                            <label for="house">House (Optional)</label>
                            <input type="text" id="house" name="house" placeholder="C8">
                        </div>
                    </div>

                    <!-- Expiry Date -->
                    <div class="form-group">
                        <label for="expiry">Select Expiry Date (Recommended)</label>
                        <input type="date" id="expiry" name="expiry" required>
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