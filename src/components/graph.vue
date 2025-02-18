<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    const ctx = document.getElementById('rxTxChart').getContext('2d');
    const rxTxChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'RX Data',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#36A2EB',
                fill: false,
            }, {
                label: 'TX Data',
                data: [7, 11, 5, 8, 3, 10],
                borderColor: '#FF6384',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
</script>

<template>
    <div class="graph-container">
        <h3>RX/TX Data Usage</h3>
        <canvas id="rxTxChart"></canvas>
    </div>
</template>