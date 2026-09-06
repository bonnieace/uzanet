<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { addPppUser, errorMessage, fetchPackages, fetchPppUsers, removePppUser, setPppUserEnabled } from '@/lib/api';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const data = ref([]);
const filtered = ref([]);
const packages = ref([]);
const error = ref('');
const selectedRouterId = computed(() => store.selectedRouterId);
const columns = ['name', 'pppoe_username', 'mobile_number', 'profile', 'is_active', 'expires_on', 'location', 'apartment'];
const rows = computed(() => filtered.value);
const blankClient = () => ({ name: '', email: '', pppoe_username: '', pppoe_password: '', mobile_number: '', location: '', apartment: '', package_uid: '' });
const client = ref(blankClient());

const load = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        const [users, allPackages] = await Promise.all([fetchPppUsers(selectedRouterId.value), fetchPackages(selectedRouterId.value)]);
        data.value = users;
        filtered.value = users;
        packages.value = allPackages.filter((item) => item.service_type === 'pppoe' && item.is_active);
        if (!client.value.package_uid) client.value.package_uid = packages.value[0]?.uid || '';
    } catch (loadError) { error.value = errorMessage(loadError, 'Unable to load PPPoE customers.'); }
    finally { store.setLoading(false); }
};
watch(selectedRouterId, load);
watch(() => store.routerRefreshKey, load);
onMounted(async () => { await store.loadRouters(); await load(); });

const save = async () => {
    const payload = { ...client.value, email: client.value.email || null, location: client.value.location || null, apartment: client.value.apartment || null };
    try {
        await addPppUser(selectedRouterId.value, payload);
        client.value = blankClient();
        store.closeModal();
        await load();
    } catch (saveError) { error.value = errorMessage(saveError, 'Unable to create PPPoE customer.'); }
};
const toggle = async (row) => {
    try { await setPppUserEnabled(selectedRouterId.value, row.uid, !row.is_active); await load(); }
    catch (toggleError) { error.value = errorMessage(toggleError, 'Unable to change customer access.'); }
};
const remove = async (row) => {
    if (!window.confirm(`Delete PPPoE customer ${row.pppoe_username}?`)) return;
    try { await removePppUser(selectedRouterId.value, row.uid); await load(); }
    catch (removeError) { error.value = errorMessage(removeError, 'Unable to delete PPPoE customer.'); }
};
</script>

<template>
    <div class="content">
        <Search :clicked="store.openModal" :list="data" :search-keys="columns" title="Add PPPoE Client" @updateFilteredList="filtered = $event" />
        <p v-if="error" class="form-error">{{ error }}</p>
        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">Add PPPoE Client</h3>
            <p v-if="!packages.length">Create an active PPPoE plan before adding a customer.</p>
            <form @submit.prevent="save">
                <div class="form-row"><div class="form-group"><label>Full name*</label><input v-model="client.name" required /></div><div class="form-group"><label>Phone*</label><input v-model="client.mobile_number" required /></div></div>
                <div class="form-row"><div class="form-group"><label>PPPoE username*</label><input v-model="client.pppoe_username" required minlength="3" /></div><div class="form-group"><label>PPPoE password*</label><input v-model="client.pppoe_password" type="password" required minlength="8" /></div></div>
                <div class="form-row"><div class="form-group"><label>Plan*</label><select v-model="client.package_uid" required><option disabled value="">Select plan</option><option v-for="plan in packages" :key="plan.uid" :value="plan.uid">{{ plan.name }} — KES {{ plan.price }}</option></select></div><div class="form-group"><label>Email</label><input v-model="client.email" type="email" /></div></div>
                <div class="form-row"><div class="form-group"><label>Location</label><input v-model="client.location" /></div><div class="form-group"><label>Apartment</label><input v-model="client.apartment" /></div></div>
                <button class="submit-button" type="submit" :disabled="!packages.length">Add Client</button>
            </form>
        </Modal>
        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="PPPoE Clients" :columns="columns" :rows="rows" :enable-actions="true" edit-label="Enable / Disable" delete-label="Delete" @edit="toggle" @delete="remove" />
    </div>
</template>
