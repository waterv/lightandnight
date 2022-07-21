import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/hoard',
    component: () => import('../views/Hoard.vue'),
  },
  {
    path: '/gacha',
    component: () => import('../views/GachaSimulator.vue'),
  },
  {
    path: '/cpr',
    component: () => import('../views/CPR.vue'),
  },
  {
    path: '/item',
    component: () => import('../views/Item.vue'),
  },
  {
    path: '/level',
    component: () => import('../views/Level.vue'),
  },
  {
    path: '/wish',
    component: () => import('../views/Wish.vue'),
  },
  {
    path: '/wishsim',
    component: () => import('../views/WishSimulator.vue'),
  },
  {
    path: '/changelog',
    component: () => import('../views/ChangeLog.vue'),
  },
  {
    path: '/statement',
    component: () => import('../views/Statement.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
