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
    <div class="table-container">
        <div class="tables">
            <h3>{{ title }}</h3>
            <table>
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
</template>
<style scoped>
.table-container {
    overflow-x: auto;
    margin: 20px 0;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.tables {
    padding: 20px;
}

.tables h3 {
    margin-bottom: 20px;
    color: #2c3e50;
    font-weight: 600;
    font-size: 1.2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 10px;
}

table {
    width: 100%;
    min-width: 800px;
    border-collapse: separate;
    border-spacing: 0;
}

table th, table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.2s ease;
}

table th {
    background-color: #f7f9fc;
    font-weight: 600;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

table tr:hover {
    background-color: #f1f3f5;
}

/* Alternating row colors for better readability */
table tr:nth-child(even) {
    background-color: #f8f9fa;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
    .table-container {
        border-radius: 8px;
    }
}
</style>