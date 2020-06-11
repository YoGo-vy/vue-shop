import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import axios from 'axios'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/powers/rights.vue'
import Rules from '../components/powers/roles.vue'
import Categories from '../components/goods/categories'
// 引入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
import Params from '../components/goods/params'
import GoodsList from '../components/goods/goodslist.vue'
import AddGoods from '../components/goods/addgoods'
import Order from '../components/order/orderlist.vue'
import Reports from '../components/report/reports.vue'

// 导入nprogress进度条插件，和css样式表：在请求拦截器，响应拦截器中使用
import Nprogress from 'nprogress'
/* externals优化项目大小
import 'nprogress/nprogress.css'
 */
// 添加VueRouter插件
Vue.use(VueRouter)

// 引入axios，配置默认axios基准URL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 添加请求拦截器为请求添加token，以获得需要登录状态权限的API
axios.interceptors.request.use(config => {
  // console.log(config)
  // 使用nprogress进度条组件
  Nprogress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  // 一定要返回，否则请求发送不出
  return config
})

// 添加响应拦截器，在响应完成后结束nprogress进度条
axios.interceptors.response.use((res) => {
  Nprogress.done()
  return res
})

// 将axios挂载在Vue的原型对象上以全局使用
Vue.prototype.$http = axios

// 添加TreeTable插件为组件
Vue.component('tree-table', TreeTable)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // 访问Home组件，重定向到welcome默认页
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Rules },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/addgoods', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Reports }
    ]
  }
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
