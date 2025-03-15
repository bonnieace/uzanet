<script setup>
import { RouterLink, RouterView } from 'vue-router'
import navbar from './components/navbar.vue';
import Sideview from './components/sideview.vue';
import { useMainStore } from './stores/store';
const store=useMainStore()
</script>

<template>
<navbar />
<Sideview/>
  

  <RouterView class="main-content"/>
</template>

<style scoped>

</style>
