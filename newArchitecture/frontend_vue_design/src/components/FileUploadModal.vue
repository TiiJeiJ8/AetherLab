<template>
<transition name="modal-expand" appear>
    <div v-if="show" class="file-modal" @click.self="onClose">
        <div class="file-content">
            <div class="file-header">
                <div class="header-left">
                    <span>File Manager</span>
                    <div class="connection-status">
                        <span class="status-dot" :class="{ 'connected': isBackendConnected }"></span>
                        <span class="status-text">{{ isBackendConnected ? 'Connected' : 'Offline' }}</span>
                    </div>
                </div>
                <div class="header-right">
                    <button class="refresh-btn" @click="refreshFiles" title="刷新文件列表">🔄</button>
                    <button v-if="stats.notUploadedCount > 0"
                            class="sync-all-btn"
                            @click="syncAllFiles"
                            :disabled="!isBackendConnected"
                            title="同步所有文件到后端">
                        同步全部 ({{ stats.notUploadedCount }})
                    </button>
                    <button class="close-btn" @click="onClose">×</button>
                </div>
            </div>

            <!-- 主要内容区域 -->
            <div class="main-content">
                <!-- 左侧：拖拽上传区域 -->
                <div class="upload-section">
                    <div class="upload-area"
                            :class="{ 'dragging': isDragging }"
                            @drop.prevent="handleDrop"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false">
                        <input type="file"
                                ref="fileInput"
                                @change="handleFileSelect"
                                accept=".csv,.xlsx,.xls"
                                multiple
                                class="file-input" />
                        <div class="upload-tip">
                            <i class="upload-icon">📁</i>
                            <p>Drag files here or <button @click="triggerFileInput">click to select</button></p>
                            <p class="sub-tip">Supports CSV、XLSX、XLS formats</p>
                        </div>
                    </div>
                </div>

                <!-- 右侧：文件列表 -->
                <div class="file-section">
                    <!-- 统计信息 -->
                    <div class="stats-bar" v-if="files.length">
                        <div class="stat-item">
                            <span class="stat-label">总文件数:</span>
                            <span class="stat-value">{{ stats.totalFiles }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">总大小:</span>
                            <span class="stat-value">{{ stats.totalSize }}</span>
                        </div>
                        <div class="stat-item" v-if="stats.notUploadedCount > 0">
                            <span class="stat-label">未上传:</span>
                            <span class="stat-value">{{ stats.notUploadedCount }}</span>
                        </div>
                    </div>

                    <!-- 文件列表 -->
                    <div class="file-list" v-if="files.length">
                        <div v-for="(file, idx) in files"
                                :key="file.id"
                                class="file-item">
                            <div class="file-info">
                                <div class="file-basic">
                                    <div class="file-name-section">
                                        <span class="file-name"
                                                :class="{ 'editing': file.isEditing }"
                                                @dblclick="startRename(idx)">
                                            <template v-if="!file.isEditing">
                                                {{ file.name }}
                                            </template>
                                            <input v-else
                                                    v-model="file.newName"
                                                    @blur="finishRename(idx)"
                                                    @keyup.enter="finishRename(idx)"
                                                    ref="renameInput"
                                                    type="text" />
                                        </span>
                                        <span class="file-status" :class="file.status">
                                            {{ getStatusIcon(file.status) }} {{ getStatusText(file.status) }}
                                        </span>
                                    </div>
                                    <div class="file-details">
                                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                                        <span class="file-type">{{ file.name.split('.').pop().toUpperCase() }}</span>
                                        <span class="file-dimensions" v-if="file.rows && file.columns">
                                            {{ file.rows }} x {{ file.columns }}
                                        </span>
                                        <span class="file-created">
                                            {{ new Date(file.createdAt).toLocaleString() }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="file-actions">
                                <button @click="previewFile(idx)"
                                        title="预览数据"
                                        class="action-btn preview-btn">
                                    👁️
                                </button>
                                <button v-if="file.status === 'local'"
                                        @click="syncFile(idx)"
                                        title="同步到后端"
                                        class="action-btn sync-btn"
                                        :disabled="!isBackendConnected">
                                    ⬆️
                                </button>
                                <button @click="unloadFile(idx)"
                                        title="删除文件"
                                        class="action-btn delete-btn">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!isLoading" class="no-files">
                        <p>暂无文件，请在左侧上传文件</p>
                    </div>
                    <div v-else class="loading">
                        <p>加载中...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 数据预览组件 -->
        <DataPreviewModal
            v-if="currentPreviewFile"
            :show="showPreview"
            :current-file="currentPreviewFile"
            :preview-data="previewData"
            :is-side-preview="true"
            @close="closePreview"
        />
    </div>
</transition>
</template>

<script setup>
/* eslint-disable */
import { ref, nextTick, onMounted, computed } from 'vue'
import DataPreviewModal from './DataPreviewModal.vue'
import { 
    uploadFile, 
    deleteFile, 
    renameFile, 
    getFilePreview,
    getAllFiles,
    checkBackendConnection,
    getBackendStatus,
    syncFileToBackend
} from '../services/FileServices.js'

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(['close'])

const isDragging = ref(false)
const files = ref([])
const showPreview = ref(false)
const currentPreviewFile = ref(null)
const previewData = ref([])
const isBackendConnected = ref(false)
const isLoading = ref(false)

// 计算统计信息
const stats = computed(() => {
    const totalFiles = files.value.length
    const totalSize = files.value.reduce((sum, file) => sum + (file.size || 0), 0)
    const notUploadedCount = files.value.filter(file => file.status === 'local').length
    
    return {
        totalFiles,
        totalSize: formatFileSize(totalSize),
        notUploadedCount
    }
})

// 页面加载时检查后端连接并加载文件
onMounted(async () => {
    await checkConnectionStatus()
    await loadFiles()
})

// 检查后端连接状态
async function checkConnectionStatus() {
    isBackendConnected.value = await checkBackendConnection()
}

// 加载所有文件
async function loadFiles() {
    isLoading.value = true
    try {
        const allFiles = await getAllFiles()
        files.value = allFiles.map(file => ({
            ...file,
            isEditing: false,
            newName: file.name
        }))
    } catch (error) {
        console.error('加载文件列表失败:', error)
    } finally {
        isLoading.value = false
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 触发文件选择
function triggerFileInput() {
    document.querySelector('.file-input').click()
}

// 处理文件选择
async function handleFileSelect(event) {
    const newFiles = Array.from(event.target.files)
    await processFiles(newFiles)
}

// 处理拖拽
async function handleDrop(event) {
    isDragging.value = false
    const newFiles = Array.from(event.dataTransfer.files)
    await processFiles(newFiles)
}

// 重命名相关
function startRename(idx) {
    files.value[idx].isEditing = true
    files.value[idx].newName = files.value[idx].name
    nextTick(() => {
        const inputs = document.querySelectorAll('.file-item input')
        if (inputs[idx]) {
            inputs[idx].focus()
        }
    })
}

async function finishRename(idx) {
    const file = files.value[idx]
    if (file.newName && file.newName !== file.name) {
        try {
            await renameFile(file.id, file.newName)
            file.name = file.newName
        } catch (error) {
            console.error('重命名失败:', error)
            alert('重命名失败：' + error.message)
            file.newName = file.name // 恢复原名
        }
    }
    file.isEditing = false
}

// 删除文件
async function unloadFile(idx) {
    const file = files.value[idx]
    if (confirm(`确定要删除文件 "${file.name}" 吗？`)) {
        try {
            await deleteFile(file.id)
            files.value.splice(idx, 1)
        } catch (error) {
            console.error('删除失败:', error)
            alert('删除失败：' + error.message)
        }
    }
}

// 同步文件到后端
async function syncFile(idx) {
    const file = files.value[idx]
    try {
        file.status = 'uploading'
        const syncedFile = await syncFileToBackend(file.id)
        files.value[idx] = {
            ...syncedFile,
            isEditing: false,
            newName: syncedFile.name
        }
    } catch (error) {
        console.error('同步失败:', error)
        alert('同步失败：' + error.message)
        file.status = 'local'
    }
}

// 获取文件详细信息
function getFileDetails(file) {
    return {
        name: file.name,
        size: formatFileSize(file.size),
        rows: file.rows || 0,
        columns: file.columns || 0,
        type: file.name.split('.').pop().toUpperCase(),
        status: getStatusText(file.status),
        id: file.id,
        createdAt: new Date(file.createdAt).toLocaleString()
    }
}

// 预览文件
async function previewFile(idx) {
    const file = files.value[idx]
    try {
        const previewResult = await getFilePreview(file.id)
        currentPreviewFile.value = file
        previewData.value = previewResult.data
        showPreview.value = true
    } catch (error) {
        console.error('预览失败:', error)
        alert('预览失败：' + error.message)
    }
}

function closePreview() {
    showPreview.value = false
    currentPreviewFile.value = null
    previewData.value = []
}

function onClose() {
    emit('close')
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'local': '本地缓存',
        'uploading': '上传中',
        'uploaded': '已上传',
        'error': '出错'
    }
    return statusMap[status] || '未知'
}

// 获取状态图标
function getStatusIcon(status) {
    const iconMap = {
        'local': '💾',
        'uploading': '⏳',
        'uploaded': '✅',
        'error': '❌'
    }
    return iconMap[status] || '❓'
}

// 批量同步所有本地文件
async function syncAllFiles() {
    const localFiles = files.value.filter(file => file.status === 'local')
    
    if (localFiles.length === 0) {
        alert('没有需要同步的文件')
        return
    }
    
    if (!isBackendConnected.value) {
        alert('后端未连接，无法同步')
        return
    }
    
    if (confirm(`确定要同步 ${localFiles.length} 个文件到后端吗？`)) {
        for (let i = 0; i < localFiles.length; i++) {
            const fileIndex = files.value.findIndex(f => f.id === localFiles[i].id)
            if (fileIndex !== -1) {
                await syncFile(fileIndex)
            }
        }
    }
}

// 刷新文件列表
async function refreshFiles() {
    await checkConnectionStatus()
    await loadFiles()
}

// 处理文件
async function processFiles(newFiles) {
    const validFiles = newFiles.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase()
        return ['csv', 'xlsx', 'xls'].includes(ext)
    })

    if (validFiles.length !== newFiles.length) {
        alert('只支持 CSV、XLSX、XLS 格式的文件')
    }

    for (const file of validFiles) {
        try {
            // 添加文件到列表（正在上传状态）
            const fileItem = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                status: 'uploading',
                isEditing: false,
                newName: file.name,
                rows: 0,
                columns: 0,
                createdAt: new Date().toISOString()
            }
            files.value.push(fileItem)
            
            // 调用智能上传 API
            const uploadedFile = await uploadFile(file)
            
            // 更新文件状态
            const index = files.value.findIndex(f => f.id === fileItem.id)
            if (index !== -1) {
                files.value[index] = {
                    ...uploadedFile,
                    isEditing: false,
                    newName: uploadedFile.name
                }
            }
        } catch (error) {
            console.error('文件处理失败:', error)
            // 更新失败状态
            const index = files.value.findIndex(f => f.name === file.name)
            if (index !== -1) {
                files.value[index].status = 'error'
            }
        }
    }
}
</script>

