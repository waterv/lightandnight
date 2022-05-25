import { createRouter, createWebHashHistory } from 'vue-router'
import { Toast } from 'vant'
import Home from '../views/Home.vue'

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
    component: () => import('../views/common/Gacha.vue'),
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
    path: '/events/wish',
    component: () => import('../views/events/Wish.vue'),
  },
  {
    path: '/posts/addtohome',
    component: () => import('../views/posts/AddToHome.vue'),
  },
  {
    path: '/posts/changelog',
    component: () => import('../views/posts/ChangeLog.vue'),
  },
  {
    path: '/posts/statement',
    component: () => import('../views/posts/Statement.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.fullPath != '/')
    Toast.loading({
      message: '加载中…',
      forbidClick: true,
      duration: 0,
    })
})

export default router
