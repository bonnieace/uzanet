<script setup>
import { useMainStore } from '@/stores/store';
const store = useMainStore();
</script>

<template>
  <div v-if="store.isLoading" class="loading-overlay">
    <div class="loading-card">
      <!-- Brand Icon -->
      <div class="brand-container">
        <div class="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      
      <!-- Loading Animation -->
      <div class="dots-container">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
      
      <!-- Loading Text -->
      <p class="loading-text">Loading data...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-card {
  width: 100%;
  max-width: 320px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.brand-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.brand-icon {
  width: 48px;
  height: 48px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.dots-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.dot-2 {
  animation-delay: 0.2s;
}

.dot-3 {
  animation-delay: 0.4s;
}

.loading-text {
  text-align: center;
  color: #4b5563;
  font-weight: 500;
  font-size: 1rem;
  margin: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

@media (min-width: 640px) {
  .loading-card {
    max-width: 384px;
  }
}
</style>