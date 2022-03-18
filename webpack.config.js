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
// 分离样式文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 构建费时分析
// 有些 Loader 或者 Plugin 新版本会不兼容，需要进行降级处理
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin();

// 下载cross-env 就可以配置环境变量
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量
const config = {
  mode: 'development', // 模式
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist'), // 输出文件目录
    publicPath: './'
  },
  // SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置
  devtool: 'source-map',
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
      // {
      //   test: /\.css$/, // 匹配所有的css文件
      //   /** 
      //     * style-loader 核心逻辑相当于：
      //     * const content = `${样式内容}`
      //     * const style = document.createElement('style');
      //     * style.innerHTML = content;
      //     * document.head.appendChild(style);
      //   */
      //   //  使用 postcss-loader，自动添加 CSS3 部分属性的浏览器前缀
      //   use: ['style-loader', 'css-loader', 'postcss-loader'], // use: 对应的loader名称
      // },
      {
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'], // use: 对应的loader名称
      },
      // {
      //   test: /.(jpe?g|png|gif)$/i, // 匹配图片文件
      //   use: [
      //     // {
      //     //   loader: 'file-loader',
      //     //   options: {
      //     //     name: '[name][hash:8].[ext]'
      //     //   }
      //     // },
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         name: '[name][hash:8].[ext]',
      //         // 文件小于 50k 会转换为 base64，大于则拷贝文件
      //         limit: 50 * 1024
      //       }
      //     }
      //   ]
      // },

      /**
      * 在webpakc5中
      * asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
      * asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
      * asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
      * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
      * 
      * 在webpakc5中,内置了资源处理模块，file-loader 和 url-loader 都可以不用安装
      */
      {
        test: /.(jpe?g|png|gif)$/i, // 匹配图片文件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        },
        generator: {
          filename: 'static/[name][hash:8][ext][query]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,  // 匹配字体文件
        type: 'asset/resource',
        generator: {
          filename: '[name][hash:8][ext]'
        }
      },
      {
        test: /\.js$/i,
        use: ['babel-loader']
      },
    ]
  },
  plugins: [
    // 将打包后的js或者css 自动引入到html中
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 清空上次打包文件
    new CleanWebpackPlugin(), // 引入插件
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    })
  ]
}

module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode) // 打印mode(模式) 值
  // return config
  // 这里可以通过不同的模式修改config配置
  return smp.wrap(config);
}