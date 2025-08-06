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

export default router
