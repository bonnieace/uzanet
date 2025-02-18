<script setup>
import { RouterLink, RouterView } from 'vue-router'
import navbar from './components/navbar.vue';
import Sideview from './components/sideview.vue';
</script>

<template>
<navbar />
<Sideview/>
     

  <RouterView class="main-content"/>
</template>

<style scoped>

</style>
