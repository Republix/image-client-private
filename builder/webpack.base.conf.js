const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const StyleLintPlugin = require('stylelint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { appConfig, buildConfig: { distPath, staticPrefixPath } } = require('./app.config')

module.exports = {
  resolve: {
    alias: {
      '@src': path.join(process.cwd(), '/src')
    }
  },
  entry: {
    index: '/src/app.js'
    // fuck: '/src/fuck.js'
  },
  output: {
    path: distPath,
    filename: '[name].dist.js',
    publicPath: staticPrefixPath,
    chunkFilename: '[name].chunk.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      "wpvar1": "wpreplace1"
    }),

    new VueLoaderPlugin(),

    new MiniCssExtractPlugin({ filename: '[id].[contenthash].css' }),

    // htmlPlugin
    new HtmlWebpackPlugin({
      title: appConfig.title,
      extends: appConfig.htmlConfig,
      cdnLinks: appConfig.cdnLinks,
      filename: path.join(distPath, '/index.html'), // 输出html文件名字 
      template: path.join(process.cwd(), '/public/template.html'), // 使用 html模板的位置
      // favicon: '../static/wifi.ico',

      // true | 'head' | 'body' | false
      inject: true, // 是否要插入打包好的bundle.js 文件  可手动模板渲染插入

      // publicPath: STATIC_PREFIX_PATH,
      alwaysWriteToDisk: true
    }),

    // 配合 htmlWP 插件 alwaysWriteToDisk
    new HtmlWebpackHarddiskPlugin()
  ],

  module: {
    rules: [
      // 字体
      {
        test: /\.(ttf|eot|woff|svg)$/i,
        loader: 'url-loader', // 类似于 file-loader // https://webpack.docschina.org/loaders/url-loader/
        options: {
          name: 'fonts/[name].[ext]', // ext 扩展名
          limit: 8192
        }
      },
      // 图片
      {
        test: /\.(jpe?g|gif|png)$/i,
        loader: 'url-loader',
        options: {
          name: 'images/[name].[ext]',
          limit: 10240
        }
      },
      // vue 
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      // sass
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      // css 
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // babel
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(process.cwd() + '/src'),
        ],
        options: {}
      }
    ]
  }
        
}