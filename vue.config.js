
module.exports = {
  chainWebpack: config => {
    //   发布阶段
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      //   使用externals设置依赖组件的排除项
      config.set('externals', {
        echarts: 'echarts'
      })
    })
    // 开发阶段
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
