<template>
<div class="instruction-view">
    <!-- 顶部导航栏 -->
    <InstructionTopBar
    :actions="topBarActions"
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
            @section-change="handleSectionChange"
            @progress-update="handleProgressUpdate"
        />

        <!-- ...existing code... -->
        </main>
    </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import InstructionTopBar from '../components/Instruction/InstructionTopBar.vue'
import NavigationTabs from '../components/Instruction/NavigationTabs.vue'
import TableOfContents from '../components/Instruction/TableOfContents.vue'
import ContentArea from '../components/Instruction/ContentArea.vue'
import { instructionConfig } from '../assets/instructions/config.js'

const router = useRouter()

// 响应式数据
const activeModule = ref('quick-start')
const activeSubModule = ref('')
const activeSection = ref('')
const readingProgress = ref(0)
const showToc = ref(true)
const tocSearchQuery = ref('')
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

const handleSectionChange = (sectionId) => {
    activeSection.value = sectionId
}

const handleProgressUpdate = (progress) => {
    readingProgress.value = progress
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

// 生命周期
onMounted(() => {
    // 初始化主题状态
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme)
    }
    
    if (mainContent.value) {
        mainContent.value.addEventListener('scroll', handleScroll)
    }
    window.addEventListener('keydown', handleKeydown)
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
}
</script>

<style scoped>
.instruction-view {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-main);
    transition: background-color 0.2s ease, color 0.2s ease;
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
