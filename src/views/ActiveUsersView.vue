<script setup>
import api from '@/lib/api';
import { ref, watch, onMounted, computed } from 'vue';
import { Activity, Wifi, Users } from 'lucide-vue-next';
import { useMainStore } from '@/stores/store';
import { fetchActiveHotspotUsers, fetchActivePppoeUsers } from '@/services/activeUsers';
import Table from '@/components/Table.vue';

const store = useMainStore();

// ── Router selection ────────────────────────────────────────
const routersLoading = ref(false);
const routersError = ref('');

const loadRouters = async () => {
    if (store.routers.length) return; // already cached
    routersLoading.value = true;
    routersError.value = '';
    try {
        const res = await api.get('/routers');
        store.routers = res.data || [];
        if (store.routers.length && !store.selectedRouterId) {
            store.selectedRouterId = store.routers[0].id;
        }
    } catch {
        routersError.value = 'Failed to load routers.';
    } finally {
        routersLoading.value = false;
    }
};

// ── Tab state ───────────────────────────────────────────────
const activeTab = ref('hotspot'); // 'hotspot' | 'pppoe'

// ── Hotspot data ────────────────────────────────────────────
const hotspotData = ref([]);
const hotspotLoading = ref(false);
const hotspotError = ref('');

const hotspotColumns = computed(() =>
    hotspotData.value.length ? Object.keys(hotspotData.value[0]) : []
);

const loadHotspot = async () => {
    if (!store.selectedRouterId) return;
    hotspotLoading.value = true;
    hotspotError.value = '';
    try {
        hotspotData.value = await fetchActiveHotspotUsers(store.selectedRouterId);
    } catch {
        hotspotError.value = 'Failed to load hotspot active users.';
        hotspotData.value = [];
    } finally {
        hotspotLoading.value = false;
    }
};

// ── PPPoE data ──────────────────────────────────────────────
const pppoeData = ref([]);
const pppoeLoading = ref(false);
const pppoeError = ref('');

const pppoeColumns = computed(() =>
    pppoeData.value.length ? Object.keys(pppoeData.value[0]) : []
);

const loadPppoe = async () => {
    if (!store.selectedRouterId) return;
    pppoeLoading.value = true;
    pppoeError.value = '';
    try {
        pppoeData.value = await fetchActivePppoeUsers(store.selectedRouterId);
    } catch {
        pppoeError.value = 'Failed to load PPPoE active users.';
        pppoeData.value = [];
    } finally {
        pppoeLoading.value = false;
    }
};

// ── Load both when router changes ───────────────────────────
const loadAll = () => {
    loadHotspot();
    loadPppoe();
};

watch(() => store.selectedRouterId, (id) => {
    if (id) loadAll();
});

onMounted(async () => {
    await loadRouters();
    if (store.selectedRouterId) loadAll();
});
</script>

