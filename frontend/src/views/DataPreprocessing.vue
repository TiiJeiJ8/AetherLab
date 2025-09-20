<template>
  <div class="data-preprocessing-container">
    <!-- 顶部悬浮 TopBar -->
    <TopBar :actions="topBarActions" />

    <div class="data-preprocessing-layout">
      <!-- 左侧 Sidebar -->
      <SideBar
        position="left"
          :collapsedWidth="30"
          :expandedWidth="300"
      >
        <!-- 模块导航列表（支持下拉） -->
        <!-- 侧边栏树形菜单 -->
        <SidebarItem
          v-for="item in sidebarModules"
          :key="item.id"
          :item="item"
          :level="0"
          :expanded-items="expandedItems"
          :active-id="activeSidebarId"
          @toggle="handleSidebarToggle"
          @select="handleSidebarSelect"
        />
      </SideBar>

      <!-- 主内容区 -->
      <div class="main-content-preprocess">
        <section class="preprocessing-main-section">
          <preprocessingDisplay :activeSidebarId="activeSidebarId" />
        </section>
      </div>

      <!-- 右侧 Sidebar -->
      <SideBar
        position="right"
          :collapsedWidth="30"
          :expandedWidth="600"
      >
      <PreprocessingConfigPanel :activeSidebarId="activeSidebarId" />
      </SideBar>

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
import { ref } from 'vue'
import TopBar from '@/components/Common/TopBar.vue'
import SideBar from '@/components/Common/SideBar.vue'
import FileUploadModal from '@/components/Common/FileUploadModal.vue'
import DataPreviewModal from '@/components/Common/DataPreviewModal.vue'
import FileWorkspace from '@/components/Common/FileWorkspace.vue'
import FileStructurePanel from '@/components/Common/FileStructurePanel.vue'
import SidebarItem from '@/components/Common/SidebarItem.vue'
import PreprocessingConfigPanel from '../components/Preprocessing/PreprocessingConfigPanel.vue'
import preprocessingDisplay from '../components/Preprocessing/preprocessingDisplay.vue'
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

// 侧边栏模块导航，支持多级树结构
const sidebarModules = [
  {
    id: 'quality', icon: '📊', label: 'Data Quality Report',
    children: []
  },
  {
    id: 'preview', icon: '👁️', label: 'Data Preview',
    children: [
      { id: 'raw-preview', label: 'Raw Data Preview' },
      { id: 'processed-preview', label: 'Processed Data Preview' }
    ]
  },
  {
    id: 'clean', icon: '🧹', label: 'Data Cleaning',
    children: [
      { id: 'remove-duplicates', label: 'Remove Duplicates' },
      { id: 'outlier-detect', label: 'Outlier Detection' }
    ]
  },
  {
    id: 'transform', icon: '🔄', label: 'Data Transformation',
    children: [
      { id: 'normalize', label: 'Normalize' },
      { id: 'encode', label: 'Encode' }
    ]
  },
  {
    id: 'filter', icon: '🔍', label: 'Data Filtering',
    children: [
      { id: 'filter-rows', label: 'Filter Rows' },
      { id: 'filter-columns', label: 'Filter Columns' }
    ]
  },
  {
    id: 'feature', icon: '🧩', label: 'Feature Engineering',
    children: [
      { id: 'feature-select', label: 'Feature Selection' },
      { id: 'feature-generate', label: 'Feature Generation' }
    ]
  },
  {
    id: 'missing', icon: '🖊', label: 'Advanced Imputation',
    children: [
      { id: 'fill-missing', label: 'Fill Missing' },
      { id: 'impute-advanced', label: 'Advanced Impute' }
    ]
  }
]

// 侧边栏展开状态和选中项
const expandedItems = ref(new Set())
const activeSidebarId = ref('quality')

function handleSidebarToggle(id) {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}
function handleSidebarSelect(id) {
  activeSidebarId.value = id
}

// 侧边栏展开状态
const expandedModules = ref([]) // 存储已展开的大类id

// 切换展开/收起
function toggleModule(id) {
  if (expandedModules.value.includes(id)) {
    expandedModules.value = expandedModules.value.filter(mid => mid !== id)
  } else {
    expandedModules.value.push(id)
  }
}

// 文件上传相关
const showFileUpload = ref(false)
function uploadFiles() {
  showFileUpload.value = true
}

// 数据预览相关
// showDataPreview、currentDataFile、previewData 已由 dataStructureOptimize.js 提供

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
</script>

<style scoped>
@import '@/assets/CSS/DataPreprocessing.css';
</style>
