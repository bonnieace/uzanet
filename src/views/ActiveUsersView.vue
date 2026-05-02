<script setup>
import api, { fetchActiveHotspotUsers, fetchActivePppoeUsers } from '@/lib/api';
import { ref, computed, onMounted, watch } from 'vue';
import { RefreshCw, Wifi, Users } from 'lucide-vue-next';
import { useMainStore } from '@/stores/store';
import CustomLoader from '@/components/customLoader.vue';

const store = useMainStore();

// ── Router selection ─────────────────────────────────────────────
const routers = ref([]);
const routersLoading = ref(false);

const selectedRouterId = computed({
    get: () => store.selectedRouterId,
    set: (val) => store.setSelectedRouterId(val),
});

const loadRouters = async () => {
    routersLoading.value = true;
    try {
        const res = await api.get('/routers');
        routers.value = res.data || [];
        // Auto-select first router if none chosen yet
        if (!selectedRouterId.value && routers.value.length) {
            store.setSelectedRouterId(routers.value[0].id);
        }
    } catch (e) {
        console.error('Failed to load routers:', e);
    } finally {
        routersLoading.value = false;
    }
};

// ── Tabs ─────────────────────────────────────────────────────────
const activeTab = ref('hotspot'); // 'hotspot' | 'pppoe'

// ── Active user data ─────────────────────────────────────────────
const hotspotData = ref(null);   // full response object
const pppoeData = ref(null);

const hotspotLoading = ref(false);
const pppoeLoading = ref(false);

const hotspotError = ref('');
const pppoeError = ref('');

const loadHotspot = async () => {
    if (!selectedRouterId.value) return;
    hotspotLoading.value = true;
    hotspotError.value = '';
    try {
        hotspotData.value = await fetchActiveHotspotUsers(selectedRouterId.value);
    } catch (e) {
        hotspotError.value = e.response?.data?.detail || 'Failed to load hotspot active users.';
    } finally {
        hotspotLoading.value = false;
    }
};

const loadPppoe = async () => {
    if (!selectedRouterId.value) return;
    pppoeLoading.value = true;
    pppoeError.value = '';
    try {
        pppoeData.value = await fetchActivePppoeUsers(selectedRouterId.value);
    } catch (e) {
        pppoeError.value = e.response?.data?.detail || 'Failed to load PPPoE active users.';
    } finally {
        pppoeLoading.value = false;
    }
};

const refresh = () => {
    loadHotspot();
    loadPppoe();
};

// Reload whenever the selected router changes
watch(selectedRouterId, (id) => {
    if (id) refresh();
});

onMounted(async () => {
    await loadRouters();
    refresh();
});

// ── Computed helpers ─────────────────────────────────────────────
const hotspotRows = computed(() => hotspotData.value?.hotspot_active ?? []);
const pppoeRows = computed(() => pppoeData.value?.pppoe_active ?? []);

const hotspotColumns = computed(() =>
    hotspotRows.value.length ? Object.keys(hotspotRows.value[0]) : []
);
const pppoeColumns = computed(() =>
    pppoeRows.value.length ? Object.keys(pppoeRows.value[0]) : []
);

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString();
};
</script>

