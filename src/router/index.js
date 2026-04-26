import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue';
import Hotspot from '@/views/hotspot.vue';
import PPPView from '@/views/PPPView.vue';
import PlansView from '@/views/PlansView.vue';
import LogsView from '@/views/LogsView.vue';
import PaymentView from '@/views/PaymentView.vue';
import LoginView from '@/views/LoginView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { public: true },
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
