import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Test from '@/views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
