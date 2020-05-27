import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import axios from 'axios'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

// 引入axios，配置默认axios参数，将axios挂载在Vue的原型对象上以全局使用
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 设置路由导航守卫--控制页面路由访问权限
router.beforeEach((to, from, next) => {
  // 如果访问login--放行；return结束
  if (to.path === '/login') return next()
  // 如果访问非login，判断token
  const tokenStr = sessionStorage.getItem('token')
  // 没有token，直接返回结束，并且强制跳转到login
  if (!tokenStr) return next('/login')
  // 有token
  next()
})
export default router
