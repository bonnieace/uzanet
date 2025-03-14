<template>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <span class="close-modal" @click="$emit('close')">&times;</span>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ show: Boolean });
  defineEmits(["close"]);
  </script>
  
  <style scoped>
  /* Add your modal styling */
  </style>
  