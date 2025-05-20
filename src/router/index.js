import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/views/Admin.vue'
import Article from '@/views/Article.vue'
import Photos from '@/views/Photos.vue'
import Login from '@/views/Login.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:'/login',
      meta : {
        isShow: false
      },
      component:()=>import('../views/Login.vue')
    },
    {
      alias: ['/', '/article'],
      meta: {
        isShow: true,
      },
      component: () => import('../views/Article.vue')
    },
    {
      path:'/photos',
      meta: {
        isShow: true,
      },
      component: () => import('../views/Photos.vue')
    },
    {
      path:'/admin',
      meta: {
        isShow: true,
      },
      component: () => import('../views/Admin.vue')
    }
  ],
})

export default router
