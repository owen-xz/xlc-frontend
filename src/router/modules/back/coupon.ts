const adminCouponRoute = {
  path: '/admin/coupon',
  name: 'Coupon',
  component: () => import('@/views/back/Dashboard.vue'),
  redirect: '/admin/coupon/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/back/Coupon/List.vue'),
      name: 'AdminCouponList',
    }
  ]
}

export default adminCouponRoute
