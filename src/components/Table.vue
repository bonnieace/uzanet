<script setup>
const props = defineProps({
    columns: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true
    },
    title:{
        type:String,
        default:'Recent Activity'
    }
});
</script>

<template>
    <div class="neo-card neo-table-container">
        <div class="neo-table-wrapper">
            <h3>{{ title }}</h3>
            <div class="neo-table-scroll">
                <table class="neo-table">
                    <thead>
                        <tr>
                            <th v-for="column in columns" :key="column">{{ column }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in rows" :key="index">
                            <td v-for="column in columns" :key="column">{{ row[column] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.neo-table-container {
    border: var(--border-width) solid var(--border) !important;
    box-shadow: 6px 6px 0px 0px var(--border) !important;
    padding: 0 !important;
    margin: 2rem 0;
    background-color: var(--card) !important;
    overflow: hidden;
}

.neo-table-wrapper {
    padding: 1.5rem;
}

.neo-table-wrapper h3 {
    margin: 0 0 1.5rem 0;
    color: var(--foreground);
    font-weight: 900;
    font-size: 1.25rem;
    border-bottom: var(--border-width) solid var(--border);
    padding-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.neo-table-scroll {
    overflow-x: auto;
}

.neo-table {
    width: 100%;
    border-collapse: collapse;
}

.neo-table th,
.neo-table td {
    padding: 1rem;
    text-align: left;
    border: var(--border-width) solid var(--border);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.neo-table th {
    background-color: var(--border);
    color: var(--card);
    font-weight: 900;
}

.neo-table tr:nth-child(even) {
    background-color: var(--muted);
}

.neo-table tbody tr:hover {
    background-color: var(--border);
    color: var(--card);
}

@media screen and (max-width: 768px) {
    .neo-table-wrapper {
        padding: 1rem;
    }

    .neo-table th,
    .neo-table td {
        padding: 0.75rem;
        font-size: 0.875rem;
    }
}
</style>