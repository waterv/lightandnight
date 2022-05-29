import { createRouter, createWebHashHistory } from 'vue-router'
import { Toast } from 'vant'
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
    path: '/common/image',
    component: () => import('../views/common/Image.vue'),
  },
  {
    path: '/events/wish',
    component: () => import('../views/events/Wish.vue'),
  },
  {
    path: '/events/wish/sim',
    component: () => import('../views/events/WishSimulator.vue'),
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
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(to => {
  if (to.fullPath != '/')
    Toast.loading({
      message: '加载中…',
      forbidClick: true,
      duration: 0,
    })
})

router.afterEach(() => {
  Toast.clear()
})

export default router
