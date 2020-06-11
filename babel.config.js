/*
    1.定义数组变量，当判断为生产发布阶段，则添加transform-remove-console，移除console.log
    2.使用扩展运算符，合并数组到另一个数据组将数组中组件加到配置的plugins中，
*/
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 展开运算符，合并数组到另一个数据组
    ...prodPlugins

  ]
}
