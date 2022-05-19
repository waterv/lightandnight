module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '光夜小工具'
      return args
    })
  }
}