const adminOrderRoute = {
  path: '/admin/order',
  name: 'Order',
  component: () => import('@/views/back/Dashboard.vue'),
  redirect: '/admin/order/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/back/Order/List.vue'),
      name: 'AdminOrderList',
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/back/Order/Detail.vue'),
      name: 'AdminOrderDetail',
    }
  ]
}

export default adminOrderRoute
