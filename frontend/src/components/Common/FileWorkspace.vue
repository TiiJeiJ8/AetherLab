<template>
  <transition name="fade-panel">
    <div
      v-show="workspaceFiles.length > 0"
      class="file-workspace"
      :class="{
        'is-focused': isFocused,
        'dragging': isDragging
      }"
      :style="workspacePosition"
      @wheel.prevent="handleWheel"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
      ref="workspaceRef"
    >
        <div
        class="workspace-header"
        @mousedown.prevent="startDrag"
        >
        <div class="workspace-title">
            <span class="workspace-icon" v-html="getThemeIcon('folder')"></span>
            <span>Workspace</span>
            <span class="file-counter">{{ currentIndex + 1 }}/{{ workspaceFiles.length }}</span>
        </div>
        </div>

        <div class="workspace-content" v-if="currentFile">
        <div class="file-info">
            <div class="file-name">{{ currentFile.name }}</div>
            <div class="file-meta">
            <span class="file-size">{{ formatFileSize(currentFile.size) }}</span>
            <span class="file-type">{{ currentFile.name.split('.').pop().toUpperCase() }}</span>
            <span class="file-status" :class="currentFile.status">
                {{ getStatusText(currentFile.status) }}
            </span>
            </div>
        </div>

        <div class="workspace-actions">
            <button
            class="floating-workspace-action-btn structure-btn"
            @click="showFileStructure"
            title="Show file structure"
            >
            <span v-html="getThemeIcon('structure')"></span>
            </button>
            <button
            class="floating-workspace-action-btn preview-workspace-btn"
            @click="previewCurrentFile"
            title="Preview file"
            >
            <span v-html="getThemeIcon('eye')"></span>
            </button>
            <button
            class="floating-workspace-action-btn remove-workspace-btn"
            @click="removeFromWorkspace(currentIndex)"
            title="Remove from workspace"
            >
            <span v-html="getThemeIcon('remove')"></span>
            </button>
        </div>
        </div>

        <div class="workspace-navigation" v-if="workspaceFiles.length > 1">
        <div class="nav-dots">
            <span
            v-for="(file, index) in workspaceFiles"
            :key="file.id"
            class="nav-dot"
            :class="{ active: index === currentIndex }"
            @click="currentIndex = index"
            >
            </span>
        </div>
        </div>
    </div>
  </transition>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { getThemeIcon } from '@/assets/JS/SVG/icons.js'

// Props
const props = defineProps({
    files: {
    type: Array,
    default: () => []
    }
})

// Emits
const emit = defineEmits(['remove', 'preview', 'clear', 'show-structure'])

// 工作区文件列表
const workspaceFiles = ref([])
const currentIndex = ref(0)

// 拖拽相关状态
const isDragging = ref(false)
const isFocused = ref(true)
const dragOffset = ref({ x: 0, y: 0 })
const workspacePosition = ref({
    position: 'fixed',
    top: '3%',
    left: '5%',
})

// DOM 引用
const workspaceRef = ref(null)

// 当前显示的文件
const currentFile = computed(() => {
    return workspaceFiles.value[currentIndex.value] || null
})

// 监听传入的文件列表变化
watch(() => props.files, (newFiles) => {
    workspaceFiles.value = [...newFiles]
    if (currentIndex.value >= workspaceFiles.value.length) {
        currentIndex.value = Math.max(0, workspaceFiles.value.length - 1)
    }
}, { immediate: true })

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

// 拖拽功能
function startDrag(event) {
    isDragging.value = true
    isFocused.value = true
    
    const rect = workspaceRef.value.getBoundingClientRect()
    dragOffset.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
    
    // 立即添加全局事件监听，提高响应速度
    document.addEventListener('mousemove', handleDrag, { passive: false })
    document.addEventListener('mouseup', stopDrag, { passive: false })
    
    // 防止默认行为和事件冒泡
    event.preventDefault()
    event.stopPropagation()
    
    // 添加拖拽类名以提供视觉反馈
    workspaceRef.value.classList.add('dragging')
}

function handleDrag(event) {
    if (!isDragging.value) return
    
    // 使用 requestAnimationFrame 确保流畅性
    requestAnimationFrame(() => {
        const newX = event.clientX - dragOffset.value.x
        const newY = event.clientY - dragOffset.value.y
        
        // 确保窗口不会拖拽到屏幕外
        const maxX = window.innerWidth - 220
        const maxY = window.innerHeight - 200
        
        const clampedX = Math.max(0, Math.min(newX, maxX))
        const clampedY = Math.max(0, Math.min(newY, maxY))
        
        workspacePosition.value = {
            position: 'fixed',
            top: `${clampedY}px`,
            left: `${clampedX}px`,
            transform: 'none' // 确保没有额外的transform影响位置
        }
    })
    
    event.preventDefault()
}

function stopDrag(event) {
    isDragging.value = false
    
    // 立即移除事件监听
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
    
    // 移除拖拽类名
    if (workspaceRef.value) {
        workspaceRef.value.classList.remove('dragging')
    }
    
    // 稍微延迟检查焦点状态，避免立即失焦
    setTimeout(() => {
        if (!isDragging.value) {
            isFocused.value = false
        }
    }, 150)
    
    event.preventDefault()
}

// 组件挂载时添加全局点击监听
onMounted(() => {
    document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleGlobalClick)
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
})

// 全局点击处理
function handleGlobalClick(event) {
    if (workspaceRef.value && !workspaceRef.value.contains(event.target)) {
        isFocused.value = false
    }
}

// 处理滚轮事件
function handleWheel (event) {
    if (workspaceFiles.value.length <= 1) return

    const delta = event.deltaY
    if (delta > 0) {
        // 向下滚动，切换到下一个文件
        currentIndex.value = (currentIndex.value + 1) % workspaceFiles.value.length
    } else {
        // 向上滚动，切换到上一个文件
        currentIndex.value = currentIndex.value === 0
        ? workspaceFiles.value.length - 1
        : currentIndex.value - 1
    }
}

// 从工作区移除文件
function removeFromWorkspace (index) {
    const removedFile = workspaceFiles.value[index]
    workspaceFiles.value.splice(index, 1)

    // 调整当前索引
    if (currentIndex.value >= workspaceFiles.value.length) {
        currentIndex.value = Math.max(0, workspaceFiles.value.length - 1)
    }

    emit('remove', removedFile)
}

// 清空工作区
function clearWorkspace () {
    workspaceFiles.value = []
    currentIndex.value = 0
    emit('clear')
}

// 预览当前文件
function previewCurrentFile () {
    if (currentFile.value) {
        emit('preview', currentFile.value)
    }
}

// 显示文件结构
function showFileStructure() {
    if (currentFile.value) {
        emit('show-structure', currentFile.value)
    }
}

// 格式化文件大小
function formatFileSize (bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取状态文本（仅本地缓存状态）
function getStatusText (status) {
    const statusMap = {
        local: 'Local Cache',
        error: 'Error'
    }
    return statusMap[status] || 'Local Cache'
}

// 暴露方法给父组件
defineExpose({
    addFile: (file) => {
        // 检查文件是否已经在工作区
        const exists = workspaceFiles.value.find(f => f.id === file.id)
        if (!exists) {
        workspaceFiles.value.push(file)
        }
    },
    removeFile: (fileId) => {
        const index = workspaceFiles.value.findIndex(f => f.id === fileId)
        if (index !== -1) {
        removeFromWorkspace(index)
        }
    },
    clearAll: () => {
        clearWorkspace()
    }
})
</script>

<style scoped>
@import '../../assets/CSS/FileWorkspace.css';
</style>