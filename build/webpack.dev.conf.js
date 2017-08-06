var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var SpritesmithPlugin = require('webpack-spritesmith')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/style.css')
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new SpritesmithPlugin({
    //     // 目标小图标
    //     src: {
    //         cwd: path.resolve(__dirname, '../src/image/char'),
    //         glob: '*.png'
    //     },
    //     // 输出雪碧图文件及样式文件
    //     target: {
    //         image: path.resolve(__dirname, '../src/image/sprites/sprite.png'),
    //         css: path.resolve(__dirname, '../src/image/sprites/sprite.css')
    //     },
    //     // 样式文件中调用雪碧图地址写法
    //     apiOptions: {
    //         cssImageRef: './sprite.png'
    //     },
    //     spritesmithOptions: {
    //         algorithm: 'top-down'
    //     }
    // })
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.template.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
