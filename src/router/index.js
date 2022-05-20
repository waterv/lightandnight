import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/common/hoard', component: () => import('../views/common/Hoard.vue') },
  { path: '/common/gacha', component: () => import('../views/common/Gacha.vue') },
  { path: '/common/cpr', component: () => import('../views/common/CPR.vue') },
  { path: '/common/item', component: () => import('../views/common/Item.vue') },
  { path: '/events/wish', component: () => import('../views/events/Wish.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router