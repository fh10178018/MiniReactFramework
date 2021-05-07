const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const webpack = require('webpack')
console.log(__dirname)
module.exports = {
  devServer: {
    contentBase: './build',
    host: 'localhost',
    port: 3000,
    open: true
  },
  output: {
    path: path.resolve(__dirname, 'docs'), // 设置打包文件目录
    filename: '[name].min.js',
    chunkFilename: '[chunkhash].chunk.min.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [
    new htmlWebpackPlugin({   //创建一个在内存中生成html页面的插件
      template: path.join(__dirname, 'index.html'),   //指定模板页面
      //将来会根据此页面生成内存中的页面
      filename: 'index.html'   //指定生成页面的名称，index.html浏览器才会默认直接打开
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  entry: path.resolve(__dirname, 'index.js'), // 设置入口运行文件
  mode: 'development', // 设置mode
  target: ['es5']
}