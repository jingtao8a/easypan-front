import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//引入element plus
import ElementPlus from  'element-plus'
import 'element-plus/dist/index.css'
//图标
import '@/assets/icon/iconfont.css'
import '@/assets/base.scss'
//引入cookies
import VueCookies from 'vue-cookies'
//引入自定义组件
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import UpdateAvatar from '@/components/updateAvatar.vue'
import UpdatePassword from '@/components/updatePassword.vue'


import Verify from '@/utils/Verify.js'
import Message from '@/utils/Message.js'
import Request from '@/utils/Request.js'
import Confirm from '@/utils/Confirm'

const app = createApp(App)//创建一个VM

app.use(ElementPlus)
app.use(router)
//自定义组件
app.component("Dialog", Dialog)
app.component("Avatar", Avatar)
app.component("UpdateAvatar", UpdateAvatar)
app.component("UpdatePassword", UpdatePassword)

//全局数据
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Confirm = Confirm
app.config.globalProperties.globalInfo = {
    avatarUrl: "/api/getAvatar/",
}

app.mount('#app')
