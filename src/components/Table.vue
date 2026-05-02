<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    columns: {
        type: Array,
        required: true
    },
    data: {
        type: Array,
        default: undefined
    },
    rows: {
        type: Array,
        default: undefined
    },
    title: {
        type: String,
        default: 'Recent Activity'
    },
    filterColumn: {
        type: String,
        default: ''
    },
    filterPlaceholder: {
        type: String,
        default: 'Filter records...'
    },
    enableRowSelection: {
        type: Boolean,
        default: true
    },
    enableColumnVisibility: {
        type: Boolean,
        default: true
    },
    enablePagination: {
        type: Boolean,
        default: true
    },
    pageSize: {
        type: Number,
        default: 5
    }
});

const filterValue = ref('');
const currentPage = ref(1);
const hiddenColumns = ref(new Set());
const selectedRowKeys = ref(new Set());

const tableData = computed(() => props.data ?? props.rows ?? []);
const columnKeys = computed(() => props.columns.map((column) => String(column)));
const activeFilterColumn = computed(() => props.filterColumn || columnKeys.value[0] || '');

const getRowKey = (row, index) => row?.id ?? row?._id ?? row?.key ?? `${index}`;

const formatCellValue = (column, value) => {
    if (column === 'online') {
        if (value === null || value === undefined) return '-';
        return value ? 'Online' : 'Offline';
    }

    if (column === 'latency_ms') {
        return value ?? '-';
    }

    if (column.endsWith('_at') && value) {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }
    }

    return value ?? '-';
};

const getCellClass = (column, value) => {
    if (column === 'online') {
        if (value === null || value === undefined) return 'neo-status-badge neo-status-badge--missing';
        return value ? 'neo-status-badge neo-status-badge--online' : 'neo-status-badge neo-status-badge--offline';
    }

    if (column === 'latency_ms') {
        if (value === null || value === undefined || value === '') {
            return 'neo-latency neo-latency--missing';
        }

        if (value < 100) {
            return 'neo-latency neo-latency--good';
        }

        if (value < 300) {
            return 'neo-latency neo-latency--warn';
        }

        return 'neo-latency neo-latency--bad';
    }

    return '';
};

const filteredRows = computed(() => {
    const search = filterValue.value.trim().toLowerCase();

    if (!search || !activeFilterColumn.value) {
        return tableData.value;
    }

    return tableData.value.filter((row) => {
        const cellValue = row?.[activeFilterColumn.value];
        return String(cellValue ?? '').toLowerCase().includes(search);
    });
});

const totalPages = computed(() => {
    if (!props.enablePagination) {
        return 1;
    }

    return Math.max(1, Math.ceil(filteredRows.value.length / props.pageSize));
});

const visibleRows = computed(() => {
    if (!props.enablePagination) {
        return filteredRows.value;
    }

    const startIndex = (currentPage.value - 1) * props.pageSize;
    return filteredRows.value.slice(startIndex, startIndex + props.pageSize);
});

const visibleColumnKeys = computed(() => {
    return columnKeys.value.filter((column) => !hiddenColumns.value.has(column));
});

const mobilePriorityOrder = ['name', 'username', 'ip_address', 'online', 'latency_ms', 'updated_at'];

const mobilePreviewColumns = computed(() => {
    const visible = visibleColumnKeys.value;
    const preferred = mobilePriorityOrder.filter((column) => visible.includes(column));
    const fallback = visible.filter((column) => !preferred.includes(column));
    return [...preferred, ...fallback].slice(0, 3);
});

const mobileDetailColumns = computed(() => {
    const previewSet = new Set(mobilePreviewColumns.value);
    return visibleColumnKeys.value.filter((column) => !previewSet.has(column));
});

const hasMobileDetails = computed(() => mobileDetailColumns.value.length > 0);

const isColumnVisible = (column) => !hiddenColumns.value.has(column);

const toggleColumnVisibility = (column) => {
    const nextHiddenColumns = new Set(hiddenColumns.value);

    if (nextHiddenColumns.has(column)) {
        nextHiddenColumns.delete(column);
    } else {
        nextHiddenColumns.add(column);
    }

    hiddenColumns.value = nextHiddenColumns;
};

