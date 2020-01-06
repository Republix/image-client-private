
const OUTPUT_PATH = '/dist'
const STATIC_PREFIX_PATH = '/static'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

console.info(`webpacking in ${process.env.NODE_ENV || "未声明的环境"}`)

module.exports = {
    entry: {
        main: path.join(process.cwd(), '/src/app.js') // process.cwd(), 当前执行命令时的目录名
    },
    output: {
        path: path.join(process.cwd(), OUTPUT_PATH),
        filename: '[name].dist.js',
        publicPath: STATIC_PREFIX_PATH,
        chunkFilename: '[name].chunk.js',
        // libraryTarget: 'umd'
    },
    devServer: {
        inline: true, // default true
        host: '0.0.0.0', // 当设置为 0.0.0.0 时 可被其他机器访问
        port: 3011,
        hot: true,
        compress: false, // 是否gzip压缩源码
        contentBase: [
            path.join(process.cwd() + OUTPUT_PATH),
            // path.join(__dirname, STATIC_PREFIX_PATH)
        ], // 指定静态资源目录，默认为当前目录
        historyApiFallback: true,
        // historyApiFallback: { // https://webpack.docschina.org/configuration/dev-server/#devserver-historyapifallback
        //     rewrites: [
        //         { from: /./, to: '/static/404.html' }
        //     ]
        // },
        open: false, // 是否构建完成后打开浏览器
        quiet: false, // 除初始启动信息之外的任何内容不会打印到控制台
        overlay: { warnings: false, errors: true } || false, // 发现错误后时候在浏览器全屏显示错误信息
        watchOptions: {
            ignored: '../node_modules/',
        }
    },
    // inline-source-map 模式可以查看vue源码
    devtool: 'inline-source-map', // https://webpack.docschina.org/configuration/devtool/
    cache: true, // default true

    plugins: [
        // 热更新模块
        new webpack.HotModuleReplacementPlugin(),

        // 自定义编译中的全局变量
        // 这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号 --- by webpack
        // ps: { "userInfo.name" : "hah" }
        new webpack.DefinePlugin({
            "flag": "observer_1"
        }),

        new VueLoaderPlugin(),

        // styleLint 配置
        new StyleLintPlugin({
            configFile: path.join(process.cwd(), '/.stylelintrc'),
            failOnError: false, // 是否因样式错误而中断webpack
            quiet: false // 除初始化之外的内容不会被打印到控制台
        }),

        // htmlPlugin
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), OUTPUT_PATH + '/index.html'), // 输出html文件名字 
            template: path.join(process.cwd(), '/src/template.html'), // 使用 html模板的位置
            // favicon: '../static/wifi.ico',
            inject: false, // 是否要插入打包好的bundle.js 文件  可手动模板渲染插入
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
            // eslint 预处理
            // {
            //     test: /(\.vue|\.js)$/,
            //     enforce: 'pre', // pre, post, undefined(no loader), 源码模块转换按照 pre -> normal -> inline -> post 顺序调用
            //     include: path.join(process.cwd() + '/src'),
            //     loader: 'eslint-loader',
            //     options: {
            //         env: {
            //             'es6': true
            //         }
            //     }
            // },
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
}
