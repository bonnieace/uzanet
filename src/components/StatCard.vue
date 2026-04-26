<script setup>
import { ArrowUp, ArrowDown, Minus } from 'lucide-vue-next';
const props = defineProps({
    icon: { type: [Object, Function], default: null },
    value: { type: [Number, String], required: true },
    title: { type: String, default: 'Title' },
    change: { type: String, default: null },
    trend: { type: String, default: 'neutral' }, // 'up', 'down', 'neutral'
    color: { type: String, default: 'primary' },  // 'primary', 'success', 'warning', 'secondary'
    subtitle: { type: String, default: 'vs yesterday' },
})
</script>

<template>
    <div class="neo-stat-card" :class="`stat-color--${props.color}`">
        <div class="stat-header">
            <span class="stat-title">{{ props.title }}</span>
            <div class="stat-icon-wrap">
                <component :is="props.icon" :size="18" />
            </div>
        </div>
        <div class="stat-value">{{ props.value }}</div>
        <div class="stat-footer" v-if="props.change !== null">
            <span class="stat-change" :class="`trend-${props.trend}`">
                <ArrowUp v-if="props.trend === 'up'" :size="12" />
                <ArrowDown v-else-if="props.trend === 'down'" :size="12" />
                <Minus v-else :size="12" />
                {{ props.change }}
            </span>
            <span class="stat-subtitle">{{ props.subtitle }}</span>
        </div>
    </div>
</template>

<style scoped>
.neo-stat-card {
    border: var(--border-width) solid var(--border);
    box-shadow: 6px 6px 0px 0px var(--border);
    padding: 1.5rem;
    background-color: var(--card);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.neo-stat-card:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px 0px var(--border);
}

/* ── header row ── */
.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.stat-title {
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted-foreground);
}

.stat-icon-wrap {
    width: 2.5rem;
    height: 2.5rem;
    border: var(--border-width) solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

/* icon colors per variant */
.stat-color--success .stat-icon-wrap { background-color: var(--success); color: #fff; }
.stat-color--primary .stat-icon-wrap { background-color: var(--primary); color: #fff; }
.stat-color--warning .stat-icon-wrap { background-color: var(--warning); color: #fff; }
.stat-color--secondary .stat-icon-wrap { background-color: var(--secondary); color: #fff; }

/* ── value ── */
.stat-value {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: 1px;
    color: var(--foreground);
    line-height: 1;
}

/* ── footer row ── */
.stat-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: var(--border-width) solid var(--border);
    flex-wrap: wrap;
}

.stat-change {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0.2rem 0.5rem;
    border: var(--border-width) solid var(--border);
}

.trend-up   { background-color: var(--success); color: #fff; }
.trend-down { background-color: var(--destructive); color: #fff; }
.trend-neutral { background-color: var(--muted); color: var(--foreground); }

.stat-subtitle {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
</style>
