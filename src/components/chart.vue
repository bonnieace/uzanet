<template>
    <div class="neo-card neo-chart-card">
        <h3 class="neo-chart-title"><BarChart2 :size="18" /> Monthly Revenue</h3>
        <div class="neo-chart-body">
            <BarChart :chartData="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script>
import { Bar as BarChart } from 'vue-chartjs';
import { BarChart2 } from 'lucide-vue-next';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: 'Chart',
    components: { BarChart, BarChart2 },
    data() {
        return {
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue (Ksh)',
                    backgroundColor: 'hsla(204, 80%, 50%, 0.25)',
                    borderColor: 'hsl(204, 80%, 50%)',
                    borderWidth: 3,
                    data: [65, 59, 80, 81, 56, 55, 40]
                }]
            },
            chartOptions: {
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
        };
    }
};
</script>

<style scoped>
.neo-chart-card {
    margin: 2rem 0;
}

.neo-chart-title {
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

.neo-chart-body {
    width: 100%;
    max-height: 300px;
}
</style>