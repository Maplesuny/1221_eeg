
const routes = [
  {
    path: '/',
    component: () => import('layouts/myLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/new', component: () => import('pages/new.vue') },
      { path: '/total', component: () => import('pages/Total.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes