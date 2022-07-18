import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import adminProductRoute from './modules/back/product'

const backRoutes = {
  ...adminProductRoute
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/admin',
    redirect: '/admin/product/list'
  },
  backRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
