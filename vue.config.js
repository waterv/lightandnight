const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')
const path = require('path')

module.exports = {
  publicPath: './',

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '光夜小工具'
      return args
    })
  },

  configureWebpack: () => ({
    module: {
      rules: [
        {
          test: /\.(json5?|ya?ml)$/,
          type: 'javascript/auto',
          loader: '@intlify/vue-i18n-loader',
          include: [path.resolve(__dirname, 'src/i18n')],
        },
      ],
    },
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
}
