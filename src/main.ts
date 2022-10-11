import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/element-variables.scss'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-tw' // lang i18n
import './assets/all.scss'
import Dayjs from 'dayjs'
import zhtw from 'dayjs/locale/zh-tw'

const dayjs: any = Dayjs
dayjs.locale({
  ...zhtw,
  weekStart: 1
})

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'
app.provide('$dayjs', dayjs)
app.use(ElementPlus, { locale })

app.mount('#app')
