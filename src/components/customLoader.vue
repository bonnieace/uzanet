<script setup>
import { useMainStore } from '@/stores/store';
const store = useMainStore();
</script>

<template>
  <div v-if="store.isLoading" class="neo-loading-overlay">
    <div class="neo-card neo-loading-card">
      <!-- Brand Icon -->
      <div class="neo-brand-container">
        <div class="neo-brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      
      <!-- Loading Animation -->
      <div class="neo-dots-container">
        <div class="neo-dot neo-dot-1"></div>
        <div class="neo-dot neo-dot-2"></div>
        <div class="neo-dot neo-dot-3"></div>
      </div>
      
      <!-- Loading Text -->
      <p class="neo-loading-text">LOADING...</p>
    </div>
  </div>
</template>

<style scoped>
.neo-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
}

.neo-loading-card {
  width: 100%;
  max-width: 320px;
  border: var(--border-width) solid var(--border) !important;
  box-shadow: 10px 10px 0px 0px var(--border) !important;
  padding: 2.5rem !important;
  background-color: var(--card) !important;
  text-align: center;
}

.neo-brand-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.neo-brand-icon {
  font-weight: 900;
  color: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: var(--border-width) solid var(--border);
  box-shadow: 4px 4px 0px 0px var(--border);
}

.neo-dots-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  height: 20px;
}

.neo-dot {
  width: 12px;
  height: 12px;
  background-color: #000;
  border: 2px solid #000;
  animation: neo-bounce 1.4s infinite ease-in-out both;
}

.neo-dot-1 {
  animation-delay: -0.32s;
}

.neo-dot-2 {
  animation-delay: -0.16s;
}

.neo-dot-3 {
  animation-delay: 0s;
}

@keyframes neo-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.neo-loading-text {
  font-weight: 900;
  font-size: 1.2rem;
  color: #000;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}
</style>