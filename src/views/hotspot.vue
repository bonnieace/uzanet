<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { addHotspotUser, errorMessage, fetchHotspotUsers, fetchPackages, removeHotspotUser, setHotspotUserEnabled } from '@/lib/api';
import Table from '@/components/Table.vue';
import Modal from '@/components/Modal.vue';
import Search from '@/components/search.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const data = ref([]);
const filtered = ref([]);
const packages = ref([]);
const error = ref('');
const issuedCredentials = ref(null);
const selectedRouterId = computed(() => store.selectedRouterId);
const columns = ['username', 'phone_number', 'is_active', 'expires_at', 'created_at'];
const rows = computed(() => filtered.value);
const blankClient = () => ({ username: '', password: '', phone_number: '', package_uid: '' });
const client = ref(blankClient());

const load = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        const [users, allPackages] = await Promise.all([fetchHotspotUsers(selectedRouterId.value), fetchPackages(selectedRouterId.value)]);
        data.value = users;
        filtered.value = users;
        packages.value = allPackages.filter((item) => item.service_type === 'hotspot' && item.is_active);
        if (!client.value.package_uid) client.value.package_uid = packages.value[0]?.uid || '';
    } catch (loadError) { error.value = errorMessage(loadError, 'Unable to load hotspot customers.'); }
    finally { store.setLoading(false); }
};
watch(selectedRouterId, load);
watch(() => store.routerRefreshKey, load);
onMounted(async () => { await store.loadRouters(); await load(); });

const save = async () => {
    const payload = { phone_number: client.value.phone_number, package_uid: client.value.package_uid };
    if (client.value.username) payload.username = client.value.username;
    if (client.value.password) payload.password = client.value.password;
    try {
        const result = await addHotspotUser(selectedRouterId.value, payload);
        issuedCredentials.value = result.credentials;
        client.value = blankClient();
        await load();
    } catch (saveError) { error.value = errorMessage(saveError, 'Unable to create hotspot customer.'); }
};
const closeCreate = () => { issuedCredentials.value = null; store.closeModal(); };
const toggle = async (row) => {
    try { await setHotspotUserEnabled(selectedRouterId.value, row.uid, !row.is_active); await load(); }
    catch (toggleError) { error.value = errorMessage(toggleError, 'Unable to change customer access.'); }
};
const remove = async (row) => {
    if (!window.confirm(`Delete hotspot customer ${row.username}?`)) return;
    try { await removeHotspotUser(selectedRouterId.value, row.uid); await load(); }
    catch (removeError) { error.value = errorMessage(removeError, 'Unable to delete hotspot customer.'); }
};
</script>

<template>
    <div class="content">
        <Search :clicked="store.openModal" :list="data" :search-keys="columns" title="Add Hotspot Client" @updateFilteredList="filtered = $event" />
        <p v-if="error" class="form-error">{{ error }}</p>
        <Modal :show="store.showModal" @close="closeCreate">
            <h3 class="neo-modal-heading">Add Hotspot Client</h3>
            <div v-if="issuedCredentials">
                <p>Credentials are shown once. Give them to the customer securely.</p>
                <p><strong>Username:</strong> <code>{{ issuedCredentials.username }}</code></p>
                <p><strong>Password:</strong> <code>{{ issuedCredentials.password }}</code></p>
                <button class="submit-button" @click="closeCreate">Done</button>
            </div>
            <form v-else @submit.prevent="save">
                <p v-if="!packages.length">Create an active hotspot plan before adding a customer.</p>
                <div class="form-group"><label>Phone*</label><input v-model="client.phone_number" required /></div>
                <div class="form-group"><label>Plan*</label><select v-model="client.package_uid" required><option disabled value="">Select plan</option><option v-for="plan in packages" :key="plan.uid" :value="plan.uid">{{ plan.name }} — KES {{ plan.price }}</option></select></div>
                <div class="form-row"><div class="form-group"><label>Username (auto if blank)</label><input v-model="client.username" minlength="4" /></div><div class="form-group"><label>Password (auto if blank)</label><input v-model="client.password" type="password" minlength="8" /></div></div>
                <button class="submit-button" type="submit" :disabled="!packages.length">Add Client</button>
            </form>
        </Modal>
        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="Hotspot Clients" :columns="columns" :rows="rows" :enable-actions="true" edit-label="Enable / Disable" @edit="toggle" @delete="remove" />
    </div>
</template>
