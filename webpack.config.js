const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const webpack = require('webpack')
console.log(__dirname)
module.exports = {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: './build',
    host: 'localhost',
    port: 3003,
    open: true
  },
  output: {
    path: path.resolve(__dirname, 'docs'), // 设置打包文件目录
    filename: '[name].min.js',
    chunkFilename: '[chunkhash].chunk.min.js'
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.jsx', '.ts','tsx'],
    // 默认路径代理
    alias: {
        'React$': path.resolve(__dirname,'React/index'),
        'ReactDom$': path.resolve(__dirname,'ReactDom/index')
    }
  },
  module: {
    rules: [
    {
      test: /\.js|jsx|ts|tsx$/,
      use: {
        loader: 'babel-loader',
        options:{
          presets: ['@babel/preset-env'],
          plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'React.createElement'}]] // jsx片段会被转译成用React.createElement方法包裹的代码
        }
      },
      exclude: /node_modules/
    }
  ]
  },
  plugins: [
    new htmlWebpackPlugin({   //创建一个在内存中生成html页面的插件
      template: path.join(__dirname, 'index.html'),   //指定模板页面
      //将来会根据此页面生成内存中的页面
      filename: 'index.html'   //指定生成页面的名称，index.html浏览器才会默认直接打开
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  entry: path.resolve(__dirname, 'index.jsx'), // 设置入口运行文件
  mode: 'development', // 设置mode
  target: ['es5']
}