<style scoped>
/* 模态框基础样式 */
.file-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
}

.file-content {
    background: var(--bg-color, #fff);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: min(90vw, 900px);
    height: min(90vh, 800px);
    max-height: min(90vh, 800px);
    border-radius: 16px;
    position: relative;
}

/* 头部样式 */
.file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
    position: relative;
}

.file-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 16px 16px 0 0;
}

@keyframes slideInHeader {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header-left {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header-left span {
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.connection-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9ca3af;
    transition: background-color 0.3s;
}

.status-dot.connected {
    background: #22c55e;
}

.status-text {
    color: #666;
    font-weight: 500;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.refresh-btn, .sync-all-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    transform: translateY(0);
}

.refresh-btn {
    background: #3b82f6;
    color: white;
}

.refresh-btn:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.sync-all-btn {
    background: #10b981;
    color: white;
}

.sync-all-btn:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.sync-all-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #6b7280;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1;
}

.close-btn:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    transform: scale(1.1);
}

/* 主要内容区域 */
.main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

@keyframes slideInContent {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 左侧上传区域 */
.upload-section {
    width: 300px;
    padding: 20px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 右侧文件列表区域 */
.file-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 上传区域样式 */
.upload-area {
    width: 100%;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.upload-area:hover,
.upload-area.dragging {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.file-input {
    display: none;
}

.upload-tip {
    color: #666;
}

.upload-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
    animation: bounceIcon 2s ease-in-out infinite;
}

@keyframes bounceIcon {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-8px);
    }
    60% {
        transform: translateY(-4px);
    }
}

.upload-tip p {
    margin: 8px 0;
}

.upload-tip button {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
    font-size: inherit;
}

.sub-tip {
    font-size: 12px;
    color: #999;
}

/* 统计信息样式 */
.stats-bar {
    display: flex;
    gap: 20px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
    animation: slideInStats 0.5s ease-out 1.1s both;
}

/* 文件列表样式 */
.file-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.file-list .file-item {
    animation: slideInFile 0.4s ease-out 1.2s backwards;
}

.file-list .file-item:nth-child(1) { animation-delay: 1.2s; }
.file-list .file-item:nth-child(2) { animation-delay: 1.25s; }
.file-list .file-item:nth-child(3) { animation-delay: 1.3s; }
.file-list .file-item:nth-child(4) { animation-delay: 1.35s; }
.file-list .file-item:nth-child(5) { animation-delay: 1.4s; }
.file-list .file-item:nth-child(n+6) { animation-delay: 1.45s; }

.no-files, .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 14px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-label {
    font-size: 14px;
    color: #666;
}

.stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item:hover {
    background: #f8f9fa;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.file-item:last-child {
    border-bottom: none;
}

.file-info {
    flex: 1;
}

.file-basic {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.file-name-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.file-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.file-name.editing input {
    border: 1px solid #3b82f6;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 16px;
    outline: none;
}

.file-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.file-status.local {
    background: #fef3c7;
    color: #92400e;
}

.file-status.uploading {
    background: #dbeafe;
    color: #1e40af;
}

.file-status.uploaded {
    background: #d1fae5;
    color: #065f46;
}

.file-status.error {
    background: #fee2e2;
    color: #b91c1c;
}

.file-details {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #666;
}

.file-details span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.file-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
}

.action-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active:not(:disabled) {
    transform: translateY(0);
}

.preview-btn {
    background: #3b82f6;
    color: white;
}

.preview-btn:hover {
    background: #2563eb;
}

.sync-btn {
    background: #10b981;
    color: white;
}

.sync-btn:hover:not(:disabled) {
    background: #059669;
}

.sync-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
}

