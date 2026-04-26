<template>
    <div v-if="show" class="neo-modal-overlay">
      <div class="neo-card neo-modal-content">
        <button class="neo-modal-close" @click="$emit('close')">✕</button>
        <slot></slot>
      </div>
    </div>
</template>

<script setup>
defineProps({ show: Boolean });
defineEmits(["close"]);
</script>

<style scoped>
.neo-modal-overlay {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    z-index: 2000;
    padding: 1rem;
}

.neo-modal-content {
    border: var(--border-width) solid var(--border) !important;
    box-shadow: 10px 10px 0px 0px var(--border-dark) !important;
    padding: 2rem !important;
    background-color: var(--card) !important;
    color: var(--card-foreground);
    position: relative;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
}

.neo-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    font-weight: 900;
    background: none;
    border: var(--border-width) solid var(--border);
    color: var(--foreground);
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    box-shadow: 3px 3px 0px 0px var(--border);
    transition: all 0.1s ease;
}

.neo-modal-close:hover {
    transform: translate(3px, 3px);
    box-shadow: 0px 0px 0px 0px var(--border);
}

@media (max-width: 768px) {
    .neo-modal-content {
        padding: 1.5rem !important;
    }
}
</style>
  