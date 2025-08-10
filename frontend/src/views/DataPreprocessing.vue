<template>
  <div class="data-preprocessing-container">
    <!-- 顶部悬浮 TopBar -->
    <TopBar :actions="topBarActions" />

    <div class="data-preprocessing-layout">
      <!-- 左侧 Sidebar -->
      <SideBar
        position="left"
          :collapsedWidth="40"
          :expandedWidth="300"
      >
        <!-- 模块导航列表 -->
        <div class="sidebar-nav-item" v-for="item in sidebarModules" :key="item.id">
          <span class="sidebar-icon">{{ item.icon }}</span>
          <span class="sidebar-label">{{ item.label }}</span>
        </div>
      </SideBar>

      <!-- 右侧主内容区 -->
      <div class="main-area">
        <!-- 上半部分：数据预览表格区 -->
        <section class="data-table-area">
        </section>
        <!-- 下半部分：功能模块面板区 -->
        <section class="module-panel-area">
        </section>
      </div>

      <!-- 文件上传弹窗 -->
      <FileUploadModal
        v-if="showFileUpload"
        :show="showFileUpload"
        :workspaceFiles="workspaceFiles"
        @close="showFileUpload = false"
        @workspace-updated="handleWorkspaceUpdate"
      />

      <!-- 数据预览弹窗 -->
      <DataPreviewModal
        v-if="showDataPreview"
        :show="showDataPreview"
        :current-file="currentDataFile"
        :preview-data="previewData"
        @close="showDataPreview = false"
      />

      <!-- 文件工作区 -->
      <FileWorkspace
        :files="workspaceFiles"
        @remove="handleWorkspaceRemove"
        @preview="handleWorkspacePreview"
        @clear="handleWorkspaceClear"
        @show-structure="handleShowStructure"
      />

      <!-- 文件结构面板 -->
      <FileStructurePanel
        v-if="currentStructureFile"
        :fileInfo="currentStructureFile"
        :visible="showStructurePanel"
        :current-file="currentStructureFile.name"
        @close="showStructurePanel = false"
        @minimize="handleStructureMinimize"
        @column-drag="handleColumnDrag"
      />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from 'vue'
import TopBar from '@/components/Common/TopBar.vue'
import SideBar from '@/components/Common/SideBar.vue'
import FileUploadModal from '@/components/Common/FileUploadModal.vue'
import DataPreviewModal from '@/components/Common/DataPreviewModal.vue'
import FileWorkspace from '@/components/Common/FileWorkspace.vue'
import FileStructurePanel from '@/components/Common/FileStructurePanel.vue'

// 导入共享状态和工具函数
import { workspaceFiles, fileDataMap, showDataPreview, currentDataFile, previewData } from '@/assets/JS/utils/dataStructureOptimize.js'
import { handleWorkspaceUpdate, handleWorkspaceRemove, handleWorkspacePreview, loadFilePreview, handleWorkspaceClear } from '@/assets/JS/utils/workforceUtils.js'

// 顶部操作按钮
const topBarActions = [
  { type: 'button', label: 'File', onClick: uploadFiles },
  { type: 'button', label: 'Save', onClick: () => {} },
  { type: 'button', label: 'Export', onClick: () => {} },
  { type: 'button', label: 'Undo', onClick: () => {} },
  { type: 'button', label: 'History', onClick: () => {} },
  { type: 'button', label: 'Instruction', to: '/instruction', external: true },
  { type: 'button', label: 'Back2Home', to: '/', external: false },
]

// 侧边栏模块导航
const sidebarModules = [
  { id: 'quality', icon: '📊', label: 'Data Quality Overview' },
  { id: 'clean', icon: '🧹', label: 'Data Cleaning' },
  { id: 'transform', icon: '🔄', label: 'Data Transformation' },
  { id: 'filter', icon: '🔍', label: 'Data Filtering' },
  { id: 'feature', icon: '🧩', label: 'Feature Engineering' },
  { id: 'missing', icon: '🖊', label: 'Advanced Imputation' },
]

// 文件上传相关
const showFileUpload = ref(false)
function uploadFiles() {
  showFileUpload.value = true
}

// 文件结构面板相关
const showStructurePanel = ref(false)
const currentStructureFile = ref(null)

// 文件结构面板处理方法
function handleShowStructure(file) {
    console.log('Showing structure for file:', file.name)
    currentStructureFile.value = file
    showStructurePanel.value = true
}

function handleStructureMinimize(isMinimized) {
    console.log('Structure panel minimized:', isMinimized)
}

function handleColumnDrag(dragInfo) {
    console.log('Column drag event:', dragInfo)
    // 这里将来会处理列拖拽到数据预处理配置的逻辑
    if (dragInfo.action === 'start') {
        console.log('Started dragging column:', dragInfo.column.name)
    } else if (dragInfo.action === 'end') {
        console.log('Finished dragging column')
    }
}

// ESC键关闭所有弹窗
function handleEscKey(e) {
  if (e.key === 'Escape') {
    if (showFileUpload.value) showFileUpload.value = false
    if (showDataPreview.value) showDataPreview.value = false
    if (showStructurePanel.value) showStructurePanel.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
@import '@/assets/CSS/DataPreprocessing.css';
</style>