.delete-btn {
    background: #ef4444;
    color: white;
}

.delete-btn:hover {
    background: #dc2626;
}

/* 动画效果 - 从一条线向上下展开 */
.modal-expand-enter-active {
    animation: expandModal 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

.modal-expand-enter-active .file-content {
    animation: expandContent 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

.modal-expand-leave-active {
    animation: collapseModal 0.5s cubic-bezier(0.4, 0, 1, 1) forwards;
}

.modal-expand-leave-active .file-content {
    animation: collapseContent 0.5s cubic-bezier(0.4, 0, 1, 1) forwards;
}

/* 在动画过程中完全隐藏内部元素 */
.modal-expand-enter-active .file-header,
.modal-expand-enter-active .main-content,
.modal-expand-enter-active .stats-bar,
.modal-expand-enter-active .file-item,
.modal-expand-enter-active .upload-area {
    opacity: 0 !important;
    visibility: hidden !important;
    transition: none !important;
    animation: none !important;
}

/* 动画完成后显示内部元素 */
.file-header {
    animation: fadeInElement 0.4s ease-out 0.8s both;
}

.main-content {
    animation: fadeInElement 0.5s ease-out 0.85s both;
}

.stats-bar {
    animation: fadeInElement 0.3s ease-out 0.9s both;
}

.file-list .file-item {
    animation: fadeInElement 0.3s ease-out 0.95s both;
}

.upload-area {
    animation: fadeInElement 0.4s ease-out 0.87s both;
}

@keyframes fadeInElement {
    from {
        opacity: 0;
        transform: translateY(15px) scale(0.95);
        visibility: hidden;
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        visibility: visible;
    }
}

@keyframes expandModal {
    0% {
        opacity: 0;
        backdrop-filter: blur(0px);
    }
    20% {
        opacity: 0.4;
        backdrop-filter: blur(1px);
    }
    100% {
        opacity: 1;
        backdrop-filter: blur(3px);
    }
}

@keyframes expandContent {
    0% {
        height: 2px;
        width: 300px;
        border-radius: 1px;
        overflow: hidden;
        opacity: 0.8;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.9);
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        transform: translateY(0);
    }
    25% {
        height: 60px;
        width: min(40vw, 400px);
        border-radius: 6px;
        opacity: 0.85;
        background: linear-gradient(135deg, #f8f9fa, var(--bg-color, #fff));
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    50% {
        height: min(50vh, 400px);
        width: min(70vw, 700px);
        border-radius: 12px;
        opacity: 0.9;
        background: var(--bg-color, #fff);
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    75% {
        height: min(80vh, 700px);
        width: min(85vw, 850px);
        border-radius: 14px;
        opacity: 0.95;
        background: var(--bg-color, #fff);
        box-shadow: 0 15px 50px rgba(0,0,0,0.2);
    }
    100% {
        height: min(90vh, 800px);
        width: min(90vw, 900px);
        border-radius: 16px;
        opacity: 1;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        background: var(--bg-color, #fff);
        transform: translateY(0);
    }
}

@keyframes collapseModal {
    0% {
        opacity: 1;
        backdrop-filter: blur(3px);
    }
    80% {
        opacity: 0.4;
        backdrop-filter: blur(1px);
    }
    100% {
        opacity: 0;
        backdrop-filter: blur(0px);
    }
}

@keyframes collapseContent {
    0% {
        height: min(90vh, 800px);
        width: min(90vw, 900px);
        border-radius: 16px;
        opacity: 1;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }
    25% {
        height: min(60vh, 500px);
        width: min(70vw, 700px);
        border-radius: 12px;
        opacity: 0.8;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    50% {
        height: 150px;
        width: min(50vw, 400px);
        border-radius: 8px;
        opacity: 0.6;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    75% {
        height: 40px;
        width: min(30vw, 250px);
        border-radius: 4px;
        opacity: 0.4;
        box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
    }
    100% {
        height: 1px;
        width: 150px;
        border-radius: 0.5px;
        opacity: 0.2;
        overflow: hidden;
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    }
}

@keyframes slideInFile {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInUpload {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInStats {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式适配 */
@media (max-width: 768px) {
    .file-content {
        width: 95vw;
        max-height: 95vh;
    }
    
    .main-content {
        flex-direction: column;
    }
    
    .upload-section {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
        padding: 15px;
    }
    
    .upload-area {
        padding: 20px 15px;
    }
    
    .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .stats-bar {
        flex-direction: column;
        gap: 8px;
        padding: 12px 15px;
    }
    
    .file-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 15px;
    }
    
    .file-actions {
        align-self: flex-end;
    }
    
    .file-details {
        flex-wrap: wrap;
        gap: 8px;
    }
}
</style>
