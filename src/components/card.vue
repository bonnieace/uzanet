<script setup>
import { Wallet } from 'lucide-vue-next';
const props = defineProps({
    icon: {
        type: [Object, Function],
        default: () => Wallet
    },
    amount: {
        type: [Number, String],
        required: true
    },
    title: {
        type: String,
        default: 'Title'
    },
    pay: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <div class="neo-card neo-stat-card">
        <div class="card-header">
            <component :is="props.icon" :size="32" class="card-icon" />
            <h3>{{ props.title }}</h3>
        </div>
        <div class="card-content">
            <p v-if="props.pay" class="amount-paid">+ {{ props.amount }}</p>
            <p v-else class="amount-active">{{ props.amount }} Active</p>
        </div>
    </div>
</template>

<style scoped>
.neo-stat-card {
    border: var(--border-width) solid var(--border) !important;
    box-shadow: 6px 6px 0px 0px var(--border) !important;
    padding: 1.5rem !important;
    background-color: var(--card) !important;
    transition: all 0.1s ease !important;
    overflow: hidden !important;
    position: relative;
}

.neo-stat-card:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px 0px var(--border) !important;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
    border-bottom: var(--border-width) solid var(--border);
    padding-bottom: 1rem;
}

.card-header i {
    font-size: 2rem;
    color: var(--primary);
    font-weight: 900;
}

.card-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 900;
    color: var(--foreground);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border: none;
    box-shadow: none;
    padding: 0;
}

.card-content {
    text-align: right;
}

.amount-paid {
    font-size: 2rem;
    font-weight: 900;
    color: var(--success);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.amount-active {
    font-size: 2rem;
    font-weight: 900;
    color: var(--primary);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}
</style>