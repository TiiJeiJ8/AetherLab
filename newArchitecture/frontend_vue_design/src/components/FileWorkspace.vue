<template>
<div
v-if="workspaceFiles.length > 0"
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
ref="workspaceRef">
<div
    class="workspace-header"
    @mousedown.prevent="startDrag">
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
        class="workspace-action-btn preview-btn"
        @click="previewCurrentFile"
        title="Preview file">
        <span v-html="getThemeIcon('eye')"></span>
    </button>
    <button
        class="workspace-action-btn remove-btn"
        @click="removeFromWorkspace(currentIndex)"
        title="Remove from workspace">
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
        @click="currentIndex = index">
    </span>
    </div>
</div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { getThemeIcon } from '@/assets/JS/icons.js'

// Props
const props = defineProps({
    files: {
    type: Array,
    default: () => []
    }
})

// Emits
const emit = defineEmits(['remove', 'preview', 'clear'])

// 工作区文件列表
const workspaceFiles = ref([])
const currentIndex = ref(0)

// 拖拽相关状态
const isDragging = ref(false)
const isFocused = ref(true)
const dragOffset = ref({ x: 0, y: 0 })
const workspacePosition = ref({
    position: 'fixed',
    top: '10px',
    left: '200px'
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

// 格式化文件大小
function formatFileSize (bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取状态文本
function getStatusText (status) {
    const statusMap = {
        local: 'Local',
        uploading: 'Uploading',
        uploaded: 'Uploaded',
        operating: 'Operating',
        error: 'Error'
    }
    return statusMap[status] || 'Unknown'
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
.file-workspace {
    position: fixed;
    top: 10px;
    left: 260px;
    width: 220px;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(20px);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    z-index: 10000;
    padding: 6px 10px 10px 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    user-select: none;
    will-change: transform, opacity;
}

.file-workspace.is-focused {
    background: rgba(255, 255, 255, 0.85);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
    opacity: 0.95;
}

.file-workspace:not(.is-focused) {
    background: rgba(255, 255, 255, 0.3);
    opacity: 0.6;
}

/* 拖拽时的样式 - 提高性能 */
.file-workspace.dragging {
    z-index: 9999;
    transform: scale(1.02);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    transition: none !important;
    will-change: transform;
}

.file-workspace.dragging * {
    pointer-events: none;
}

.file-workspace.dragging .workspace-header {
    background: rgba(59, 130, 246, 0.15) !important;
    cursor: grabbing !important;
}

[data-theme="dark"] .file-workspace.dragging .workspace-header {
    background: rgba(96, 165, 250, 0.2) !important;
}

/* 暗黑模式适配 */
[data-theme="dark"] .file-workspace {
    background: var(--bg-color);
    border: 1px solid rgba(55, 65, 81, 0.4);
}

[data-theme="dark"] .file-workspace.is-focused {
    background: var(--bg-color);
    opacity: 0.95;
}

[data-theme="dark"] .file-workspace:not(.is-focused) {
    background: rgba(17, 24, 39, 0.25);
    opacity: 0.6;
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 8px 4px 6px 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    cursor: move;
    transition: background-color 0.15s ease;
    will-change: background-color;
    border-radius: 4px;
}

.workspace-header:hover {
    background: rgba(59, 130, 246, 0.05);
}

.workspace-header:active {
    background: rgba(59, 130, 246, 0.1);
    cursor: grabbing;
}

[data-theme="dark"] .workspace-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .workspace-header:hover {
    background: rgba(96, 165, 250, 0.1);
}

[data-theme="dark"] .workspace-header:active {
    background: rgba(96, 165, 250, 0.15);
}

.workspace-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
    pointer-events: none;
    flex: 1;
}

.workspace-title::after {
    content: '⋮⋮';
    margin-left: auto;
    color: var(--text-secondary);
    font-size: 14px;
    opacity: 0.5;
    pointer-events: none;
    transform: rotate(90deg);
    transition: opacity 0.2s ease, color 0.2s ease;
}

.workspace-header:hover .workspace-title::after {
    opacity: 0.8;
    color: #3b82f6;
}

[data-theme="dark"] .workspace-header:hover .workspace-title::after {
    color: #60a5fa;
}

.workspace-icon {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
}

.workspace-icon svg {
    width: 14px;
    height: 14px;
}

.file-counter {
    font-size: 10px;
    color: var(--text-secondary);
    background: rgba(59, 130, 246, 0.1);
    padding: 1px 4px;
    border-radius: 3px;
    pointer-events: none;
}

.workspace-content {
    margin-bottom: 8px;
}

.file-info {
    margin-bottom: 6px;
}

.file-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 3px;
    word-break: break-word;
    line-height: 1.2;
}

.file-meta {
    display: flex;
    gap: 4px;
    font-size: 10px;
    color: var(--text-secondary);
    flex-wrap: wrap;
}

.file-size, .file-type {
    padding: 1px 4px;
    background: rgba(107, 114, 128, 0.1);
    border-radius: 3px;
}

.file-status {
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: 500;
    font-size: 10px;
}

.file-status.local {
    background: rgba(251, 191, 36, 0.2);
    color: #92400e;
}

.file-status.uploading {
    background: rgba(59, 130, 246, 0.2);
    color: #1e40af;
}

.file-status.uploaded {
    background: rgba(16, 185, 129, 0.2);
    color: #065f46;
}

.file-status.operating {
    background: rgba(139, 92, 246, 0.2);
    color: #6b46c1;
}

.file-status.error {
    background: rgba(239, 68, 68, 0.2);
    color: #b91c1c;
}

/* 暗黑模式下的状态颜色 */
[data-theme="dark"] .file-status.local {
    background: rgba(251, 191, 36, 0.3);
    color: #fcd34d;
}

[data-theme="dark"] .file-status.uploading {
    background: rgba(59, 130, 246, 0.3);
    color: #93c5fd;
}

[data-theme="dark"] .file-status.uploaded {
    background: rgba(16, 185, 129, 0.3);
    color: #6ee7b7;
}

[data-theme="dark"] .file-status.operating {
    background: rgba(139, 92, 246, 0.3);
    color: #c4b5fd;
}

[data-theme="dark"] .file-status.error {
    background: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
}

.workspace-actions {
    display: flex;
    gap: 4px;
}

.workspace-action-btn {
    background: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 2px;
    color: var(--text-color);
}

.workspace-action-btn span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
}

.workspace-action-btn svg {
    width: 12px;
    height: 12px;
    stroke: currentColor;
    transition: all 0.2s ease;
}

[data-theme="dark"] .workspace-action-btn {
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--text-color);
}

