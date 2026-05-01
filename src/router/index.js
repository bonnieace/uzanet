import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue';
import Hotspot from '@/views/hotspot.vue';
import PPPView from '@/views/PPPView.vue';
import PlansView from '@/views/PlansView.vue';
import LogsView from '@/views/LogsView.vue';
import PaymentView from '@/views/PaymentView.vue';
import LoginView from '@/views/LoginView.vue';
import RoutersView from '@/views/RoutersView.vue';
import PortalLoginView from '@/views/PortalLoginView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'PortalLogin',
      component: PortalLoginView,
      meta: { public: true, hideShell: true },
    },
    {
      path: '/admin/login',
      name: 'Login',
      component: LoginView,
      meta: { public: true, hideShell: true },
    },
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
    },
    {
      path:'/routers',
      name:'Routers',
      component:RoutersView
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth_token');
  if (!isAuthenticated && !to.meta.public) {
    next({ name: 'Login' });
  } else if (isAuthenticated && to.name === 'Login') {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router
