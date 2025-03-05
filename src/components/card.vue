<script setup>
const props = defineProps({
    icon: {
        type: String,
        default: 'fas fa-wallet'
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
    <div class="modern-card">
        <div class="card-header">
            <i :class="props.icon"></i>
            <h3>{{ props.title }}</h3>
        </div>
        <div class="card-content">
            <p v-if="props.pay" class="amount-paid">+ Ksh. {{ props.amount }}</p>
            <p v-else class="amount-active">{{ props.amount }} Active</p>
        </div>
    </div>
</template>

<style scoped>
.modern-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    max-width: 300px;
    overflow: hidden;
    position: relative;
}

.modern-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
}

.card-header i {
    font-size: 24px;
    color: #6a11cb;
    background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.card-content {
    text-align: right;
}

.amount-paid {
    font-size: 28px;
    font-weight: 700;
    color: #2ecc71;
    margin: 0;
}

.amount-active {
    font-size: 28px;
    font-weight: 700;
    color: #3498db;
    margin: 0;
}

.modern-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}
</style>