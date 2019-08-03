
const OUTPUT_PATH = '/dist'
// const PROXY_PATH = '/bing/client/'
const PROXY_PATH = '/' // 配合nginx

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const { cleanFolder } = require('./utils')

/**
 * 说明
 * #### 关于 样式
 * - mini-css-extract-plugin 在webpack4中代替 extract-text-webpack-plugin 插件
 * - production环境中 可以使用 mini-css-extract-plugin.loader 来代替 style-loader, 并可以用用来来分离样式
 * - development 环境中（WDS时）仍需要使用style-loader 来动态刷新样式
 */

console.info(`webpacking in ${process.env.NODE_ENV || "未声明的环境"}`)


const distPath = path.join(process.cwd(), OUTPUT_PATH)

console.info('清空打包位置')

cleanFolder(distPath, false)


module.exports = (env, args) => ({
    entry: {
        main: path.join(process.cwd(), '/src/app.js')
    },
    output: {
        path: distPath,
        filename: '[name].[contenthash].dist.js',
        // publicPath: '/bing/client/',
        publicPath: PROXY_PATH,
        // chunkFilename: '[name].chunk.js',
        // libraryTarget: 'umd'
    },
    devtool: false,
    cache: false, // default true

    plugins: [

        new VueLoaderPlugin(),

        // styleLint 配置
        new StyleLintPlugin({
            configFile: path.join(process.cwd(), '/.stylelintrc'),
            failOnError: false, // 是否因样式错误而中断webpack
            quiet: false // 除初始化之外的内容不会被打印到控制台
        }),

        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            // chunkFilename: '[id].css',
            // disable: process.env.NODE_ENV !== 'production'
        }),

        // htmlPlugin
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), OUTPUT_PATH + '/index.html'), // 输出html文件名字 
            template: path.join(process.cwd(), '/src/template.html'), // 使用 html模板的位置
            favicon: './static/wifi.ico',
            inject: false, // 是否要插入打包好的bundle.js 文件  可手动模板渲染插入
            publicPath: PROXY_PATH,
            alwaysWriteToDisk: true
        }),

        // 配合 htmlWP 插件 alwaysWriteToDisk
        new HtmlWebpackHarddiskPlugin(),
        
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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            // css 
            {
                test: /\.css$/,
                use: [
                    // args.mode === 'production' ?
                        // MiniCssExtractPlugin.loader :
                        // 'style-loader',
                    // 'style-loader', // 与 MiniCssExtractPlugin 不在共存
                    MiniCssExtractPlugin.loader,
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
                options: {
                }
            },
        ]
    }
})