const formatColumnLabel = (column) => {
    return String(column).replaceAll('_', ' ');
};

const isRowSelected = (row, index) => selectedRowKeys.value.has(getRowKey(row, index));

const toggleRowSelection = (row, index) => {
    const rowKey = getRowKey(row, index);
    const nextSelectedRowKeys = new Set(selectedRowKeys.value);

    if (nextSelectedRowKeys.has(rowKey)) {
        nextSelectedRowKeys.delete(rowKey);
    } else {
        nextSelectedRowKeys.add(rowKey);
    }

    selectedRowKeys.value = nextSelectedRowKeys;
};

const isAllPageRowsSelected = computed(() => {
    if (!props.enableRowSelection || visibleRows.value.length === 0) {
        return false;
    }

    return visibleRows.value.every((row, index) => isRowSelected(row, index));
});

const toggleAllPageRows = () => {
    const nextSelectedRowKeys = new Set(selectedRowKeys.value);

    if (isAllPageRowsSelected.value) {
        visibleRows.value.forEach((row, index) => {
            nextSelectedRowKeys.delete(getRowKey(row, index));
        });
    } else {
        visibleRows.value.forEach((row, index) => {
            nextSelectedRowKeys.add(getRowKey(row, index));
        });
    }

    selectedRowKeys.value = nextSelectedRowKeys;
};

const pageStart = computed(() => {
    if (!props.enablePagination || filteredRows.value.length === 0) {
        return 0;
    }

    return (currentPage.value - 1) * props.pageSize + 1;
});

const pageEnd = computed(() => {
    if (!props.enablePagination) {
        return filteredRows.value.length;
    }

    return Math.min(currentPage.value * props.pageSize, filteredRows.value.length);
});

watch(filterValue, () => {
    currentPage.value = 1;
});

watch(filteredRows, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
    }
});

watch(
    () => props.columns,
    (nextColumns) => {
        const nextColumnKeys = new Set(nextColumns.map((column) => String(column)));
        const nextHiddenColumns = new Set();

        hiddenColumns.value.forEach((column) => {
            if (nextColumnKeys.has(column)) {
                nextHiddenColumns.add(column);
            }
        });

        hiddenColumns.value = nextHiddenColumns;
    },
    { deep: true }
);
</script>

