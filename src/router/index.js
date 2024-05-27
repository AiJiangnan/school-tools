import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/', name: 'home', component: () => import('@/views/Home.vue'), children: [
      { path: '/analyze', name: 'analyze', component: () => import('@/views/NormalAnalyze.vue') },
      { path: '/pinyin', name: 'pinyin', component: () => import('@/views/PinYin.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
