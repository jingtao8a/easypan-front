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

const app = createApp(App)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
