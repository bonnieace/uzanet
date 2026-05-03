<script setup>
import api from '@/lib/api';
import { onMounted, ref, computed } from 'vue';
import Table from '@/components/Table.vue';
import Search from '@/components/search.vue';
import Modal from '@/components/Modal.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const data = ref([]);

const showEditModal = ref(false);
const editingId = ref(null);
const showDeleteConfirm = ref(false);
const deletingRouter = ref(null);

const routerData = ref({
    name: '',
    ip_address: '',
    port: 8728,
    username: '',
    password: '',
});

const editData = ref({
    name: '',
    ip_address: '',
    port: 8728,
    username: '',
    password: '',
});

const loadRouters = async () => {
    store.setLoading(true);
    try {
        const res = await api.get('/routers');

        // Create an initial router list without waiting for ping results
        const routerStatusPending = (res.data || []).map((router) => ({
            ...router,
            online: null,
            latency_ms: null,
        }));

        data.value = routerStatusPending;
        store.filteredData = routerStatusPending;

        // Fire-and-forget ping call — update statuses when ping responds
        (async () => {
            try {
                const pingResponse = await api.get('/routers/ping');
                const pingRouters = pingResponse.data?.routers || [];
                const pingById = new Map(pingRouters.map((r) => [r.id, r]));

                const routerStatus = (res.data || []).map((router) => {
                    const pingResult = pingById.get(router.id) || {};

                    return {
                        ...router,
                        online: pingResult.online ?? false,
                        latency_ms: pingResult.latency_ms ?? null,
                    };
                });

                data.value = routerStatus;
                store.filteredData = routerStatus;
            } catch (pingError) {
                console.error('Error fetching router ping results:', pingError);
            }
        })();

    } catch (error) {
        console.error('Error fetching routers:', error);
    } finally {
        store.setLoading(false);
    }
};

onMounted(loadRouters);

const columns = computed(() => {
    if (!data.value.length) return [];

    const keys = Object.keys(data.value[0]);
    const orderedKeys = keys.filter((key) => !['id', 'port', 'created_at', 'online', 'updated_at'].includes(key));

    if (keys.includes('online')) {
        orderedKeys.push('online');
    }

    if (keys.includes('updated_at')) {
        orderedKeys.push('updated_at');
    }

    return orderedKeys;
});
const rows = computed(() => store.filteredData);

const handleFilteredListUpdate = (list) => {
    store.filteredData = list;
};

const handleSubmit = async () => {
    try {
        const queryString = new URLSearchParams(routerData.value).toString();
        await api.post(`/router?${queryString}`, null, {
            headers: { Accept: 'application/json' },
        });

        await loadRouters();
        store.closeModal();
        routerData.value = {
            name: '',
            ip_address: '',
            port: 8728,
            username: '',
            password: '',
        };
    } catch (error) {
        console.error('Error adding router:', error.response?.data || error.message);
    }
};

const handleEditRequest = (row) => {
    editingId.value = row.id;
    editData.value = {
        name: row.name ?? '',
        ip_address: row.ip_address ?? '',
        port: row.port ?? 8728,
        username: row.username ?? '',
        password: '',
    };
    showEditModal.value = true;
};

const handleEditSubmit = async () => {
    try {
        const queryString = new URLSearchParams(editData.value).toString();
        await api.put(`/router/${editingId.value}?${queryString}`, null, {
            headers: { Accept: 'application/json' },
        });
        await loadRouters();
        showEditModal.value = false;
        editingId.value = null;
    } catch (error) {
        console.error('Error updating router:', error.response?.data || error.message);
    }
};

const handleDeleteRequest = (row) => {
    deletingRouter.value = row;
    showDeleteConfirm.value = true;
};

const handleDeleteConfirm = async () => {
    try {
        await api.delete(`/router/${deletingRouter.value.id}`);
        await loadRouters();
        showDeleteConfirm.value = false;
        deletingRouter.value = null;
    } catch (error) {
        console.error('Error deleting router:', error.response?.data || error.message);
    }
};
</script>

<template>
    <div class="content">
        <Search
            :clicked="store.openModal"
            :list="data"
            :search-keys="columns"
            title="Add Router"
            @updateFilteredList="handleFilteredListUpdate"
        />

        <Modal :show="store.showModal" @close="store.closeModal">
            <h3 class="neo-modal-heading">Add Router</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Router Name*</label>
                        <input id="name" v-model="routerData.name" type="text" placeholder="matangi" required>
                    </div>
                    <div class="form-group">
                        <label for="ip_address">IP Address*</label>
                        <input id="ip_address" v-model="routerData.ip_address" type="text" placeholder="10.10.1.2" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="port">Port*</label>
                        <input id="port" v-model.number="routerData.port" type="number" placeholder="8728" required>
                    </div>
                    <div class="form-group">
                        <label for="username">Username*</label>
                        <input id="username" v-model="routerData.username" type="text" placeholder="admin" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="password">Password*</label>
                        <input id="password" v-model="routerData.password" type="password" placeholder="••••••••" required>
                    </div>
                </div>
                <button type="submit" class="submit-button">Add Router</button>
            </form>
        </Modal>

        <!-- Edit Modal -->
        <Modal :show="showEditModal" @close="showEditModal = false">
            <h3 class="neo-modal-heading">Edit Router</h3>
            <form @submit.prevent="handleEditSubmit">
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-name">Router Name*</label>
                        <input id="edit-name" v-model="editData.name" type="text" placeholder="matangi" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-ip_address">IP Address*</label>
                        <input id="edit-ip_address" v-model="editData.ip_address" type="text" placeholder="10.10.1.2" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-port">Port*</label>
                        <input id="edit-port" v-model.number="editData.port" type="number" placeholder="8728" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-username">Username*</label>
                        <input id="edit-username" v-model="editData.username" type="text" placeholder="admin" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-password">Password <span style="font-weight:500;font-size:0.8em;">(leave blank to keep current)</span></label>
                        <input id="edit-password" v-model="editData.password" type="password" placeholder="••••••••">
                    </div>
                </div>
                <button type="submit" class="submit-button">Save Changes</button>
            </form>
        </Modal>

        <!-- Delete Confirmation Modal -->
        <Modal :show="showDeleteConfirm" @close="showDeleteConfirm = false">
            <h3 class="neo-modal-heading">Delete Router</h3>
            <p style="margin: 1rem 0;">
                Are you sure you want to delete
                <strong>{{ deletingRouter?.name }}</strong>
                (<code>{{ deletingRouter?.ip_address }}</code>)?
                This action cannot be undone.
            </p>
            <div style="display:flex;gap:0.75rem;margin-top:1.5rem;">
                <button type="button" class="submit-button" style="background:#dc2626;border-color:#dc2626;" @click="handleDeleteConfirm">Delete</button>
                <button type="button" class="submit-button" style="background:var(--muted);color:var(--foreground);" @click="showDeleteConfirm = false">Cancel</button>
            </div>
        </Modal>

        <CustomLoader v-if="store.isLoading" />
        <Table
            v-else
            title="Routers"
            :columns="columns"
            :rows="rows"
            :enable-actions="true"
            @edit="handleEditRequest"
            @delete="handleDeleteRequest"
        />
    </div>
</template>