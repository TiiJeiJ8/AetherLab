import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/chart-visualizations',
    name: 'ChartVisualizations',
    component: () => import('../views/ChartVisualizations.vue')
  },
  {
    path: '/data-preprocessing',
    name: 'DataPreprocessing',
    component: () => import('../views/DataPreprocessing.vue')
  },
  {
    path: '/instruction',
    name: 'Instruction',
    component: () => import('../views/InstructionView.vue')
  },
  {
    path: '/under-construction',
    name: 'UnderConstruction',
    component: () => import('../views/UnderConstruction.vue')
  },
  // 地图测试页面
  {
    path: '/map-test',
    name: 'MapTest',
    component: () => import('../views/mapTest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫 - 确保每次路由切换时主题都正确应用
router.beforeEach((to, from, next) => {
  // 应用保存的主题设置
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
  next()
})

export default router
