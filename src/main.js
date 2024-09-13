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
import Table from '@/components/Table.vue'
import Icon from '@/components/Icon.vue'
import Uploader from '@/components/Uploader.vue'
import FolderSelect from '@/components/FolderSelect.vue'
import Navigation from '@/components/Navigation.vue'

import Verify from '@/utils/Verify.js'
import Message from '@/utils/Message.js'
import Request from '@/utils/Request.js'
import Confirm from '@/utils/Confirm'
import Utils from '@/utils/Utils'

const app = createApp(App)//创建一个VM

app.use(ElementPlus)
app.use(router)
//自定义组件
app.component("Dialog", Dialog)
app.component("Avatar", Avatar)
app.component("UpdateAvatar", UpdateAvatar)
app.component("UpdatePassword", UpdatePassword)
app.component("Table", Table)
app.component("Icon", Icon)
app.component("Uploader", Uploader)
app.component('FolderSelect', FolderSelect)
app.component('Navigation', Navigation)

//全局数据
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Confirm = Confirm
app.config.globalProperties.Utils = Utils
app.config.globalProperties.globalInfo = {
    avatarUrl: "/api/getAvatar/",
    imageUrl: "/api/file/getImage/",
}

app.mount('#app')
