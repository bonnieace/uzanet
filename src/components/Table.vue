<script setup>

const props = defineProps({
    columns: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <div class="table-container">
        <div class="tables">
            <h3>Recent Activity</h3>
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
