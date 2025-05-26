import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import ChartVisualizations from '../views/ChartVisualizations.vue'
import DataPreprocessing from '../views/DataPreprocessing.vue'
import UnderConstruction from '../views/UnderConstruction.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chart-visualizations',
    name: 'ChartVisualizations',
    component: ChartVisualizations
  },
  {
    path: '/data-preprocessing',
    name: 'DataPreprocessing',
    component: DataPreprocessing
  },
  {
    path: '/under-construction',
    name: 'UnderConstruction',
    component: UnderConstruction
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
