import { createI18n } from 'vue-i18n'
let locale = localStorage?.getItem('lang') || 'zh-CN'

import { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
let dayjs = require('dayjs')

switch (locale) {
  case 'zh-CN':
    require('dayjs/locale/zh-cn')
    dayjs.locale('zh-cn')
    break
  case 'en-US':
    require('dayjs/locale/en')
    dayjs.locale('en')
    Locale.use('en-US', enUS)
    break
}

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  const locales = require.context('./i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key).default
    }
  })
  return messages
}

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh-CN',
  messages: loadLocaleMessages(),
  globalInjection: true,
  silentFallbackWarn: true,
})
