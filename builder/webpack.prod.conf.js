const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const { cleanDistFolder } = require('./utils')


console.info(`webpacking in ${process.env.NODE_ENV || '环境变量未声明！'}`)
// 清空打包文件夹
cleanDistFolder()

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    // 压缩
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css|html)$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
        
})