import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  ...[
    ['/changelog', 'ChangeLog'],
    ['/cpr', 'CPR'],
    ['/gacha', 'GachaSimulator'],
    ['/hoard', 'Hoard'],
    ['/image', 'Image'],
    ['/item', 'Item'],
    ['/level', 'Level'],
    ['/statement', 'Statement'],
    ['/wish', 'Wish'],
    ['/wishsim', 'WishSimulator'],
  ].map(arr => ({
    path: arr[0],
    component: () => import(`../views/${arr[1]}.vue`),
  })),
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
