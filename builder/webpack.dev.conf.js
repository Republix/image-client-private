
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { buildConfig: { distPath } } = require('./app.config')
const baseWebpackConfig = require('./webpack.base.conf')


console.info(`webpacking in ${process.env.NODE_ENV || '环境变量未声明！'}`)

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    inline: true,
    host: '0.0.0.0'   ,
    port: 10086,
    hot: true,
    compress: false, // gzip
    contentBase: [
      distPath
    ],
    historyApiFallback: true,
    open: false,
    quiet: false,
    overlay: { warnings: false, errors: true },
    watchOptions: {
      ignored: /node_modules/,
    }
  },
  devtool: 'inline-source-map', // https://webpack.docschina.org/configuration/devtool/
  cache: false,

  plugins: [
    // 热更新模块
    new webpack.HotModuleReplacementPlugin(),
  ]
        
})