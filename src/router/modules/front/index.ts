const homeRoute = {
    path: '/',
    name: '',
    component: () => import('@/views/front/Dashboard.vue'),
    redirect: '/',
    children: [
      {
        path: '',
        component: () => import('@/views/front/Home.vue'),
        name: 'Home',
      }
    ]
  }
  
  export default homeRoute
  