/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// 屏蔽 ResizeObserver loop completed with undelivered notifications 警告
if (process.env.NODE_ENV === 'development') {
    const realWarn = window.console.warn
    window.console.warn = function (msg, ...args) {
        if (
            typeof msg === 'string' &&
            msg.includes('ResizeObserver loop completed with undelivered notifications')
        ) {
            return
        }
        realWarn.call(window.console, msg, ...args)
    }
}

// 初始化主题
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
}

// 在应用挂载前初始化主题
initTheme()

const app = createApp(App)

app.use(router)
app.use(VXETable)
app.mount('#app')