<template>
    <div class="neo-data-table">
        <div class="neo-data-table__header">
            <div>
                <h3>{{ title }}</h3>
                <p>{{ filteredRows.length }} record{{ filteredRows.length === 1 ? '' : 's' }}</p>
            </div>

            <div class="neo-data-table__tools">
                

                <details v-if="enableColumnVisibility" class="neo-data-table__columns">
                    <summary>Columns ⤵ </summary>
                    <div class="neo-data-table__columns-menu">
                        <label v-for="column in columnKeys" :key="column">
                            <input
                                type="checkbox"
                                :checked="isColumnVisible(column)"
                                @change="toggleColumnVisibility(column)"
                            />
                            <span>{{ column }}</span>
                        </label>
                    </div>
                </details>
            </div>
        </div>

        <div class="neo-data-table__surface">
            <div class="neo-data-table__scroll">
                <table>
                    <thead>
                        <tr>
                            <th v-if="enableRowSelection" class="neo-data-table__select-cell">
                                <input
                                    type="checkbox"
                                    :checked="isAllPageRowsSelected"
                                    :disabled="visibleRows.length === 0"
                                    @change="toggleAllPageRows"
                                />
                            </th>
                            <th v-for="column in visibleColumnKeys" :key="column">{{ column }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in visibleRows" :key="getRowKey(row, rowIndex)">
                            <td v-if="enableRowSelection" class="neo-data-table__select-cell">
                                <input
                                    type="checkbox"
                                    :checked="isRowSelected(row, rowIndex)"
                                    @change="toggleRowSelection(row, rowIndex)"
                                />
                            </td>
                            <td v-for="column in visibleColumnKeys" :key="column">
                                <span :class="getCellClass(column, row[column])">{{ formatCellValue(column, row[column]) }}</span>
                            </td>
                        </tr>
                        <tr v-if="visibleRows.length === 0">
                            <td :colspan="visibleColumnKeys.length + (enableRowSelection ? 1 : 0)" class="neo-data-table__empty">
                                No records found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="neo-mobile-cards">
                <details v-for="(row, rowIndex) in visibleRows" :key="`mobile-${getRowKey(row, rowIndex)}`" class="neo-mobile-card">
                    <summary class="neo-mobile-card__summary">
                        <div class="neo-mobile-card__preview">
                            <div v-for="column in mobilePreviewColumns" :key="`preview-${getRowKey(row, rowIndex)}-${column}`" class="neo-mobile-card__field">
                                <span class="neo-mobile-card__label">{{ formatColumnLabel(column) }}</span>
                                <span :class="getCellClass(column, row[column])">{{ formatCellValue(column, row[column]) }}</span>
                            </div>
                        </div>
                        <span class="neo-mobile-card__expand" v-if="hasMobileDetails" aria-hidden="true">↓</span>
                    </summary>

                    <div v-if="hasMobileDetails" class="neo-mobile-card__details">
                        <div v-for="column in mobileDetailColumns" :key="`detail-${getRowKey(row, rowIndex)}-${column}`" class="neo-mobile-card__field">
                            <span class="neo-mobile-card__label">{{ formatColumnLabel(column) }}</span>
                            <span :class="getCellClass(column, row[column])">{{ formatCellValue(column, row[column]) }}</span>
                        </div>
                    </div>
                </details>

                <div v-if="visibleRows.length === 0" class="neo-mobile-card neo-mobile-card--empty">
                    No records found.
                </div>
            </div>

            <div v-if="enablePagination" class="neo-data-table__footer">
                <p>
                    Showing {{ pageStart }}-{{ pageEnd }} of {{ filteredRows.length }}
                </p>

                <div class="neo-data-table__pagination">
                    <button type="button" :disabled="currentPage === 1" @click="currentPage = currentPage - 1">
                        <span class="neo-pagination__label">Previous</span>
                        <span class="neo-pagination__icon" aria-hidden="true">←</span>
                    </button>
                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                    <button type="button" :disabled="currentPage === totalPages" @click="currentPage = currentPage + 1">
                        <span class="neo-pagination__label">Next</span>
                        <span class="neo-pagination__icon" aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.neo-data-table {
    border: var(--border-width) solid var(--border);
    box-shadow: 6px 6px 0px 0px var(--border);
    background: var(--card);
    padding: 1.25rem;
    margin: 2rem 0;
}

.neo-data-table__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    margin-bottom: 1rem;
}

.neo-data-table__header h3 {
    margin: 0;
    color: var(--foreground);
    font-weight: 900;
    font-size: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.neo-data-table__header p {
    margin: 0.35rem 0 0;
    color: var(--muted-foreground);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.neo-data-table__tools {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.neo-data-table__search {
    display: grid;
    gap: 0.4rem;
}

.neo-data-table__search span,
.neo-data-table__columns summary {
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    color: var(--muted-foreground);
}

.neo-data-table__search input {
    min-width: min(100%, 260px);
    border: var(--border-width) solid var(--border);
    background: var(--background);
    color: var(--foreground);
    padding: 0.75rem 0.9rem;
    font: inherit;
    font-weight: 700;
    outline: none;
}

.neo-data-table__search input:focus {
    box-shadow: 0 0 0 2px var(--border);
}

.neo-data-table__columns {
    position: relative;
}

.neo-data-table__columns summary {
    list-style: none;
    cursor: pointer;
    border: var(--border-width) solid var(--border);
    background: var(--background);
    color: var(--foreground);
    padding: 0.75rem 0.9rem;
    min-width: 120px;
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.75px;
}

.neo-data-table__columns summary::-webkit-details-marker {
    display: none;
}

.neo-data-table__columns-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    z-index: 10;
    min-width: 220px;
    border: var(--border-width) solid var(--border);
    background: var(--card);
    box-shadow: 4px 4px 0px 0px var(--border);
    padding: 0.75rem;
    display: grid;
    gap: 0.5rem;
}

.neo-data-table__columns-menu label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--foreground);
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.neo-data-table__surface {
    overflow: hidden;
}

.neo-data-table__scroll {
    overflow-x: auto;
}

.neo-mobile-cards {
    display: none;
}

.neo-data-table table {
    width: 100%;
    border-collapse: collapse;
}

.neo-data-table th,
.neo-data-table td {
    border: var(--border-width) solid var(--border);
    padding: 0.95rem 1rem;
    text-align: left;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    vertical-align: middle;
}

.neo-data-table th {
    background-color: var(--muted);
    color: var(--foreground);
    font-weight: 900;
}

.neo-data-table tbody tr:hover {
    background-color: var(--muted);
    color: var(--foreground);
}

.neo-data-table__select-cell {
    width: 1%;
    white-space: nowrap;
}

.neo-data-table__select-cell input {
    width: 1rem;
    height: 1rem;
    accent-color: var(--foreground);
}

.neo-status-badge,
.neo-latency {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 86px;
    padding: 0.35rem 0.75rem;
    border: var(--border-width) solid var(--border);
    box-shadow: 2px 2px 0px 0px var(--border);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--card);
}

