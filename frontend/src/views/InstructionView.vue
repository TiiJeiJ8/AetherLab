<template>
  <div class="instruction-view">
    <!-- 顶部导航栏 -->
    <InstructionTopBar
      :actions="topBarActions"
      @toggle-theme="handleThemeToggle"
    />

    <!-- 主要内容区域 -->
    <div class="instruction-container">
      <!-- 主导航 -->
      <NavigationTabs
        :modules="mainModules"
        :active-module="activeModule"
        :reading-progress="readingProgress"
        @switch-module="handleModuleSwitch"
      />

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <!-- 侧边目录 -->
        <TableOfContents
          v-show="showToc"
          :items="currentTocItems"
          :active-section="activeSection"
          :search-query="tocSearchQuery"
          @navigate="handleTocNavigate"
          @search="handleTocSearch"
          @toggle-expand="handleTocToggle"
        />

        <!-- 主内容区 -->
        <main class="main-content" ref="mainContent">

          <!-- 动态内容组件 -->
          <ContentArea
            :active-module="activeModule"
            :active-sub-module="activeSubModule"
            :search-results="searchResults"
            @section-change="handleSectionChange"
            @progress-update="handleProgressUpdate"
          />
        </main>
      </div>
    </div>

    <!-- 主题切换按钮 -->
    <ThemeButton @change="handleThemeChange" />
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted, onUnmounted, nextTick, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import InstructionTopBar from '../components/Instruction/InstructionTopBar.vue'
import NavigationTabs from '../components/Instruction/NavigationTabs.vue'
import TableOfContents from '../components/Instruction/TableOfContents.vue'
import ContentArea from '../components/Instruction/ContentArea.vue'
import ThemeButton from '../components/Common/ThemeButton.vue'
import { instructionConfig } from '../assets/instructions/config.js'

// highlight.js 引入
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.min.css'

const router = useRouter()

// 响应式数据
const activeModule = ref('data-visualization')
const activeSubModule = ref('')
const activeSection = ref('')
const readingProgress = ref(0)
const showToc = ref(true)
const tocSearchQuery = ref('')
const globalSearchQuery = ref('')
const searchResults = ref([])
const mainContent = ref(null)

// 计算属性
const mainModules = computed(() => instructionConfig.modules)
const currentTocItems = computed(() => {
  const currentModule = mainModules.value.find(m => m.id === activeModule.value)
  return currentModule?.tocItems || []
})

// 顶部导航栏操作
const topBarActions = [
  {
    type: 'button',
    label: 'Back to Home',
    icon: '🏠',
    onClick: () => router.push('/')
  },
  {
    type: 'toggle',
    label: 'Toggle TOC',
    icon: '📑',
    active: showToc,
    onClick: () => showToc.value = !showToc.value 
  }
]

// 事件处理函数
const handleModuleSwitch = (moduleId) => {
  activeModule.value = moduleId
  activeSubModule.value = ''
  activeSection.value = ''
  scrollToTop()
}

const handleTocNavigate = (sectionId) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleTocSearch = (query) => {
  tocSearchQuery.value = query
}

const handleTocToggle = (itemId) => {
  // TOC 展开/折叠逻辑
}

const handleGlobalSearch = (query) => {
  // 全局搜索逻辑
  console.log('Global search:', query)
}

const handleSearchClear = () => {
  globalSearchQuery.value = ''
  searchResults.value = []
}

const handleSectionChange = (sectionId) => {
  activeSection.value = sectionId
}

const handleProgressUpdate = (progress) => {
  readingProgress.value = progress
}

const handleThemeChange = (theme) => {
  // 当 ThemeButton 组件触发主题变化时，发送全局事件
  window.dispatchEvent(new CustomEvent('app-theme-change', {
    detail: { colorScheme: theme === 'dark' ? 'dark' : 'default' }
  }))
}

const handleThemeToggle = () => {
  // 主题切换逻辑
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'default'
  const newTheme = currentTheme === 'dark' ? 'default' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  window.dispatchEvent(new CustomEvent('app-theme-change', {
    detail: { colorScheme: newTheme }
  }))
}

const scrollToTop = () => {
  if (mainContent.value) {
    mainContent.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 监听滚动
const handleScroll = () => {
  if (!mainContent.value) return
  
  const scrollTop = mainContent.value.scrollTop
  const scrollHeight = mainContent.value.scrollHeight
  const clientHeight = mainContent.value.clientHeight
  
  // 更新进度
  readingProgress.value = (scrollTop / (scrollHeight - clientHeight)) * 100
}

// 代码高亮函数
const highlightAllCode = () => {
  nextTick(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  })
}

// 生命周期
onMounted(() => {
  // 监听滚动
  if (mainContent.value) {
    mainContent.value.addEventListener('scroll', handleScroll)
  }
  
  // 监听键盘快捷键
  window.addEventListener('keydown', handleKeydown)
  
  // 初始化代码高亮
  highlightAllCode()
})

onUpdated(() => {
  highlightAllCode()
})

onUnmounted(() => {
  if (mainContent.value) {
    mainContent.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e) => {
  // Ctrl + 数字键快速切换模块
  if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
    e.preventDefault()
    const moduleIndex = parseInt(e.key) - 1
    if (mainModules.value[moduleIndex]) {
      handleModuleSwitch(mainModules.value[moduleIndex].id)
    }
  }
  
  // Esc 关闭搜索
  if (e.key === 'Escape') {
    handleSearchClear()
  }
}
</script>

<style scoped>
.instruction-view {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-main);
}

.instruction-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* 减去顶部导航栏高度 */
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  position: relative;
}

.content-search {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-primary);
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    position: relative;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-main);
}
</style>
