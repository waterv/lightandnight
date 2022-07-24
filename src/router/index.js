import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import i18n from '../i18n'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: i18n.global.t('route.home') },
  },
  ...[
    ['changelog', 'ChangeLog'],
    ['cpr', 'CPR'],
    ['gacha', 'GachaSimulator'],
    ['hoard', 'Hoard'],
    ['image', 'Image'],
    ['item', 'Item'],
    ['level', 'Level'],
    ['phone', 'Phone'],
    ['statement', 'Statement'],
    ['wish', 'Wish'],
    ['wishsim', 'WishSimulator'],
  ].map(item => ({
    path: `/${item[0]}`,
    component: () => import(`../views/${item[1]}.vue`),
    meta: { title: i18n.global.t(`route.${item[0]}`) },
  })),
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: { title: i18n.global.t('route.notfound') },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(to => {
  document.title = i18n.global.t('app.documentTitle', [to.meta.title])
})

export default router
