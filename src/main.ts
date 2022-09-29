import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/element-variables.scss'
import ElementPlus from 'element-plus'
import './assets/all.scss'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'
app.use(ElementPlus)

app.mount('#app')
