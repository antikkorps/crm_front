import './assets/main.css'

import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('IconifyIcon', Icon)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