.workspace-action-btn:hover {
    transform: translateY(-1px);
}

.remove-btn {
    color: #6b7280;
}

.remove-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
}

.preview-btn {
    color: #6b7280;
}

.preview-btn:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    color: #3b82f6;
}

[data-theme="dark"] .remove-btn {
    color: #9ca3af;
}

[data-theme="dark"] .remove-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #f87171;
    color: #f87171;
}

[data-theme="dark"] .preview-btn {
    color: #9ca3af;
}

[data-theme="dark"] .preview-btn:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: #60a5fa;
    color: #60a5fa;
}

.workspace-navigation {
    display: flex;
    justify-content: center;
    padding-top: 6px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .workspace-navigation {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-dots {
    display: flex;
    gap: 4px;
}

.nav-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s;
}

[data-theme="dark"] .nav-dot {
    background: rgba(255, 255, 255, 0.2);
}

.nav-dot.active {
    background: #3b82f6;
    transform: scale(1.3);
}

.nav-dot:hover {
    transform: scale(1.2);
}

/* 响应式适配 */
@media (max-width: 768px) {
    .file-workspace {
        width: 180px;
        top: 8px;
        left: 220px;
    }

    .workspace-title {
        font-size: 10px;
    }

    .file-name {
        font-size: 10px;
    }

    .file-meta {
        font-size: 8px;
    }

    .workspace-action-btn {
        font-size: 8px;
        padding: 2px 4px;
    }
}

/* 防止拖拽时选中文本 */
.file-workspace * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

/* SVG 图标适配 */
.file-workspace svg {
    display: block;
    flex-shrink: 0;
}

/* 确保 SVG 图标在不同主题下都能正确显示 */
.file-workspace .workspace-icon svg,
.file-workspace .workspace-action-btn svg {
    transition: all 0.2s ease;
}

/* 针对特定按钮的 SVG 样式优化 */
.remove-btn svg {
    stroke-width: 2.5;
}

.preview-btn svg {
    stroke-width: 2;
}

.workspace-icon svg {
    fill: currentColor;
    stroke: currentColor;
}
</style>