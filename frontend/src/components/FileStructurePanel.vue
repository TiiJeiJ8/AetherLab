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
import { getThemeIcon } from '@/assets/JS/SVG/icons.js'

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

  // 设置拖拽数据， file 和 index 字段，确保唯一性
  const dragData = {
    type: 'column',
    column: {
      ...column,
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
@import '../assets/CSS/FileStructurePanel.css';
</style>
