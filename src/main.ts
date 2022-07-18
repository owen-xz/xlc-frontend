import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as bootstrap from 'bootstrap';
import { Form, Field, ErrorMessage } from 'vee-validate'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'
app.provide('bootstrap', bootstrap)
app.component('Form', Form)
app.component('Field', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
