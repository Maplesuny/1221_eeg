
const routes = [
  {
    path: '/',
    component: () => import('layouts/myLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/total', component: () => import('pages/Total.vue') },
      { path: '/CZ', component: () => import('pages/CZ.vue') },
      { path: '/table', component: () => import('pages/table.vue') },
      { path: '/eegtable', component: () => import('pages/eegdatabase.vue') },

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
