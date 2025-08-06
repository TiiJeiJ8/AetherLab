/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 初始化主题
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
}

// 在应用挂载前初始化主题
initTheme()

const app = createApp(App)

app.use(router)
app.mount('#app')