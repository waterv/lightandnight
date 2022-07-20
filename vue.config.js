const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')

module.exports = {
  publicPath: './',

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '光夜小工具'
      return args
    })
  },

  configureWebpack: () => ({
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
    resolve: {
      fallback: {
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        fs: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        path: require.resolve('path-browserify'),
        querystring: require.resolve('querystring-es3'),
        stream: require.resolve('stream-browserify'),
        timers: require.resolve('timers-browserify'),
        util: require.resolve('util/'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
      },
    },
  }),

  pwa: {
    workboxPluginMode: 'GenerateSW',
    themeColor: '#212121',
    msTileColor: '#212121',
    appleMobileWebAppStatusBarStyle: 'black',
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: '???',
      localeDir: 'i18n',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
}
