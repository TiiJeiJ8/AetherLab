<template>
  <transition name="fade-panel">
    <div
      v-show="isVisible"
      class="file-structure-panel"
      :class="{
        'is-focused': isFocused,
        'dragging': isDragging
      }"
      :style="panelPosition"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
      ref="panelRef">
    <!-- 面板头部 -->
    <div
      class="panel-header"
      @mousedown.prevent="startDrag">
      <div class="panel-title">
        <span class="panel-icon" v-html="getThemeIcon('structure')"></span>
        <span>{{ fileInfo.name }} - Structure</span>
      </div>
      <div class="panel-controls">
        <button class="control-btn minimize-btn" @click="minimize" title="Minimize">
          <span v-html="getThemeIcon('minimize')"></span>
        </button>
        <button class="control-btn close-btn" @click="close" title="Close">
          <span v-html="getThemeIcon('close')"></span>
        </button>
      </div>
    </div>

    <!-- 面板内容 -->
    <div class="panel-content" v-if="!isMinimized">
      <!-- 文件信息摘要 -->
      <div class="file-summary">
        <div class="summary-item">
          <span class="summary-label">Rows:</span>
          <span class="summary-value">{{ dataRows }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Columns:</span>
          <span class="summary-value">{{ fileInfo.columns || 0 }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Size:</span>
          <span class="summary-value">{{ formatFileSize(fileInfo.size) }}</span>
        </div>
      </div>

      <!-- 列结构列表 -->
      <div class="columns-container">
        <div class="columns-header">
          <h4>Data Columns</h4>
          <span class="columns-count">{{ columns.length }} columns</span>
        </div>
        <div class="columns-list">
          <div
            v-for="(column, index) in columns"
            :key="index"
            class="column-item"
            :class="{ 'dragging': draggedColumn === index }"
            draggable="true"
            @dragstart="handleDragStart(column, index, $event)"
            @dragend="handleDragEnd">
            <div class="column-info">
              <div class="column-header">
                <span class="column-name">{{ column.name }}</span>
                <span class="column-type" :class="getColumnTypeClass(column.type)">
                  {{ column.type }}
                </span>
              </div>
              <div class="column-details">
                <div class="sample-data">
                  <span class="sample-label">Sample:</span>
                  <span class="sample-value">{{ column.sample }}</span>
                </div>
                <div class="column-stats" v-if="column.stats">
                  <span class="stat-item" v-if="column.stats.nullCount !== undefined">
                    Nulls: {{ column.stats.nullCount }}
                  </span>
                  <span class="stat-item" v-if="column.stats.uniqueCount !== undefined">
                    Unique: {{ column.stats.uniqueCount }}
                  </span>
                </div>
              </div>
            </div>
            <div class="drag-handle" title="Drag to configure chart">
              <span v-html="getThemeIcon('drag')"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </transition>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getThemeIcon } from '@/assets/JS/SVG/icons.js'
import { inferDataType, calculateColumnStats, getColumnTypeClass } from '@/assets/JS/utils/columnAnalyzeUtils.js'

// Props
const props = defineProps({
  fileInfo: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'minimize', 'column-drag'])

// 面板状态
const isVisible = ref(false)
const isMinimized = ref(false)
const isFocused = ref(true)
const isDragging = ref(false)
const draggedColumn = ref(null)

// 拖拽相关状态
const dragOffset = ref({ x: 0, y: 0 })
const panelPosition = ref({
  position: 'fixed',
  top: '10%',
  right: '24%',
  width: '22.4%',
  maxHeight: '70vh'
})

// DOM 引用
const panelRef = ref(null)

// 文件列结构数据
const columns = ref([])

// 计算实际数据行数（排除标题行）
const dataRows = computed(() => {
  if (!props.fileInfo || !props.fileInfo.data || !Array.isArray(props.fileInfo.data)) {
    return 0
  }
  return Math.max(0, props.fileInfo.data.length - 1) // 减去标题行
})

// 监听 visible 属性变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    isFocused.value = true
    isMinimized.value = false
    nextTick(() => {
      analyzeFileStructure()
    })
  }
}, { immediate: true })

// 监听文件信息变化
watch(() => props.fileInfo, (newFileInfo) => {
  if (newFileInfo && isVisible.value) {
    analyzeFileStructure()
  }
}, { deep: true })

