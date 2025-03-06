<script setup>
import { PulseLoader } from 'vue3-spinner';
import { useCounterStore } from '@/stores/counter';

const store=useCounterStore()
</script>

<template>
    <div v-if="store.isLoading" class="flex items-center justify-center min-h-screen w-full">
    <div class="text-center">
        <PulseLoader color="#4A90E2" size="100px" />
        <p class="text-gray-500 mt-4">Loading data...</p>
    </div>
    </div>
</template>