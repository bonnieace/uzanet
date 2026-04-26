<script setup>
import { ref, onMounted, computed } from 'vue';
import Table from '@/components/Table.vue';
import api from '@/lib/api';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import { useMainStore } from '@/stores/store';
import CustomLoader from '@/components/customLoader.vue';

const store = useMainStore();
const data = ref([]);

async function addClient(clientData) {
    try {
        const queryString = new URLSearchParams(clientData).toString();
        const response = await api.post(`/ppp_user?${queryString}`, null, {
            headers: { 'Accept': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding client:', error.response?.data || error.message);
        throw error;
    }
}

const handleSubmit = async (event) => {
    try {
        const formData = new FormData(event.target);
        const clientData = Object.fromEntries(formData.entries());
        await addClient(clientData);
        event.target.reset();
        store.closeModal();
        const res = await api.get('/ppp_users');
        data.value = res.data;
        store.filteredData = res.data;
    } catch (error) {
        console.error('Failed to submit form:', error);
    }
};

onMounted(async () => {
    store.setLoading(true);
    try {
        const res = await api.get('/ppp_users');
        data.value = res.data;
        store.filteredData = res.data;
    } catch (error) {
        console.log(error);
    } finally {
        store.setLoading(false);
    }
});

const columns = computed(() => data.value.length ? Object.keys(data.value[0]) : []);
const rows = computed(() => store.filteredData);
</script>

<template>
    <div class="content">
        <Search :clicked="store.openModal" :list="data" :search-keys="columns" @updateFilteredList="store.handleFilteredListUpdate" />

        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">Add New PPPoE Client</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-row">
                    <div class="form-group">
                        <label for="pppoe_username">PPPoE Username*</label>
                        <input type="text" id="pppoe_username" name="pppoe_username" placeholder="user1234" required>
                    </div>
                    <div class="form-group">
                        <label for="name">Full Name*</label>
                        <input type="text" id="name" name="name" placeholder="Ibrahim Swaleh" required>
                    </div>
                </div>
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
                <div class="form-row">
                    <div class="form-group">
                        <label for="profile">Profile / Plan*</label>
                        <select id="profile" name="profile" required>
                            <option value="10 Mbps">10 Mbps</option>
                            <option value="20 Mbps">20 Mbps</option>
                            <option value="50 Mbps">50 Mbps</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="pppoe_password">PPPoE Password*</label>
                        <input type="password" id="pppoe_password" name="pppoe_password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" required>
                    </div>
                </div>
                <button type="submit" class="submit-button">Add Client</button>
            </form>
        </Modal>

        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="PPPoE Clients" :columns="columns" :rows="rows" />
    </div>
</template>