<template>
    <div class="content">
        <!-- Router selector + refresh bar -->
        <div class="au-toolbar">
            <div class="au-selector-wrap">
                <label class="neo-label" for="router-select">Router</label>
                <select
                    id="router-select"
                    v-model="selectedRouterId"
                    class="neo-input au-select"
                    :disabled="routersLoading"
                >
                    <option v-if="routersLoading" :value="null">Loading…</option>
                    <option v-else-if="!routers.length" :value="null">No routers found</option>
                    <option
                        v-for="r in routers"
                        :key="r.id"
                        :value="r.id"
                    >{{ r.name || r.ip_address }}</option>
                </select>
            </div>

            <button
                class="neo-btn neo-btn-primary au-refresh-btn"
                :disabled="hotspotLoading || pppoeLoading || !selectedRouterId"
                @click="refresh"
            >
                <RefreshCw :size="16" :class="{ 'spin': hotspotLoading || pppoeLoading }" />
                Refresh
            </button>
        </div>

        <!-- Tabs -->
        <div class="au-tabs">
            <button
                class="au-tab"
                :class="{ 'au-tab--active': activeTab === 'hotspot' }"
                @click="activeTab = 'hotspot'"
            >
                <Wifi :size="16" /> Hotspot
            </button>
            <button
                class="au-tab"
                :class="{ 'au-tab--active': activeTab === 'pppoe' }"
                @click="activeTab = 'pppoe'"
            >
                <Users :size="16" /> PPPoE
            </button>
        </div>

        <!-- ── HOTSPOT PANEL ── -->
        <div v-if="activeTab === 'hotspot'" class="au-panel">
            <div class="au-panel-header">
                <span class="au-panel-title">Hotspot Active Sessions</span>
                <span v-if="hotspotData" class="au-last-updated">
                    Last updated: {{ formatDate(hotspotData.generated_at) }}
                </span>
            </div>

            <CustomLoader v-if="hotspotLoading" />

            <div v-else-if="hotspotError" class="au-error">
                {{ hotspotError }}
            </div>

            <div v-else-if="!selectedRouterId" class="au-empty">
                Select a router to view active sessions.
            </div>

            <div v-else-if="!hotspotRows.length" class="au-empty">
                No active hotspot sessions.
            </div>

            <div v-else class="au-table-wrap">
                <table class="au-table">
                    <thead>
                        <tr>
                            <th v-for="col in hotspotColumns" :key="col">{{ col }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in hotspotRows" :key="i">
                            <td v-for="col in hotspotColumns" :key="col">{{ row[col] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ── PPPOE PANEL ── -->
        <div v-if="activeTab === 'pppoe'" class="au-panel">
            <div class="au-panel-header">
                <span class="au-panel-title">PPPoE Active Sessions</span>
                <span v-if="pppoeData" class="au-last-updated">
                    Last updated: {{ formatDate(pppoeData.generated_at) }}
                </span>
            </div>

            <CustomLoader v-if="pppoeLoading" />

            <div v-else-if="pppoeError" class="au-error">
                {{ pppoeError }}
            </div>

            <div v-else-if="!selectedRouterId" class="au-empty">
                Select a router to view active sessions.
            </div>

            <div v-else-if="!pppoeRows.length" class="au-empty">
                No active PPPoE sessions.
            </div>

            <div v-else class="au-table-wrap">
                <table class="au-table">
                    <thead>
                        <tr>
                            <th v-for="col in pppoeColumns" :key="col">{{ col }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in pppoeRows" :key="i">
                            <td v-for="col in pppoeColumns" :key="col">{{ row[col] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ── Toolbar ── */
.au-toolbar {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.au-selector-wrap {
    display: flex;
    flex-direction: column;
    min-width: 200px;
}

.au-select {
    min-width: 200px;
}

.au-refresh-btn {
    height: 2.5rem;
    align-self: flex-end;
}

/* ── Tabs ── */
.au-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
    border: var(--border-width) solid var(--border);
    width: fit-content;
}

.au-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.75px;
    text-transform: uppercase;
    border: none;
    border-right: var(--border-width) solid var(--border);
    background-color: var(--card);
    color: var(--foreground);
    cursor: pointer;
    transition: background-color 0.1s ease;
}

.au-tab:last-child {
    border-right: none;
}

.au-tab--active {
    background-color: var(--primary);
    color: #fff;
}

/* ── Panel ── */
.au-panel {
    background-color: var(--card);
    border: var(--border-width) solid var(--border);
    box-shadow: 6px 6px 0px 0px var(--border);
}

.au-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: var(--border-width) solid var(--border);
    flex-wrap: wrap;
    gap: 0.5rem;
}

.au-panel-title {
    font-weight: 900;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.au-last-updated {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    font-weight: 600;
}

/* ── States ── */
.au-error {
    padding: 1.25rem;
    color: var(--destructive);
    font-weight: 700;
    font-size: 0.875rem;
}

.au-empty {
    padding: 2rem 1.25rem;
    color: var(--muted-foreground);
    font-weight: 600;
    font-size: 0.875rem;
    text-align: center;
}

/* ── Table ── */
.au-table-wrap {
    overflow-x: auto;
}

.au-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
}

.au-table th {
    padding: 0.65rem 1rem;
    text-align: left;
    font-weight: 900;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-color: var(--muted);
    border-bottom: var(--border-width) solid var(--border);
    white-space: nowrap;
}

.au-table td {
    padding: 0.65rem 1rem;
    border-bottom: var(--border-width) solid var(--muted);
    color: var(--foreground);
    word-break: break-word;
}

.au-table tbody tr:last-child td {
    border-bottom: none;
}

.au-table tbody tr:hover td {
    background-color: var(--muted);
}

/* ── Spinner animation ── */
.spin {
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
</style>
