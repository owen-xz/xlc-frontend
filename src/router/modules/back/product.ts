const adminProductRoute = {
  path: '/admin/product',
  name: 'Product',
  component: () => import('@/views/back/Dashboard.vue'),
  redirect: '/admin/product/list',
  children: [
    {
      path: 'list',
      component: () => import('@/views/back/Product/List.vue'),
      name: 'AdminProductList',
    },
    {
      path: 'edit/:id?',
      component: () => import('@/views/back/Product/Edit.vue'),
      name: 'AdminProductEdit',
    }
  ]
}

export default adminProductRoute
