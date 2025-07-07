<template>
  <div
    v-if="isVisible"
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
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getThemeIcon } from '@/assets/JS/icons.js'

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
  top: '120px',
  right: '20px',
  width: '380px',
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

  // 使用第一行作为列名（如果是表头）
  const headers = props.fileInfo.headers || Object.keys(data[0])
  
  // 分析每列的数据类型和样本
  const analyzedColumns = headers.map((header, index) => {
    const columnData = data.slice(1).map(row => { // 跳过第一行（标题行）
      if (Array.isArray(row)) {
        return row[index]
      } else if (typeof row === 'object') {
        return row[header]
      }
      return null
    }).filter(val => val !== null && val !== undefined && val !== '')

    // 推断数据类型
    const type = inferDataType(columnData)
    
    // 获取样本数据（跳过标题行）
    const sample = columnData.slice(0, 3).join(', ') || 'No data'
    
    // 统计信息（总行数需要减去标题行）
    const stats = calculateColumnStats(columnData, data.length - 1)

    return {
      name: header,
      type: type,
      sample: sample,
      stats: stats,
      index: index
    }
  })

  columns.value = analyzedColumns
}

// 推断数据类型
function inferDataType(columnData) {
  if (columnData.length === 0) return 'unknown'
  
  const sample = columnData.slice(0, Math.min(20, columnData.length)) // 取更多样本进行分析
  const uniqueValues = [...new Set(sample)]
  const uniqueCount = uniqueValues.length
  
  // 检查是否为明确的布尔值（true/false字符串）
  const isTrueFalseBool = sample.every(val => {
    const str = String(val).toLowerCase()
    return str === 'true' || str === 'false' || val === true || val === false
  })
  
  if (isTrueFalseBool && uniqueCount <= 2) {
    return 'boolean'
  }
  
  // 检查是否为数字
  const isNumeric = sample.every(val => !isNaN(val) && !isNaN(parseFloat(val)))
  
  if (isNumeric) {
    const isInteger = sample.every(val => Number.isInteger(parseFloat(val)))
    
    if (isInteger) {
      // 对于整数，需要智能判断是布尔值、类别值还是普通整数
      if (uniqueCount === 2 && uniqueValues.every(val => val === 0 || val === 1 || val === '0' || val === '1')) {
        // 只有两个唯一值且都是0/1，可能是布尔值
        // 但需要考虑数据的语义上下文，这里倾向于认为是布尔值
        return 'boolean'
      } else if (uniqueCount <= 10 && uniqueCount < sample.length * 0.5) {
        // 唯一值较少且明显少于样本数量的一半，可能是类别值
        return 'category'
      } else {
        return 'integer'
      }
    } else {
      return 'number'
    }
  }
  
  // 检查是否为日期
  const isDate = sample.some(val => !isNaN(Date.parse(val)))
  if (isDate) return 'date'
  
  // 检查是否为类别值（字符串类型的类别）
  if (uniqueCount <= 10 && uniqueCount < sample.length * 0.5) {
    return 'category'
  }
  
  // 默认为字符串
  return 'string'
}

// 计算列统计信息
function calculateColumnStats(columnData, totalRows) {
  const nonEmptyCount = columnData.length
  const nullCount = totalRows - nonEmptyCount
  const uniqueCount = new Set(columnData).size
  
  return {
    nullCount,
    uniqueCount,
    fillRate: Math.round((nonEmptyCount / totalRows) * 100)
  }
}

