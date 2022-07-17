/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { Dialog, Notify } from 'vant'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
      Notify({ type: 'success', message: '缓存成功，可供离线使用。' })
    },
    updatefound() {
      console.log('New content is downloading.')
      Notify({ type: 'primary', message: '正在下载新内容……' })
    },
    updated(reg) {
      console.log('New content is available; please refresh.')
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
      Dialog({
        message: '更新成功，点击刷新页面缓存。',
      }).then(() => {
        reg.waiting?.postMessage({ type: 'SKIP_WAITING' })
      })
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
      Notify({ type: 'warning', message: '无网络连接，工具正在离线运行。' })
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
