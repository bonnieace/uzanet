import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue';
import Hotspot from '@/views/hotspot.vue';
import PPPView from '@/views/PPPView.vue';
import PlansView from '@/views/PlansView.vue';
import LogsView from '@/views/LogsView.vue';
import PaymentView from '@/views/PaymentView.vue';


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
    {
      path:'/clients',
      name:'Pppoe',
      component:PPPView,
    },
    {
      path:'/plans',
      name:'plans',
      component:PlansView
    },
    {
      path: '/logs',
      name:'logs',
      component:LogsView
    },
    {
      path:'/payments',
      name:'payments',
      component:PaymentView

    }
  ],
})

export default router
