module.exports = {
  publicPath: './',

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '光夜小工具'
      return args
    })
  },

  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local',
    },
    themeColor: '#212121',
    msTileColor: '#212121',
    appleMobileWebAppStatusBarStyle: 'black',
  },

  pluginOptions: {
    i18n: {
      locale: 'cn',
      fallbackLocale: 'cn',
      localeDir: 'i18n',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  }
}
