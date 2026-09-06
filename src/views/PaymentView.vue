<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { errorMessage, fetchPaymentSessions, fetchPayments, retryPaymentProvisioning } from '@/lib/api';
import Table from '@/components/Table.vue';
import CustomLoader from '@/components/customLoader.vue';
import { useMainStore } from '@/stores/store';

const store = useMainStore();
const ledger = ref([]);
const sessions = ref([]);
const error = ref('');
const selectedRouterId = computed(() => store.selectedRouterId);
const sessionColumns = ['payment_id', 'provider', 'provider_receipt', 'status', 'amount', 'service_type', 'customer_reference', 'phone_number', 'message', 'created_at'];
const ledgerColumns = ['invoice', 'provider', 'provider_receipt', 'status', 'amount', 'user_type', 'created_at'];

const load = async () => {
    if (!selectedRouterId.value) return;
    store.setLoading(true);
    error.value = '';
    try {
        [sessions.value, ledger.value] = await Promise.all([
            fetchPaymentSessions(selectedRouterId.value),
            fetchPayments(selectedRouterId.value),
        ]);
    } catch (loadError) { error.value = errorMessage(loadError, 'Unable to load payment records.'); }
    finally { store.setLoading(false); }
};
watch(selectedRouterId, load);
watch(() => store.routerRefreshKey, load);
onMounted(async () => { await store.loadRouters(); await load(); });

const retry = async (row) => {
    if (!row.can_retry) {
        error.value = `Payment ${row.payment_id} is not in a retryable provisioning state.`;
        return;
    }
    try { await retryPaymentProvisioning(row.payment_id); await load(); }
    catch (retryError) { error.value = errorMessage(retryError, 'Unable to retry access activation.'); }
};
</script>

<template>
    <main class="content">
        <p v-if="error" class="form-error">{{ error }}</p>
        <CustomLoader v-if="store.isLoading" />
        <template v-else>
            <Table title="Payment Attempts" :rows="sessions" :columns="sessionColumns" :enable-actions="true" edit-label="Retry activation" :show-delete-action="false" @edit="retry" />
            <Table title="Completed Ledger" :rows="ledger" :columns="ledgerColumns" />
        </template>
    </main>
</template>
