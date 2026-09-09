<script setup>
import { computed, onMounted, ref } from 'vue';
import { beginRouterOnboarding, errorMessage, fetchRouterStatuses, fetchRouters, removeRouter, updateRouter } from '@/lib/api';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const data = ref([]);
const filtered = ref([]);
const error = ref('');
const onboarding = ref({ name: '', portal_slug: '', payment_provider: 'mpesa', replace_managed_tunnel: false });
const onboardingResult = ref(null);
const showResult = ref(false);
const showEditModal = ref(false);
const editingUid = ref(null);
const editData = ref({ name: '', ip_address: '', port: 8728, username: '', password: '', portal_slug: '', portal_enabled: true, payment_provider: 'mpesa' });
const showDeleteConfirm = ref(false);
const deletingRouter = ref(null);

const columns = ['name', 'ip_address', 'portal_slug', 'connection_mode', 'onboarding_status', 'payment_provider', 'online', 'routeros_version', 'last_seen_at'];
const rows = computed(() => filtered.value);

const loadRouters = async () => {
    store.setLoading(true);
    error.value = '';
    try {
        const routers = await fetchRouters();
        data.value = routers.map((item) => ({ ...item, online: null }));
        filtered.value = data.value;
        try {
            const status = await fetchRouterStatuses();
            const byUid = new Map(status.routers.map((item) => [item.router_uid, item]));
            data.value = routers.map((item) => ({ ...item, online: byUid.get(item.uid)?.status === 'online' }));
            filtered.value = data.value;
        } catch (statusError) {
            error.value = errorMessage(statusError, 'Routers loaded, but live status is unavailable.');
        }
        await store.loadRouters({ force: true });
    } catch (loadError) {
        error.value = errorMessage(loadError, 'Unable to load routers.');
    } finally {
        store.setLoading(false);
    }
};

onMounted(loadRouters);

const startOnboarding = async () => {
    error.value = '';
    copyMessage.value = '';
    store.setLoading(true);
    try {
        onboardingResult.value = await beginRouterOnboarding(onboarding.value);
        store.closeModal();
        showResult.value = true;
        onboarding.value = { name: '', portal_slug: '', payment_provider: 'mpesa', replace_managed_tunnel: false };
        await loadRouters();
    } catch (submitError) {
        error.value = errorMessage(submitError, 'Unable to start router onboarding.');
    } finally {
        store.setLoading(false);
    }
};