// 分析文件结构
async function analyzeFileStructure() {
  if (!props.fileInfo || !props.fileInfo.data) {
    console.warn('No file data available for structure analysis')
    return
  }
  const data = props.fileInfo.data
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('Invalid data format for structure analysis')
    return
  }
  const headers = props.fileInfo.headers || Object.keys(data[0])
  const analyzedColumns = []
  const chunkSize = 5 // 每次处理5列，防止主线程阻塞
  let i = 0
  function processChunk() {
    const end = Math.min(i + chunkSize, headers.length)
    for (; i < end; i++) {
      const header = headers[i]
      const columnData = data.slice(1).map(row => {
        if (Array.isArray(row)) {
          return row[i]
        } else if (typeof row === 'object') {
          return row[header]
        }
        return null
      }).filter(val => val !== null && val !== undefined && val !== '')
      // 推断数据类型
      const type = inferDataType(columnData)
      // 获取样本数据（跳过标题行）
      const sample = columnData.slice(0, 3).join(', ') || 'No data'
      // 统计信息 (总行数需要减去标题行)
      const stats = calculateColumnStats(columnData, data.length - 1)
      analyzedColumns.push({
        name: header,
        type,
        sample,
        stats,
        index: i
      })
    }
    columns.value = [...analyzedColumns]
    if (i < headers.length) {
      setTimeout(processChunk, 0)
    }
  }
  processChunk()
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 鼠标事件处理
function handleMouseEnter() {
  isFocused.value = true
}

function handleMouseLeave() {
  if (!isDragging.value) {
    isFocused.value = false
  }
}

function handleMouseDown() {
  isFocused.value = true
}

// 面板拖拽功能
function startDrag(event) {
  isDragging.value = true
  isFocused.value = true
  const rect = panelRef.value.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  document.addEventListener('mousemove', handlePanelDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag, { passive: false })
  event.preventDefault()
  event.stopPropagation()
}

let lastDragRAF = null
function handlePanelDrag(event) {
  if (!isDragging.value) return
  if (lastDragRAF) return // 节流
  lastDragRAF = requestAnimationFrame(() => {
    lastDragRAF = null
    const newX = event.clientX - dragOffset.value.x
    const newY = event.clientY - dragOffset.value.y
    // 确保面板不会拖拽到屏幕外
    const maxX = window.innerWidth - 400
    const maxY = window.innerHeight - 300
    const clampedX = Math.max(0, Math.min(newX, maxX))
    const clampedY = Math.max(0, Math.min(newY, maxY))
    panelPosition.value = {
      ...panelPosition.value,
      top: `${clampedY}px`,
      left: `${clampedX}px`,
      right: 'auto'
    }
  })
  event.preventDefault()
}

function stopDrag(event) {
  isDragging.value = false
  
  document.removeEventListener('mousemove', handlePanelDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  setTimeout(() => {
    if (!isDragging.value) {
      isFocused.value = false
    }
  }, 150)
  
  event.preventDefault()
}

// 列拖拽功能
function handleDragStart(column, index, event) {
  draggedColumn.value = index

  // 设置拖拽数据， file 和 index 字段，确保唯一性
  const dragData = {
    type: 'column',
    column: {
      ...column,
      type: column.type, // 明确携带类型
      file: props.fileInfo?.name || '',
      index // 唯一标识同文件内的同名列
    },
    source: 'file-structure'
  }

  event.dataTransfer.setData('application/json', JSON.stringify(dragData))
  event.dataTransfer.effectAllowed = 'copy'

  // 自定义拖拽图像
  const dragImage = createDragImage(column)
  event.dataTransfer.setDragImage(dragImage, 0, 0)

  emit('column-drag', { action: 'start', column, index })
}

function handleDragEnd() {
  draggedColumn.value = null
  emit('column-drag', { action: 'end' })
}

// 创建拖拽图像
function createDragImage(column) {
  const dragElement = document.createElement('div')
  dragElement.className = 'drag-preview'
  dragElement.innerHTML = `
    <div class="drag-preview-content">
      <span class="drag-column-name">${column.name}</span>
      <span class="drag-column-type">${column.type}</span>
    </div>
  `
  
  // 添加样式
  dragElement.style.cssText = `
    position: absolute;
    top: -1000px;
    left: -1000px;
    background: rgba(59, 130, 246, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    z-index: 10000;
  `
  
  document.body.appendChild(dragElement)
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(dragElement)
  }, 100)
  
  return dragElement
}

// 面板控制
function minimize() {
  isMinimized.value = !isMinimized.value
  emit('minimize', isMinimized.value)
}

function close() {
  isVisible.value = false
  emit('close')
}

// 组件挂载时添加全局点击监听
onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('mousemove', handlePanelDrag)
  document.removeEventListener('mouseup', stopDrag)
})

// 全局点击处理
function handleGlobalClick(event) {
  if (panelRef.value && !panelRef.value.contains(event.target)) {
    isFocused.value = false
  }
}
</script>

<style scoped>
@import '../../assets/CSS/FileStructurePanel.css';
</style>
