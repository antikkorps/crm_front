import './assets/main.css'

import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import i18n from './locales'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// eslint-disable-next-line vue/multi-word-component-names
app.component('Iconify', Icon)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(i18n)

app.mount('#app')