<template>
    <div class="content">
        <!-- Page header -->
        <div class="au-header">
            <div class="au-title-row">
                <Activity :size="22" class="au-title-icon" />
                <h2 class="au-title">Active Users</h2>
            </div>

            <!-- Router selector -->
            <div class="au-router-selector">
                <label for="au-router-select" class="au-router-label">Router</label>
                <select
                    id="au-router-select"
                    v-model="store.selectedRouterId"
                    class="au-router-select"
                    :disabled="routersLoading"
                >
                    <option v-if="routersLoading" disabled value="">Loading…</option>
                    <option v-else-if="!store.routers.length" disabled value="">No routers</option>
                    <option
                        v-for="r in store.routers"
                        :key="r.id"
                        :value="r.id"
                    >{{ r.name }}</option>
                </select>
                <span v-if="routersError" class="au-error-inline">{{ routersError }}</span>
            </div>
        </div>

        <!-- Tabs -->
        <div class="au-tabs">
            <button
                class="au-tab"
                :class="{ 'au-tab--active': activeTab === 'hotspot' }"
                @click="activeTab = 'hotspot'"
            >
                <Wifi :size="16" />
                Hotspot
                <span class="au-tab-badge">{{ hotspotData.length }}</span>
            </button>
            <button
                class="au-tab"
                :class="{ 'au-tab--active': activeTab === 'pppoe' }"
                @click="activeTab = 'pppoe'"
            >
                <Users :size="16" />
                PPPoE
                <span class="au-tab-badge">{{ pppoeData.length }}</span>
            </button>
        </div>

        <!-- Hotspot tab content -->
        <div v-if="activeTab === 'hotspot'">
            <div v-if="hotspotLoading" class="au-state">
                <span class="au-state-text">Loading hotspot sessions…</span>
            </div>
            <div v-else-if="hotspotError" class="au-state au-state--error">
                <span class="au-state-text">{{ hotspotError }}</span>
                <button class="neo-btn neo-btn-primary au-retry-btn" @click="loadHotspot">Retry</button>
            </div>
            <div v-else-if="!hotspotData.length" class="au-state">
                <span class="au-state-text">No active hotspot sessions.</span>
            </div>
            <Table v-else title="Active Hotspot Users" :columns="hotspotColumns" :rows="hotspotData" />
        </div>

        <!-- PPPoE tab content -->
        <div v-if="activeTab === 'pppoe'">
            <div v-if="pppoeLoading" class="au-state">
                <span class="au-state-text">Loading PPPoE sessions…</span>
            </div>
            <div v-else-if="pppoeError" class="au-state au-state--error">
                <span class="au-state-text">{{ pppoeError }}</span>
                <button class="neo-btn neo-btn-primary au-retry-btn" @click="loadPppoe">Retry</button>
            </div>
            <div v-else-if="!pppoeData.length" class="au-state">
                <span class="au-state-text">No active PPPoE sessions.</span>
            </div>
            <Table v-else title="Active PPPoE Users" :columns="pppoeColumns" :rows="pppoeData" />
        </div>
    </div>
</template>

<style scoped>
/* ── Page header ─────────────────────────────────────────── */
.au-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.au-title-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.au-title-icon {
    color: var(--primary);
}

.au-title {
    font-size: 1.4rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}

/* ── Router selector ─────────────────────────────────────── */
.au-router-selector {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
}

.au-router-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    color: var(--muted-foreground);
}

.au-router-select {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    background-color: var(--card);
    color: var(--foreground);
    border: var(--border-width) solid var(--border);
    box-shadow: 3px 3px 0px 0px var(--border);
    border-radius: var(--radius);
    outline: none;
    cursor: pointer;
    min-width: 160px;
}

.au-router-select:focus {
    box-shadow: 0 0 0 3px var(--primary);
}

.au-error-inline {
    font-size: 0.75rem;
    color: var(--destructive);
    font-weight: 600;
}

/* ── Tabs ────────────────────────────────────────────────── */
.au-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: var(--border-width) solid var(--border);
    padding-bottom: -3px;
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
    background-color: var(--card);
    color: var(--foreground);
    border: var(--border-width) solid var(--border);
    border-bottom: none;
    cursor: pointer;
    transition: background-color 0.1s ease, color 0.1s ease;
    position: relative;
    bottom: calc(-1 * var(--border-width));
    font-family: inherit;
}

.au-tab:hover:not(.au-tab--active) {
    background-color: var(--muted);
}

.au-tab--active {
    background-color: var(--primary);
    color: #fff;
    border-color: var(--border);
}

.au-tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.4rem;
    height: 1.4rem;
    padding: 0 0.3rem;
    font-size: 0.7rem;
    font-weight: 800;
    border: 2px solid currentColor;
    border-radius: var(--radius);
}

/* ── State messages ──────────────────────────────────────── */
.au-state {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    border: var(--border-width) solid var(--border);
    background-color: var(--card);
    box-shadow: 4px 4px 0px 0px var(--border);
}

.au-state--error {
    border-color: var(--destructive);
}

.au-state-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--muted-foreground);
}

.au-state--error .au-state-text {
    color: var(--destructive);
}

.au-retry-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.9rem;
}
</style>