// 获取列类型样式类
function getColumnTypeClass(type) {
  const typeClasses = {
    'string': 'type-string',
    'number': 'type-number',
    'integer': 'type-integer',
    'date': 'type-date',
    'boolean': 'type-boolean',
    'category': 'type-category',
    'unknown': 'type-unknown'
  }
  return typeClasses[type] || 'type-unknown'
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

function handlePanelDrag(event) {
  if (!isDragging.value) return
  
  requestAnimationFrame(() => {
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
  
  // 设置拖拽数据
  const dragData = {
    type: 'column',
    column: column,
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
.file-structure-panel {
  position: fixed;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10001;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  will-change: transform, opacity;
}

.file-structure-panel.is-focused {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  transform: translateY(-2px);
}

.file-structure-panel:not(.is-focused) {
  opacity: 0.85;
}

.file-structure-panel.dragging {
  z-index: 10002;
  transform: rotate(1deg) scale(1.02);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  transition: none !important;
}

/* 暗黑模式适配 */
[data-theme="dark"] .file-structure-panel {
  background: var(--bg-color);
  border: 1px solid rgba(55, 65, 81, 0.3);
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  cursor: move;
  transition: background 0.2s ease;
}

.panel-header:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
}

.panel-header:active {
  cursor: grabbing;
}

[data-theme="dark"] .panel-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  pointer-events: none;
}

.panel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.panel-icon svg {
  width: 16px;
  height: 16px;
}

.panel-controls {
  display: flex;
  gap: 4px;
}

.control-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

[data-theme="dark"] .control-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.control-btn svg {
  width: 14px;
  height: 14px;
}

/* 面板内容 */
.panel-content {
  padding: 16px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

/* 文件摘要 */
.file-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .file-summary {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.summary-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

/* 列容器 */
.columns-container {
  flex: 1;
}

.columns-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .columns-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.columns-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.columns-count {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 列列表 */
.columns-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.column-item:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.column-item:active,
.column-item.dragging {
  cursor: grabbing;
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.4);
}

[data-theme="dark"] .column-item {
  background: rgba(55, 65, 81, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

[data-theme="dark"] .column-item:hover {
  background: rgba(55, 65, 81, 0.8);
  border-color: rgba(59, 130, 246, 0.4);
}

[data-theme="dark"] .column-item:active,
[data-theme="dark"] .column-item.dragging {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.column-info {
  flex: 1;
  min-width: 0;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.column-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.column-type {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* 列类型样式 */
.type-string {
  background: rgba(34, 197, 94, 0.15);
  color: #059669;
}

.type-number,
.type-integer {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.type-date {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.type-boolean {
  background: rgba(139, 92, 246, 0.15);
  color: #7c3aed;
}

.type-category {
  background: rgba(236, 72, 153, 0.15);
  color: #be185d;
}

.type-unknown {
  background: rgba(107, 114, 128, 0.15);
  color: #4b5563;
}

[data-theme="dark"] .type-string {
  background: rgba(34, 197, 94, 0.25);
  color: #22c55e;
}

[data-theme="dark"] .type-number,
[data-theme="dark"] .type-integer {
  background: rgba(59, 130, 246, 0.25);
  color: #60a5fa;
}

[data-theme="dark"] .type-date {
  background: rgba(245, 158, 11, 0.25);
  color: #fbbf24;
}

[data-theme="dark"] .type-boolean {
  background: rgba(139, 92, 246, 0.25);
  color: #a78bfa;
}

[data-theme="dark"] .type-category {
  background: rgba(236, 72, 153, 0.25);
  color: #f472b6;
}

[data-theme="dark"] .type-unknown {
  background: rgba(107, 114, 128, 0.25);
  color: #9ca3af;
}

.column-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sample-data {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sample-label {
  font-size: 10px;
  color: var(--text-secondary);
  min-width: 45px;
}

.sample-value {
  font-size: 11px;
  color: var(--text-color);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 4px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

[data-theme="dark"] .sample-value {
  background: rgba(255, 255, 255, 0.05);
}

.column-stats {
  display: flex;
  gap: 8px;
}

.stat-item {
  font-size: 10px;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.03);
  padding: 1px 4px;
  border-radius: 3px;
}

[data-theme="dark"] .stat-item {
  background: rgba(255, 255, 255, 0.03);
}

/* 拖拽手柄 */
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  opacity: 0.5;
}

.column-item:hover .drag-handle {
  opacity: 1;
  color: #3b82f6;
}

.drag-handle svg {
  width: 16px;
  height: 16px;
}

/* 拖拽预览样式 */
.drag-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.drag-preview-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-column-name {
  font-weight: 600;
}

.drag-column-type {
  font-size: 10px;
  opacity: 0.8;
  text-transform: uppercase;
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] .panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .file-structure-panel {
    width: calc(100vw - 40px) !important;
    max-width: 380px;
    left: 20px !important;
    right: 20px !important;
  }
  
  .panel-content {
    max-height: 50vh;
  }
  
  .file-summary {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .column-name {
    max-width: 120px;
  }
  
  .sample-value {
    max-width: 100px;
  }
}
</style>
