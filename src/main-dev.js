import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)
Vue.config.productionTip = false

// 设置全局过滤器,执行函数参数为使用过滤器的数据传入
Vue.filter('dateFormat', (value) => {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, 0)
  const day = date.getDate()
  const hours = (date.getHours() + 1 + '').padStart(2, 0)
  const minutes = (date.getMinutes() + 1 + '').padStart(2, 0)
  const seconds = (date.getSeconds() + 1 + '').padStart(2, 0)
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
