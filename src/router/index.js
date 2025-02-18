import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue';
import Hotspot from '@/views/hotspot.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/hotspot',
      name: 'Hotspot',
      component: Hotspot,
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component:NotFound,
    },
  ],
})

export default router
