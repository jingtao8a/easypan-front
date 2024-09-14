import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Test from '@/views/Test.vue'
import Framework from '@/views/Framework.vue'
import Main from '@/views/main/Main.vue'
import MyShare from '@/views/share/MyShare.vue'
import Recycle from '@/views/recycle/Recycle.vue'
import Share from '@/views/webshare/Share.vue'
import ShareCheck from '@/views/webshare/ShareCheck.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: "/",
      component: Framework,
      children: [
        {
          path: "/",
          redirect: "/main/all"
        },
        {
          path: "/main/:category",
          name:"首页",
          meta: {
            needLogin: true,
            menuCode: "main",
          },
          component: Main,
        },
        {
          path: "/myshare",
          name: "我的分享",
          meta: {
            needLogin: true,
            menuCode: "share"
          },
          component: MyShare,
        },
        {
          path: "/recycle",
          name: "回收站",
          meta: {
            needLogin: true,
            menuCode: "recycle"
          },
          component: Recycle,
        },
      ] 
    },
    {
      path:"/share/:shareId",
      name:"外部分享",
      component: Share,
    },
    {
      path:"/shareCheck/:shareId",
      name:"外部分享校验",
      component: ShareCheck,
    }
  ]
})

export default router