.neo-status-badge--online,
.neo-latency--good {
    background-color: #15803d;
}

.neo-status-badge--offline,
.neo-latency--bad {
    background-color: #dc2626;
}

.neo-status-badge--missing {
    background-color: #6b7280;
}

.neo-latency--warn {
    background-color: #d97706;
}

.neo-latency--missing {
    background-color: #6b7280;
}

.neo-data-table__empty {
    text-align: center;
    color: var(--muted-foreground);
    font-weight: 800;
}

.neo-data-table__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: var(--border-width) solid var(--border);
    flex-wrap: wrap;
}

.neo-data-table__footer p,
.neo-data-table__pagination span {
    margin: 0;
    color: var(--muted-foreground);
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.neo-data-table__pagination {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.neo-data-table__pagination button {
    border: var(--border-width) solid var(--border);
    background: var(--background);
    color: var(--foreground);
    padding: 0.6rem 0.9rem;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
}

.neo-data-table__pagination button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.neo-pagination__icon {
    display: none;
}

.neo-mobile-card {
    border: var(--border-width) solid var(--border);
    box-shadow: 4px 4px 0px 0px var(--border);
    background: var(--card);
    margin-bottom: 0.85rem;
}

.neo-mobile-card__summary {
    list-style: none;
    cursor: pointer;
    padding: 0.85rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
}

.neo-mobile-card__summary::-webkit-details-marker {
    display: none;
}

.neo-mobile-card__preview {
    flex: 1;
    display: grid;
    gap: 0.55rem;
}

.neo-mobile-card__details {
    border-top: var(--border-width) solid var(--border);
    padding: 0.85rem;
    display: grid;
    gap: 0.55rem;
    background: var(--muted);
}

.neo-mobile-card__field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem;
}

.neo-mobile-card__label {
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: var(--muted-foreground);
}

.neo-mobile-card__expand {
    border: var(--border-width) solid var(--border);
    background: var(--background);
    color: var(--foreground);
    padding: 0.3rem 0.5rem;
    font-size: 0.64rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    line-height: 1;
    transition: transform 0.2s ease;
}

.neo-mobile-card[open] .neo-mobile-card__expand {
    transform: rotate(180deg);
}

.neo-mobile-card--empty {
    padding: 1rem;
    text-align: center;
    font-weight: 800;
    color: var(--muted-foreground);
}

@media screen and (max-width: 768px) {
    .neo-data-table {
        padding: 1rem;
    }

    .neo-data-table__header {
        align-items: stretch;
        flex-direction: column;
    }

    .neo-data-table__tools {
        justify-content: flex-start;
    }

    .neo-data-table__scroll {
        display: none;
    }

    .neo-mobile-cards {
        display: block;
    }

    .neo-data-table__search input {
        min-width: 100%;
    }

    .neo-status-badge,
    .neo-latency {
        min-width: 78px;
        padding: 0.3rem 0.65rem;
        font-size: 0.72rem;
    }

    .neo-data-table__footer {
        align-items: flex-start;
        flex-direction: column;
    }

    .neo-data-table__pagination button {
        min-width: 2.4rem;
        padding: 0.55rem 0.7rem;
    }

    .neo-pagination__label {
        display: none;
    }

    .neo-pagination__icon {
        display: inline;
        font-size: 1rem;
        line-height: 1;
    }
}
</style>