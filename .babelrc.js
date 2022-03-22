/**
  * babel-loader 使用 Babel 加载 ES2015 + 代码并将其转换为 ES5
  * @babel/core Babel 编译的核心包
  * @babel/preset-env Babel 编译的预设，可以理解为 Babel 插件的超集
*/
/**
  * 常见 Babel 预设还有：
  * @babel/preset-flow
  * @babel/preset-react
  * @babel/preset-typescript
 */

// 这就是一个简单babel配置
module.exports = {
  presets: [
    [
      // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
      // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
      // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
      "@babel/preset-env",
      {
        useBuiltIns: 'entry',
        corejs: '3.9.1',
        targets: {
          chrome: '58',
          ie: '11'
        }
      },
    ]
  ],
  // 对于正在提案中，还未进入 ECMA 规范中的新特性，Babel 是无法进行处理的，必须要安装对应的插件，例如：装饰器
  plugins: [
    // Babel 其实提供了对应装饰器的插件: decorators必须放在properties前面
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ]
}