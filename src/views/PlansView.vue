<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { addPackage, errorMessage, fetchPackages, retirePackage, updatePackage } from '@/lib/api';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const data = ref([]);
const filtered = ref([]);
const error = ref('');
const editingUid = ref(null);
const selectedRouterId = computed(() => store.selectedRouterId);
const columns = ['name', 'description', 'price', 'service_type', 'validity_minutes', 'router_profile', 'rate_limit', 'is_active'];
const rows = computed(() => filtered.value);
const blankPlan = () => ({ name: '', description: '', price: '', service_type: 'hotspot', validity_minutes: 60, router_profile: 'default', rate_limit: '', is_active: true });
const planData = ref(blankPlan());

const loadPackages = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    try {
        data.value = await fetchPackages(selectedRouterId.value);
        filtered.value = data.value;
    } catch (loadError) {
        error.value = errorMessage(loadError, 'Unable to load packages.');
    } finally { store.setLoading(false); }
};

watch(selectedRouterId, loadPackages);
watch(() => store.routerRefreshKey, loadPackages);
onMounted(async () => { await store.loadRouters(); await loadPackages(); });

const openCreate = () => { editingUid.value = null; planData.value = blankPlan(); store.openModal(); };
const openEdit = (row) => { editingUid.value = row.uid; planData.value = { ...row, price: Number(row.price), rate_limit: row.rate_limit || '' }; store.openModal(); };
const save = async () => {
    const payload = { ...planData.value, price: Number(planData.value.price), validity_minutes: Number(planData.value.validity_minutes), rate_limit: planData.value.rate_limit || null };
    delete payload.uid; delete payload.created_at; delete payload.updated_at;
    try {
        if (editingUid.value) {
            delete payload.service_type;
            await updatePackage(selectedRouterId.value, editingUid.value, payload);
        } else await addPackage(selectedRouterId.value, payload);
        store.closeModal();
        await loadPackages();
    } catch (saveError) { error.value = errorMessage(saveError, 'Unable to save package.'); }
};
const retire = async (row) => {
    if (!window.confirm(`Retire ${row.name}? Existing payment records are preserved.`)) return;
    try { await retirePackage(selectedRouterId.value, row.uid); await loadPackages(); }
    catch (retireError) { error.value = errorMessage(retireError, 'Unable to retire package.'); }
};
</script>

<template>
    <div class="content">
        <Search :clicked="openCreate" :list="data" :search-keys="columns" title="Add Plan" @updateFilteredList="filtered = $event" />
        <p v-if="error" class="form-error">{{ error }}</p>
        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">{{ editingUid ? 'Edit' : 'Add' }} Plan</h3>
            <form @submit.prevent="save">
                <div class="form-row"><div class="form-group"><label>Name*</label><input v-model="planData.name" required /></div><div class="form-group"><label>Price (KES)*</label><input v-model.number="planData.price" type="number" min="1" step="0.01" required /></div></div>
                <div class="form-group"><label>Description</label><input v-model="planData.description" /></div>
                <div class="form-row"><div class="form-group"><label>Service*</label><select v-model="planData.service_type" :disabled="Boolean(editingUid)"><option value="hotspot">Hotspot</option><option value="pppoe">PPPoE</option></select></div><div class="form-group"><label>Validity (minutes)*</label><input v-model.number="planData.validity_minutes" type="number" min="1" max="525600" required /></div></div>
                <div class="form-row"><div class="form-group"><label>RouterOS profile*</label><input v-model="planData.router_profile" required /></div><div class="form-group"><label>Rate label</label><input v-model="planData.rate_limit" placeholder="10M/10M" /></div></div>
                <label><input v-model="planData.is_active" type="checkbox" /> Available for purchase</label>
                <button class="submit-button" type="submit">Save Plan</button>
            </form>
        </Modal>
        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="Plans" :columns="columns" :rows="rows" :enable-actions="true" @edit="openEdit" @delete="retire" />
    </div>
</template>
