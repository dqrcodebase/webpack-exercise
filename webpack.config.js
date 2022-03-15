/**
 * 需要先 npm init -y 才会有package.json文件
 */


/**
 * loader: 将webpack不认识的内容转化为认识的内容，用于转换特定的类型的文件
 * plugin: 可以贯穿webpack打包的生命周期，执行不同的任务
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 下载cross-env 就可以配置环境变量
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量
const config = {
  mode: 'development', // 模式
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  },
  // 这边用的是3.11.2，当版本 version >= 4.0.0 时，需要使用 devServer.static 进行配置，
  // 不再有 devServer.contentBase 配置项。
  devServer: {
    /** 
     * 为什么要配置 contentBase ？
     * 因为 webpack 在进行打包的时候，对静态文件的处理，例如图片，都是直接 copy 到 dist 目录下面。
     * 但是对于本地开发来说，这个过程太费时，也没有必要，
     * 所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，
     * 而不需对文件做任何移动，节省了时间和性能开销。
    */
    contentBase: path.resolve(__dirname, 'public'), // 静态文件目录
    compress: true,  // 是否启动压缩 gzip
    port: 8080, // 端口号
    // open: true // 是否自动打开浏览器
  },
  module: {
    // loader的执行顺序是固定从后往前，即按css-loader ---》 style-loader的顺序执行
    rules: [ // 转换规则
      {
        test: /\.css$/, // 匹配所有的css文件
        /** 
          * style-loader 核心逻辑相当于：
          * const content = `${样式内容}`
          * const style = document.createElement('style');
          * style.innerHTML = content;
          * document.head.appendChild(style);
        */
        //  使用 postcss-loader，自动添加 CSS3 部分属性的浏览器前缀
        use: ['style-loader', 'css-loader', 'postcss-loader'], // use: 对应的loader名称
      }
    ]
  },
  plugins: [
    // 将打包后的js或者css 自动引入到html中
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 清空上次打包文件
    new CleanWebpackPlugin(), // 引入插件
  ]
}

module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode) // 打印mode(模式) 值
  // 这里可以通过不同的模式修改config配置
  return config
}