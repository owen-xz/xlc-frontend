import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import homeRoute from './modules/front/index'
import adminProductRoute from './modules/back/product'
import adminCouponRoute from './modules/back/coupon'
import adminOrderRoute from './modules/back/order'

const frontRoutes = [
  homeRoute
]
const backRoutes = [
  adminProductRoute,
  adminCouponRoute,
  adminOrderRoute
]

const routes: Array<RouteRecordRaw> = [
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
  ...frontRoutes,
  ...backRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
