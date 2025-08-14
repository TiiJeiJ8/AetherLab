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

      <!-- 右侧主内容区 -->
      <div class="main-area">
        <!-- 功能模块面板区 -->
        <section class="module-panel-area">
          <!-- 主内容区：左右分栏布局 -->
          <div class="main-area-horizontal">
            <!-- 左侧：数据预览表格区 -->
            <section class="data-table-area-horizontal" :style="{ width: leftWidth + 'px' }">
              <!-- 表格头部控制区 -->
              <div class="table-header">
                <!-- 文件选择器 -->
                <div class="file-selector" v-if="workspaceFiles && workspaceFiles.length > 0">
                  <label>Current File:</label>
                  <select v-model="currentActiveFile" @change="switchFile">
                    <option v-for="file in workspaceFiles" :key="file.name" :value="file.name">
                      {{ file.name }}
                    </option>
                  </select>
                </div>
                <!-- 数据类型切换 -->
                <div class="data-type-selector" v-if="currentActiveFile">
                  <label>Data Type:</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input type="radio" v-model="dataType" value="raw" />
                      Raw Data
                    </label>
                    <label class="radio-item">
                      <input type="radio" v-model="dataType" value="processed" />
                      Processed
                    </label>
                  </div>
                </div>
              </div>

              <!-- vxe-table 虚拟滚动表格区 -->
              <div class="virtual-table-container" v-if="currentTableData.length > 0">
                <vxe-table
                  :data="vxeTableData"
                  border
                  show-overflow
                  height="100%"
                  :scroll-y="{enabled: true, gt: 20}"
                  :scroll-x="{enabled: true, gt: 10}"
                  :row-config="{height: 32}"
                  :column-config="{resizable: true}"
                >
                  <vxe-column
                    v-for="col in vxeTableColumns"
                    :key="col.field"
                    :field="col.field"
                    :title="col.title"
                    :min-width="100"
                    :show-overflow="true"
                  />
                </vxe-table>
              </div>

              <!-- 空状态 -->
              <div class="empty-state" v-else>
                <div class="empty-icon">📊</div>
                <div class="empty-text">
                  {{ (!workspaceFiles || workspaceFiles.length === 0) ? 'Please upload files to workspace first' : 'No data in current file' }}
                </div>
              </div>
            </section>
            <!-- 拖拽分割线 -->
            <div class="drag-divider" @mousedown="startDrag"></div>
        <!-- 右侧：功能模块面板区 -->
        <section class="module-panel-area-horizontal" style="flex:1; min-width:320px;">
          <!-- 这里后续插入功能模块面板组件 -->
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
    </section>
    </div>
      </div>
    </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import TopBar from '@/components/Common/TopBar.vue'
import SideBar from '@/components/Common/SideBar.vue'
import FileUploadModal from '@/components/Common/FileUploadModal.vue'
import DataPreviewModal from '@/components/Common/DataPreviewModal.vue'
import FileWorkspace from '@/components/Common/FileWorkspace.vue'
import FileStructurePanel from '@/components/Common/FileStructurePanel.vue'
import SidebarItem from '@/components/Common/SidebarItem.vue'
import 'vxe-table/lib/style.css'
import { VXETable, Table as VXETableComponent, Column as VXETableColumn } from 'vxe-table'
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
    id: 'quality', icon: '📊', label: 'Data Quality Overview',
    children: [
      { id: 'quality-overview', label: 'Overview' },
      { id: 'quality-report', label: 'Quality Report' }
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
const activeSidebarId = ref('')

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

// 表格预览相关
const currentActiveFile = ref('')
const dataType = ref('raw') // 'raw' | 'processed'

// 当前表格数据（计算属性）
const currentTableData = computed(() => {
  console.log('Computing table data for:', currentActiveFile.value)
  console.log('FileDataMap:', fileDataMap.value)
  
  if (!currentActiveFile.value || !fileDataMap.value || !fileDataMap.value[currentActiveFile.value]) {
    console.log('No file data found')
    return []
  }
  
  const fileData = fileDataMap.value[currentActiveFile.value]
  console.log('File data structure:', fileData)
  
  // fileDataMap中的数据就是解析后的对象数组
  let data = fileData
  
  // 如果有processed数据，优先使用
  if (dataType.value === 'processed' && fileData.processed) {
    data = fileData.processed
  }
  
  console.log('Selected data:', data)
  console.log('Data type:', typeof data, 'Is array:', Array.isArray(data), 'Length:', data?.length)
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log('Data is empty or not array')
    return []
  }
  
  // fileDataMap中的数据是对象数组格式 [{category: 'A', value: 100}, ...]
  // 需要转换为二维数组格式用于表格显示
  const headers = Object.keys(data[0])
  const tableData = [headers] // 第一行是表头
  
  // 将对象数组转换为二维数组
  data.forEach(row => {
    tableData.push(headers.map(key => row[key] !== undefined ? row[key] : ''))
  })
  
  console.log('Converted to table format, total rows:', tableData.length, 'headers:', headers)
  return tableData
})

