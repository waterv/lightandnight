import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/common/hoard',
    component: () => import('../views/common/Hoard.vue'),
  },
  {
    path: '/common/gacha',
    component: () => import('../views/common/GachaSimulator.vue'),
  },
  {
    path: '/common/cpr',
    component: () => import('../views/common/CPR.vue'),
  },
  {
    path: '/common/item',
    component: () => import('../views/common/Item.vue'),
  },
  {
    path: '/common/level',
    component: () => import('../views/common/Level.vue'),
  },
  {
    path: '/events/wish',
    component: () => import('../views/events/Wish.vue'),
  },
  {
    path: '/events/wishsim',
    component: () => import('../views/events/WishSimulator.vue'),
  },
  {
    path: '/posts/changelog',
    component: () => import('../views/posts/ChangeLog.vue'),
  },
  {
    path: '/posts/statement',
    component: () => import('../views/posts/Statement.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
