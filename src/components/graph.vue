<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Activity } from 'lucide-vue-next';

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
    const ctx = chartRef.value.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'RX Data (GB)',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'hsl(204, 80%, 50%)',
                backgroundColor: 'hsla(204, 80%, 50%, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'hsl(204, 80%, 50%)',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 5,
            }, {
                label: 'TX Data (GB)',
                data: [7, 11, 5, 8, 3, 10],
                borderColor: 'hsl(170, 90%, 45%)',
                backgroundColor: 'hsla(170, 90%, 45%, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'hsl(170, 90%, 45%)',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: { weight: '700', family: 'Inter' },
                        color: '#0d1117'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.08)', lineWidth: 1 },
                    ticks: { font: { weight: '700', family: 'Inter' }, color: '#0d1117' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { weight: '700', family: 'Inter' }, color: '#0d1117' }
                }
            }
        }
    });
});

onUnmounted(() => {
    if (chartInstance) chartInstance.destroy();
});
</script>

<template>
    <div class="neo-card neo-graph-card">
        <h3 class="neo-graph-title"><Activity :size="18" /> RX / TX Data Usage</h3>
        <canvas ref="chartRef"></canvas>
    </div>
</template>

<style scoped>
.neo-graph-card {
    margin: 2rem 0;
}

.neo-graph-title {
    font-size: 1rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 3px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.6rem;
}
</style>