// 为虚拟滚动准备的表格行数据
const tableRows = computed(() => {
  const data = currentTableData.value
  if (data.length <= 1) return [] // 只有表头或没有数据
  
  // 跳过第一行（表头），为每一行数据添加rowIndex
  return data.slice(1).map((row, index) => ({
    rowIndex: index,
    data: row
  }))
})

// vxe-table 列和数据适配
const vxeTableColumns = computed(() => {
  if (!currentTableData.value.length) return []
  const headers = currentTableData.value[0]
  return headers.map(h => ({ field: String(h), title: String(h) }))
})
const vxeTableData = computed(() => {
  if (!currentTableData.value.length) return []
  const headers = currentTableData.value[0]
  // 只取数据行（去掉第一行表头）
  return currentTableData.value.slice(2).map(row => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = row[i] })
    return obj
  })
})

// 文件切换
function switchFile() {
  console.log('切换到文件:', currentActiveFile.value)
  console.log('当前fileDataMap:', fileDataMap.value)
  console.log('当前文件数据:', fileDataMap.value[currentActiveFile.value])
}

// 监听工作区文件变化，自动选择第一个文件
watch(workspaceFiles, (newFiles) => {
  if (newFiles && newFiles.length > 0 && !currentActiveFile.value) {
    currentActiveFile.value = newFiles[0].name
  } else if (!newFiles || newFiles.length === 0) {
    currentActiveFile.value = ''
  }
}, { immediate: true })

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

// 拖拽分栏相关
const leftWidth = ref(800)
const dragging = ref(false)
const startX = ref(0)
const startLeft = ref(0)
const tabMode = ref('split') // 'table' | 'split' | 'panel'
const minLeft = ref(320)
const maxLeft = ref(900)
const minRight = 320 // 右侧最小宽度

function updateMinMax() {
  // 获取主内容区宽度
  nextTick(() => {
    const mainArea = document.querySelector('.main-area-horizontal')
    if (mainArea) {
      const total = mainArea.clientWidth || window.innerWidth
      minLeft.value = Math.max(200, Math.floor(total * 0.2))
      maxLeft.value = Math.min(total - minRight, Math.floor(total * 0.8))
      // 自动修正当前宽度
      if (leftWidth.value < minLeft.value) leftWidth.value = minLeft.value
      if (leftWidth.value > maxLeft.value) leftWidth.value = maxLeft.value
    }
  })
}

function setTabMode(mode) {
  tabMode.value = mode
  updateMinMax()
  if (mode === 'table') {
    leftWidth.value = maxLeft.value
  } else if (mode === 'panel') {
    leftWidth.value = minLeft.value
  } else {
    leftWidth.value = Math.floor((maxLeft.value + minLeft.value) / 2)
  }
}

function startDrag(e) {
  dragging.value = true
  startX.value = e.clientX
  startLeft.value = leftWidth.value
  document.body.style.cursor = 'col-resize'
}
function onDrag(e) {
  if (!dragging.value) return
  const dx = e.clientX - startX.value
  let newLeft = startLeft.value + dx
  if (newLeft < minLeft.value) newLeft = minLeft.value
  if (newLeft > maxLeft.value) newLeft = maxLeft.value
  leftWidth.value = newLeft
}
function stopDrag() {
  dragging.value = false
  document.body.style.cursor = ''
}

onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('keydown', handleAltKey)
  window.addEventListener('resize', updateMinMax)
  updateMinMax()
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('keydown', handleAltKey)
  window.removeEventListener('resize', updateMinMax)
})
function handleAltKey(e) {
  if (e.altKey && !e.shiftKey && !e.ctrlKey) {
    if (e.code === 'Digit1') setTabMode('table')
    else if (e.code === 'Digit2') setTabMode('split')
    else if (e.code === 'Digit3') setTabMode('panel')
  }
}
onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('keydown', handleAltKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('keydown', handleAltKey)
})
</script>

<style scoped>
@import '@/assets/CSS/DataPreprocessing.css';
</style>
