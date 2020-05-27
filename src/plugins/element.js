import Vue from 'vue'
import { Button, Form, FormItem, Input, message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 全局挂载element-ui的message（方法）
Vue.prototype.$message = message
