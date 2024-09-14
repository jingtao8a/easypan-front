import { createRouter, createWebHistory } from 'vue-router'
//引入cookies
import VueCookies from 'vue-cookies'

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

router.beforeEach((to, from, next)=> {//用于在删除cookies中的userInfo后，刷新后自动跳转到登入状态
  const userInfo = VueCookies.get("userInfo")
  if (to.meta.needLogin != null && to.meta.needLogin && userInfo == null) {
    router.push("/login");
  }
  next()
})

export default router
