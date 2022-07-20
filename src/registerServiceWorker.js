/* eslint-disable no-console */
import { register } from 'register-service-worker'
import { showDialog, showNotify } from 'vant'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import i18n from './i18n'

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
      showNotify({ type: 'success', message: i18n.global.t('pwa.cached') })
    },
    updatefound() {
      console.log('New content is downloading.')
      showNotify({ type: 'primary', message: i18n.global.t('pwa.updatefound') })
    },
    updated(reg) {
      console.log('New content is available; please refresh.')
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
      showDialog({
        message: i18n.global.t('pwa.updated'),
      }).then(() => {
        reg.waiting?.postMessage({ type: 'SKIP_WAITING' })
      })
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