const copyMessage = ref('');
const copyText = async (value) => {
    try { await navigator.clipboard.writeText(value || ''); copyMessage.value = 'Copied.'; }
    catch { copyMessage.value = 'Copy unavailable. Select and copy the text below.'; }
};
const copyScript = () => copyText(onboardingResult.value?.script);
const copyCommand = () => copyText(onboardingResult.value?.install_command);
const downloadScript = () => {
    const blob = new Blob([onboardingResult.value?.script || ''], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `uzanet-${onboardingResult.value?.router?.portal_slug || 'router'}.rsc`;
    link.click();
    URL.revokeObjectURL(link.href);
};

const handleEditRequest = (row) => {
    editingUid.value = row.uid;
    editData.value = {
        name: row.name,
        ip_address: row.ip_address,
        port: row.port,
        username: row.username,
        password: '',
        portal_slug: row.portal_slug,
        portal_enabled: row.portal_enabled,
        payment_provider: row.payment_provider,
    };
    showEditModal.value = true;
};

const saveEdit = async () => {
    const payload = { ...editData.value };
    if (!payload.password) delete payload.password;
    try {
        await updateRouter(editingUid.value, payload);
        showEditModal.value = false;
        await loadRouters();
    } catch (saveError) {
        error.value = errorMessage(saveError, 'Unable to update router.');
    }
};

const confirmDelete = async () => {
    try {
        await removeRouter(deletingRouter.value.uid);
        showDeleteConfirm.value = false;
        deletingRouter.value = null;
        await loadRouters();
    } catch (deleteError) {
        error.value = errorMessage(deleteError, 'Unable to delete router.');
    }
};
</script>

<template>
    <div class="content">
        <Search :clicked="store.openModal" :list="data" :search-keys="columns" title="Onboard Router" @updateFilteredList="filtered = $event" />
        <button v-if="onboardingResult" class="submit-button" type="button" @click="showResult = true">Reopen last onboarding bundle</button>
        <p v-if="error" class="neo-error">{{ error }}</p>

        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">Onboard Router</h3>
            <p>The generated script backs up the router and adds only Uzanet-managed L2TP/API objects.</p>
            <form @submit.prevent="startOnboarding">
                <div class="form-group"><label>Router name*</label><input v-model="onboarding.name" required minlength="2" /></div>
                <div class="form-group"><label>Portal slug*</label><input v-model="onboarding.portal_slug" required pattern="[a-z0-9][a-z0-9-]+[a-z0-9]" placeholder="town-branch" /></div>
                <div class="form-group"><label>Payment provider*</label><select v-model="onboarding.payment_provider"><option value="mpesa">M-Pesa Direct</option><option value="kopokopo">Kopo Kopo</option></select></div>
                <label><input v-model="onboarding.replace_managed_tunnel" type="checkbox" /> Replace an existing UzaNet-managed tunnel on this router (disconnects its previous UzaNet record).</label>
                <button type="submit" class="submit-button" :disabled="store.isLoading">Generate setup command</button>
            </form>
        </Modal>

        <Modal :show="showResult" @close="showResult = false">
            <h3 class="neo-modal-heading">One-time onboarding bundle</h3>
            <p v-if="onboardingResult?.l2tp_peer?.provisioned"><strong>1.</strong> The L2TP peer was created automatically with tunnel address <code>{{ onboardingResult?.l2tp_peer?.ip_address }}</code>.</p>
            <p v-else><strong>1.</strong> Create this L2TP peer on the control server before running the script.</p>
            <p><code>{{ onboardingResult?.l2tp_peer?.username }}</code></p>
            <p><code>{{ onboardingResult?.l2tp_peer?.password }}</code></p>
            <p><strong>2.</strong> Import the script in RouterOS before {{ onboardingResult?.expires_at }}.</p>
            <template v-if="onboardingResult?.install_command">
                <p>Paste this whole command into the router terminal. It downloads over HTTPS, imports the script, then removes the downloaded file.</p>
                <textarea class="script-output" aria-label="Router setup command" readonly :value="onboardingResult.install_command"></textarea>
                <button class="submit-button" @click="copyCommand">Copy setup command</button>
                <p>The download works once. Save the fallback RSC before closing; use it if the download or import is interrupted. The router needs a correct clock and trusted HTTPS certificates.</p>
            </template>
            <p role="status">{{ copyMessage }}</p>
            <details><summary>Manual RSC fallback</summary><textarea class="script-output" aria-label="Router setup script" readonly :value="onboardingResult?.script"></textarea></details>
            <div class="action-row"><button class="submit-button" @click="copyScript">Copy RSC</button><button class="submit-button" @click="downloadScript">Download .rsc</button></div>
            <p>The script saves a configuration backup. Existing hotspot HTML files are not replaced; update their redirect separately and check router status after setup.</p>
            <p>These peer credentials and the claim token are shown only in this response. Store them in your VPN/RADIUS secret manager.</p>
        </Modal>

        <Modal :show="showEditModal" @close="showEditModal = false">
            <h3 class="neo-modal-heading">Edit Router</h3>
            <form @submit.prevent="saveEdit">
                <div class="form-row"><div class="form-group"><label>Name*</label><input v-model="editData.name" required /></div><div class="form-group"><label>Control IP*</label><input v-model="editData.ip_address" required /></div></div>
                <div class="form-row"><div class="form-group"><label>API port*</label><input v-model.number="editData.port" type="number" min="1" max="65535" required /></div><div class="form-group"><label>API username*</label><input v-model="editData.username" required /></div></div>
                <div class="form-row"><div class="form-group"><label>New password (optional)</label><input v-model="editData.password" type="password" minlength="8" /></div><div class="form-group"><label>Portal slug*</label><input v-model="editData.portal_slug" required /></div></div>
                <div class="form-row"><div class="form-group"><label>Provider</label><select v-model="editData.payment_provider"><option value="mpesa">M-Pesa</option><option value="kopokopo">Kopo Kopo</option></select></div><label><input v-model="editData.portal_enabled" type="checkbox" /> Public portal enabled</label></div>
                <button class="submit-button" type="submit">Save changes</button>
            </form>
        </Modal>

        <Modal :show="showDeleteConfirm" @close="showDeleteConfirm = false">
            <h3 class="neo-modal-heading">Delete Router</h3>
            <p>Delete <strong>{{ deletingRouter?.name }}</strong>? Routers with packages must be retired first.</p>
            <div class="action-row"><button class="submit-button danger" @click="confirmDelete">Delete</button><button class="submit-button" @click="showDeleteConfirm = false">Cancel</button></div>
        </Modal>

        <CustomLoader v-if="store.isLoading" />
        <Table v-else title="Routers" :columns="columns" :rows="rows" :enable-actions="true" @edit="handleEditRequest" @delete="deletingRouter = $event; showDeleteConfirm = true" />
    </div>
</template>

<style scoped>
.script-output { width: 100%; min-height: 18rem; margin: 1rem 0; padding: .75rem; font-family: monospace; }
.action-row { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1rem; }
.neo-error { padding: .75rem; border: 2px solid #dc2626; color: #b91c1c; font-weight: 700; }
.danger { background: #dc2626; color: white; }
code { overflow-wrap: anywhere; }
</style>
