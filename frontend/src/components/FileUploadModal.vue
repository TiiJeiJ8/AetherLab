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
                    <button class="refresh-btn" @click="refreshFiles" title="Refresh file list">
                        <span v-html="getThemeIcon('refresh')"></span>
                    </button>
                    <button v-if="stats.notUploadedCount > 0"
                            class="sync-all-btn"
                            @click="syncAllFiles"
                            :disabled="!isBackendConnected"
                            title="Sync all files to backend">
                        Sync All ({{ stats.notUploadedCount }})
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
                            <div class="upload-icon" v-html="getThemeIcon('upload')"></div>
                            <p>Drag files here or <button @click="triggerFileInput">Click to select</button></p>
                            <p class="sub-tip">Supports CSV、XLSX、XLS formats</p>
                        </div>
                    </div>
                </div>

                <!-- 右侧：文件列表 -->
                <div class="file-section">
                    <!-- 统计信息 -->
                    <div class="stats-bar" v-if="files.length">
                        <div class="stat-item">
                            <span class="stat-label">Total Files:</span>
                            <span class="stat-value">{{ stats.totalFiles }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Size:</span>
                            <span class="stat-value">{{ stats.totalSize }}</span>
                        </div>
                        <div class="stat-item" v-if="stats.notUploadedCount > 0">
                            <span class="stat-label">Not Uploaded:</span>
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
                                                :title="file.name"
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
                                            <span v-html="getStatusIcon(file.status)"></span>
                                            {{ getStatusText(file.status) }}
                                        </span>
                                        <!-- 操作状态标记 -->
                                        <div v-if="file.status === 'operating'" class="operating-mark" title="File is being operated"></div>
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
                                    <!-- 上传进度条 -->
                                    <div v-if="file.status === 'uploading'" class="upload-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" :style="{ width: (file.uploadProgress || 0) + '%' }"></div>
                                        </div>
                                        <span class="progress-text">{{ file.uploadProgress || 0 }}%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="file-actions">
                                <button @click="addToWorkspace(idx)"
                                        title="Add to workspace"
                                        class="action-btn workspace-btn"
                                        :disabled="isInWorkspace(file.id) || file.status === 'uploading'">
                                    <span v-html="getThemeIcon('folder')"></span>
                                </button>
                                <button @click="previewFile(idx)"
                                        title="Preview data"
                                        class="action-btn preview-btn"
                                        :disabled="file.status === 'uploading'">
                                    <span v-html="getThemeIcon('preview')"></span>
                                </button>
                                <button v-if="file.status === 'local'"
                                        @click="syncFile(idx)"
                                        title="Sync to backend"
                                        class="action-btn sync-btn"
                                        :disabled="!isBackendConnected">
                                    <span v-html="getThemeIcon('sync')"></span>
                                </button>
                                <button v-if="file.status === 'uploading'"
                                        @click="cancelFileUpload(idx)"
                                        title="Cancel upload"
                                        class="action-btn cancel-btn">
                                    <span v-html="getThemeIcon('close')"></span>
                                </button>
                                <button v-if="file.status !== 'uploading'"
                                        @click="unloadFile(idx)"
                                        title="Delete file"
                                        class="action-btn delete-btn">
                                    <span v-html="getThemeIcon('delete')"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!isLoading" class="no-files">
                        <p>No files yet, please upload files on the left</p>
                    </div>
                    <div v-else class="loading">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>

            <!-- 工作区管理区域 -->
            <div class="workspace-management" v-if="workspaceFiles.length > 0">
                <div class="workspace-header">
                    <div class="workspace-title">
                        <span class="workspace-icon">📁</span>
                        <span class="workspace-count">{{ workspaceFiles.length }}</span>
                    </div>
                    <button class="clear-workspace-btn" @click="clearWorkspace" title="Clear all files">
                        <span v-html="getThemeIcon('delete')"></span>
                    </button>
                </div>
                <div class="workspace-file-list">
                    <div v-for="(file, idx) in workspaceFiles"
                            :key="file.id"
                            class="workspace-file-item">
                        <div class="workspace-file-name" :title="file.name">
                            {{ file.name }}
                        </div>
                        <div class="workspace-file-actions">
                            <button @click="previewWorkspaceFile(idx)"
                                    title="Preview"
                                    class="workspace-action-btn">
                                <span v-html="getThemeIcon('preview')"></span>
                            </button>
                            <button @click="removeFromWorkspace(idx)"
                                    title="Remove"
                                    class="workspace-action-btn">
                                <span v-html="getThemeIcon('delete')"></span>
                            </button>
                        </div>
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
import { ref, nextTick, onMounted, computed, watch } from 'vue'
import DataPreviewModal from './DataPreviewModal.vue'
import { getThemeIcon } from '../assets/JS/icons.js'
import {
    uploadFile,
    deleteFile,
    renameFile,
    getFilePreview,
    getAllFiles,
    checkBackendConnection,
    getBackendStatus,
    syncFileToBackend,
    cancelUpload
} from '../services/FileServices.js'

const props = defineProps({
    show: Boolean,
    workspaceFiles: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'workspace-updated'])

const isDragging = ref(false)
const files = ref([])
const workspaceFiles = ref([])
const showPreview = ref(false)
const currentPreviewFile = ref(null)
const previewData = ref([])
const isBackendConnected = ref(false)
const isLoading = ref(false)

// 监听 props 中的工作区文件变化
watch(() => props.workspaceFiles, (newFiles) => {
    console.log('FileUploadModal: workspaceFiles prop changed:', newFiles)
    if (newFiles) {
        workspaceFiles.value = [...newFiles]
    }
}, { immediate: true })

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
        }))        } catch (error) {
            console.error('Load files failed:', error)
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
            console.error('Rename failed:', error)
            alert('Rename failed: ' + error.message)
            file.newName = file.name
        }
    }
    file.isEditing = false
}

// 删除文件
async function unloadFile(idx) {
    const file = files.value[idx]
    if (confirm(`Are you sure you want to delete file "${file.name}"?`)) {
        try {
            await deleteFile(file.id)
            files.value.splice(idx, 1)
        } catch (error) {
            console.error('Delete failed:', error)
            alert('Delete failed: ' + error.message)
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
        console.error('Sync failed:', error)
        alert('Sync failed: ' + error.message)
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
        console.error('Preview failed:', error)
        alert('Preview failed: ' + error.message)
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
        'local': 'Local Cache',
        'uploading': 'Uploading',
        'uploaded': 'Uploaded',
        'operating': 'Operating',
        'error': 'Error'
    }
    return statusMap[status] || 'Unknown'
}

// 获取状态图标 (SVG)
function getStatusIcon(status) {
    const iconMap = {
        'local': 'localCache',
        'uploading': 'uploading',
        'uploaded': 'uploaded',
        'operating': 'sync',
        'error': 'error'
    }
    const iconName = iconMap[status] || 'unknown'
    return getThemeIcon(iconName)
}

// 工作区相关方法
function addToWorkspace(idx) {
    const file = files.value[idx]
    console.log('Adding file to workspace:', file.name)
    
    // 检查是否已在工作区
    if (isInWorkspace(file.id)) {
        alert('File is already in workspace')
        return
    }
    
    // 如果是已上传的文件，设置为操作状态
    if (file.status === 'uploaded') {
        file.status = 'operating'
    }
    
    // 添加到工作区
    workspaceFiles.value.push({ ...file })
    console.log('Workspace files after adding:', workspaceFiles.value.length)
    
    // 通知父组件工作区更新
    emit('workspace-updated', workspaceFiles.value)
}

function removeFromWorkspace(idx) {
    const file = workspaceFiles.value[idx]
    
    // 如果是操作状态的文件，恢复为已上传状态
    if (file.status === 'operating') {
        const originalFile = files.value.find(f => f.id === file.id)
        if (originalFile) {
            originalFile.status = 'uploaded'
        }
    }
    
    // 从工作区移除
    workspaceFiles.value.splice(idx, 1)
    
    // 通知父组件工作区更新
    emit('workspace-updated', workspaceFiles.value)
}

function clearWorkspace() {
    // 恢复所有操作状态的文件
    workspaceFiles.value.forEach(workspaceFile => {
        if (workspaceFile.status === 'operating') {
            const originalFile = files.value.find(f => f.id === workspaceFile.id)
            if (originalFile) {
                originalFile.status = 'uploaded'
            }
        }
    })
    
    // 清空工作区
    workspaceFiles.value = []
    
    // 通知父组件工作区更新
    emit('workspace-updated', workspaceFiles.value)
}

function isInWorkspace(fileId) {
    return workspaceFiles.value.some(file => file.id === fileId)
}

function previewWorkspaceFile(idx) {
    const file = workspaceFiles.value[idx]
    previewFile(files.value.findIndex(f => f.id === file.id))
}

// 批量同步所有本地文件
async function syncAllFiles() {
    const localFiles = files.value.filter(file => file.status === 'local')
    
    if (localFiles.length === 0) {
        alert('No files to sync')
        return
    }
    
    if (!isBackendConnected.value) {
        alert('Backend not connected, unable to sync')
        return
    }
    
    if (confirm(`Are you sure you want to sync ${localFiles.length} files to the backend?`)) {
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
        alert('Only CSV, XLSX, XLS format files are supported')
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
                createdAt: new Date().toISOString(),
                uploadProgress: 0 // 添加上传进度
            }
            files.value.push(fileItem)
            
            // 调用智能上传 API，支持进度回调
            const uploadedFile = await uploadFile(file, (progress) => {
                // 更新上传进度
                const index = files.value.findIndex(f => f.id === fileItem.id)
                if (index !== -1) {
                    files.value[index].uploadProgress = progress.percentage
                }
            })
            
            // 更新文件状态
            const index = files.value.findIndex(f => f.id === fileItem.id)
            if (index !== -1) {
                files.value[index] = {
                    ...uploadedFile,
                    isEditing: false,
                    newName: uploadedFile.name,
                    uploadProgress: 100
                }
            }
        } catch (error) {
            console.error('File processing failed:', error)
            // 更新失败状态
            const index = files.value.findIndex(f => f.name === file.name)
            if (index !== -1) {
                files.value[index].status = 'error'
                files.value[index].uploadProgress = 0
            }
        }
    }
}

// 取消文件上传
function cancelFileUpload(idx) {
    const file = files.value[idx]
    if (file.status === 'uploading') {
        const success = cancelUpload(file.id)
        if (success) {
            file.status = 'error'
            file.uploadProgress = 0
            console.log(`已取消上传: ${file.name}`)
        }
    }
}
</script>

<style scoped>
/* CSS变量定义 */
:root {
    --bg-color: #fff;
    --text-color: #333;
    --text-secondary: #666;
    --border-color: #e5e7eb;
    --header-bg: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
    --upload-hover-bg: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    --file-hover-bg: #f8f9fa;
    --stats-bg: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
    --modal-backdrop: rgba(0,0,0,0.5);
    --input-bg: #fff;
    --shadow-color: rgba(0,0,0,0.25);
}

/* 暗黑模式变量 */
[data-theme="dark"] {
    --bg-color: #1f2937;
    --text-color: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
    --header-bg: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    --upload-hover-bg: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    --file-hover-bg: #374151;
    --stats-bg: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    --modal-backdrop: rgba(0,0,0,0.7);
    --input-bg: #374151;
    --shadow-color: rgba(0,0,0,0.5);
}

/* 模态框基础样式 */
.file-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--modal-backdrop);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
}

.file-content {
    background: var(--bg-color);
    color: var(--text-color);
    box-shadow: 0 20px 60px var(--shadow-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    width: min(85vw, 800px);
    height: min(85vh, 780px);
    max-height: min(85vh, 780px);
    border-radius: 16px;
    position: relative;
}

/* 头部样式 */
.file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--header-bg);
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

.header-left {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header-left span {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-color);
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
    color: var(--text-secondary);
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
    display: flex;
    align-items: center;
    gap: 6px;
}

.refresh-btn span,
.sync-all-btn span {
    display: flex;
    align-items: center;
}

.refresh-btn svg,
.sync-all-btn svg {
    width: 16px;
    height: 16px;
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
    color: var(--text-secondary);
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

/* 左侧上传区域 */
.upload-section {
    width: 300px;
    padding: 20px;
    border-right: 1px solid var(--border-color);
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
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    background: var(--bg-color);
}

.upload-area:hover,
.upload-area.dragging {
    border-color: #3b82f6;
    background: var(--upload-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.file-input {
    display: none;
}

.upload-tip {
    color: var(--text-secondary);
}

/* 上传图标样式 */
.upload-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    animation: bounceIcon 3s ease-in-out infinite;
}

.upload-icon svg {
    width: 48px;
    height: 48px;
}

@keyframes bounceIcon {
    0%, 90%, 100% {
        transform: translateY(0);
    }
    45% {
        transform: translateY(-5px);
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

/* 暗黑模式下的上传按钮颜色调整 */
[data-theme="dark"] .upload-tip button {
    color: #60a5fa;
}

[data-theme="dark"] .upload-tip button:hover {
    color: #93c5fd;
}

.sub-tip {
    font-size: 12px;
    color: var(--text-secondary);
}

/* 统计信息样式 */
.stats-bar {
    display: flex;
    gap: 20px;
    padding: 16px 20px;
    background: var(--stats-bg);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}

/* 文件列表动画 */
.file-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

/* 隐藏文件列表滚动条 */
.file-list::-webkit-scrollbar {
    width: 0;
    height: 0;
}

.file-list::-webkit-scrollbar-track {
    background: transparent;
}

.file-list::-webkit-scrollbar-thumb {
    background: transparent;
}

.file-list {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

.no-files, .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    font-size: 14px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.stat-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--bg-color);
    overflow: hidden;
    min-width: 0;
}

.file-item:hover {
    background: var(--file-hover-bg);
    transform: translateY(-2px);
    border-left: 3px solid var(--header-bg);
    padding-left: 17px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.file-item:last-child {
    border-bottom: none;
}

.file-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
}

.file-basic {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
}

.file-name-section {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
    overflow: hidden;
}

.file-name-section .file-name {
    flex: 1;
    min-width: 0;
}

.file-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 280px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 0;
}


/* 文件项悬停时的详细信息显示优化 */
.file-item:hover .file-details {
    flex-wrap: nowrap;
    max-height: none;
    overflow: hidden;
}

.file-item:hover .file-details .file-created {
    white-space: nowrap;
    word-break: normal;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 文件名编辑状态优化 */
.file-name.editing input {
    border: 1px solid #3b82f6;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 16px;
    outline: none;
    background: var(--input-bg);
    color: var(--text-color);
    width: 100%;
    max-width: 300px;
}

/* 添加文件名截断提示 */
.file-name::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to right, transparent, var(--bg-color));
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.file-name:not(:hover)::after {
    opacity: 1;
}

.file-name {
    position: relative;
}

.file-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

.file-status span {
    display: flex;
    align-items: center;
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
    color: var(--text-secondary);
    flex-wrap: nowrap;
    overflow: hidden;
    min-width: 0;
}

.file-details span {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex-shrink: 1;
}

.file-size {
    flex-shrink: 0;
    min-width: 60px;
}

.file-type {
    flex-shrink: 0;
    min-width: 40px;
}

.file-dimensions {
    flex-shrink: 1;
    min-width: 60px;
}

.file-created {
    flex-shrink: 2;
    min-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    margin-left: 12px;
}

.action-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn svg {
    width: 16px;
    height: 16px;
}

.action-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active:not(:disabled) {
    transform: translateY(0);
}

.preview-btn {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.preview-btn:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-color: rgba(37, 99, 235, 0.5);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.sync-btn {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.sync-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669, #047857);
    border-color: rgba(5, 150, 105, 0.5);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.sync-btn:disabled {
    background: linear-gradient(135deg, #d1d5db, #e5e7eb);
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    border: 1px solid rgba(209, 213, 219, 0.5);
}

.delete-btn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.delete-btn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    border-color: rgba(220, 38, 38, 0.5);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

/* 为工作区按钮添加特殊效果 */
.workspace-btn {
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    color: white;
    border: 1px solid rgba(139, 92, 246, 0.3);
}

.workspace-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #7c3aed, #9333ea);
    border-color: rgba(124, 58, 237, 0.5);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.workspace-btn:disabled {
    background: linear-gradient(135deg, #d1d5db, #e5e7eb);
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    border: 1px solid rgba(209, 213, 219, 0.5);
}

/* 操作状态标记 */
.operating-mark {
    width: 3px;
    height: 20px;
    background: linear-gradient(180deg, #8b5cf6, #7c3aed);
    border-radius: 2px;
    margin-left: 8px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

/* 工作区管理区域样式 - 极简版 */
.workspace-management {
    border-top: 1px solid var(--border-color);
    padding: 8px 12px;
    background: rgba(248, 249, 250, 0.8);
    backdrop-filter: blur(8px);
    max-height: 200px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: relative;
}

/* 工作区滚动条样式 */
.workspace-management::-webkit-scrollbar {
    width: 4px;
}

.workspace-management::-webkit-scrollbar-track {
    background: transparent;
}

.workspace-management::-webkit-scrollbar-thumb {
    background: var(--text-secondary);
    border-radius: 2px;
}

.workspace-management::-webkit-scrollbar-thumb:hover {
    background: var(--text-color);
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.workspace-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
}

.workspace-icon {
    font-size: 14px;
}

.workspace-count {
    background: rgba(139, 92, 246, 0.9);
    color: white;
    padding: 1px 5px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 500;
    min-width: 16px;
    text-align: center;
}

.clear-workspace-btn {
    background: transparent;
    border: none;
    padding: 2px;
    border-radius: 3px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-workspace-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

.clear-workspace-btn svg {
    width: 12px;
    height: 12px;
}

.workspace-file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0;
}

.workspace-file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(229, 231, 235, 0.5);
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(4px);
    overflow: hidden;
    min-width: 0;
    min-height: 44px;
}

.workspace-file-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(255, 255, 255, 0.8);
}

.workspace-file-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
}



.workspace-file-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    margin-left: 10px;
}

.workspace-action-btn {
    padding: 6px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: transparent;
    color: var(--text-secondary);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    min-height: 28px;
}

.workspace-action-btn:hover {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
}

.workspace-action-btn svg {
    width: 16px;
    height: 16px;
}

/* 状态图标样式适配 */
.file-status.local svg {
    filter: none;
}

.file-status.uploading svg {
    animation: spin 2s linear infinite;
}

.file-status.uploaded svg {
    filter: none;
}

.file-status.error svg {
    filter: none;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 动画效果 */
.modal-expand-enter-active {
    animation: expandModal 0.3s ease-out forwards;
}

.modal-expand-enter-active .file-content {
    animation: expandContent 0.3s ease-out forwards;
}

.modal-expand-leave-active {
    animation: collapseModal 0.2s ease-in forwards;
}

.modal-expand-leave-active .file-content {
    animation: collapseContent 0.2s ease-in forwards;
}

@keyframes expandModal {
    0% {
        opacity: 0;
        backdrop-filter: blur(0px);
    }
    100% {
        opacity: 1;
        backdrop-filter: blur(3px);
    }
}

@keyframes expandContent {
    0% {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes collapseModal {
    0% {
        opacity: 1;
        backdrop-filter: blur(3px);
    }
    100% {
        opacity: 0;
        backdrop-filter: blur(0px);
    }
}

@keyframes collapseContent {
    0% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
    100% {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }
}

/* 暗黑模式下的特殊调整 */
[data-theme="dark"] .file-item:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .upload-area:hover,
[data-theme="dark"] .upload-area.dragging {
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
}

[data-theme="dark"] .file-content {
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

[data-theme="dark"] .action-btn:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 暗黑模式下的按钮颜色调整 */
[data-theme="dark"] .refresh-btn {
    background: #1e40af;
    color: #e5e7eb;
}

[data-theme="dark"] .refresh-btn:hover {
    background: #1e3a8a;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
}

[data-theme="dark"] .sync-all-btn {
    background: #047857;
    color: #e5e7eb;
}

[data-theme="dark"] .sync-all-btn:hover:not(:disabled) {
    background: #065f46;
    box-shadow: 0 4px 12px rgba(4, 120, 87, 0.4);
}

[data-theme="dark"] .sync-all-btn:disabled {
    background: #4b5563;
    color: #9ca3af;
}

[data-theme="dark"] .preview-btn {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    color: #f3f4f6;
    border: 1px solid rgba(30, 64, 175, 0.4);
    box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
}

[data-theme="dark"] .preview-btn:hover {
    background: linear-gradient(135deg, #1e3a8a, #1e40af);
    border-color: rgba(30, 58, 138, 0.6);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);
    color: #ffffff;
}

[data-theme="dark"] .sync-btn {
    background: linear-gradient(135deg, #047857, #065f46);
    color: #f3f4f6;
    border: 1px solid rgba(4, 120, 87, 0.4);
    box-shadow: 0 2px 8px rgba(4, 120, 87, 0.3);
}

[data-theme="dark"] .sync-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #065f46, #064e3b);
    border-color: rgba(6, 95, 70, 0.6);
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5);
    color: #ffffff;
}

[data-theme="dark"] .sync-btn:disabled {
    background: linear-gradient(135deg, #4b5563, #6b7280);
    color: #9ca3af;
    border: 1px solid rgba(75, 85, 99, 0.5);
    box-shadow: none;
}

[data-theme="dark"] .delete-btn {
    background: linear-gradient(135deg, #b91c1c, #991b1b);
    color: #f3f4f6;
    border: 1px solid rgba(185, 28, 28, 0.4);
    box-shadow: 0 2px 8px rgba(185, 28, 28, 0.3);
}

[data-theme="dark"] .delete-btn:hover {
    background: linear-gradient(135deg, #991b1b, #7f1d1d);
    border-color: rgba(153, 27, 27, 0.6);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.5);
    color: #ffffff;
}

[data-theme="dark"] .close-btn:hover {
    color: #f87171;
    background: rgba(248, 113, 113, 0.15);
}

/* 暗黑模式下的文件状态样式调整 */
[data-theme="dark"] .file-status.local {
    background: #a8ad2948;
    color: #fcd34d;
}

[data-theme="dark"] .file-status.uploading {
    background: #1e3a8a;
    color: #93c5fd;
}

[data-theme="dark"] .file-status.uploaded {
    background: #064e3b;
    color: #6ee7b7;
}

[data-theme="dark"] .file-status.error {
    background: #7f1d1d;
    color: #fca5a5;
}

/* 暗黑模式下的工作区样式 */
[data-theme="dark"] .workspace-management {
    background: #222222;
    backdrop-filter: blur(8px);
}

[data-theme="dark"] .workspace-count {
    background: rgba(124, 58, 237, 0.9);
    color: #e5e7eb;
}

[data-theme="dark"] .clear-workspace-btn:hover {
    background: rgba(248, 113, 113, 0.2);
    color: #f87171;
}

[data-theme="dark"] .workspace-file-item {
    background: var(--bg-color);
    border-color: rgba(75, 85, 99, 0.5);
}

[data-theme="dark"] .workspace-file-item:hover {
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.6);
    background: #212121;
}

[data-theme="dark"] .workspace-action-btn:hover {
    background: rgba(96, 165, 250, 0.2);
    color: #60a5fa;
}

[data-theme="dark"] .workspace-btn {
    background: linear-gradient(135deg, #6d28d9, #7c3aed);
    color: #f3f4f6;
    border: 1px solid rgba(109, 40, 217, 0.4);
    box-shadow: 0 2px 8px rgba(109, 40, 217, 0.3);
}

[data-theme="dark"] .workspace-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #5b21b6, #6d28d9);
    border-color: rgba(91, 33, 182, 0.6);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5);
    color: #ffffff;
}

[data-theme="dark"] .workspace-btn:disabled {
    background: linear-gradient(135deg, #4b5563, #6b7280);
    color: #9ca3af;
    border: 1px solid rgba(75, 85, 99, 0.5);
    box-shadow: none;
}

/* 深色模式下的文件名截断提示 */
[data-theme="dark"] .file-name::after {
    background: linear-gradient(to right, transparent, var(--bg-color));
}

/* 深色模式下的文件项悬停优化 */
[data-theme="dark"] .file-item:hover .file-details {
    color: #e5e7eb;
}

/* 上传进度条样式 */
.upload-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #06b6d4);
    border-radius: 2px;
    transition: width 0.3s ease;
    position: relative;
}

.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: progressShimmer 1.5s infinite;
}

@keyframes progressShimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.progress-text {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 35px;
    text-align: right;
}

/* 暗黑模式下的进度条 */
[data-theme="dark"] .progress-bar {
    background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .progress-fill {
    background: linear-gradient(90deg, #1e40af, #0891b2);
}

/* 响应式适配 */
@media (max-width: 768px) {
    .progress-bar {
        height: 3px;
    }
    
    .progress-text {
        font-size: 10px;
        min-width: 30px;
    }
}

/* 取消按钮样式 */
.cancel-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.cancel-btn:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
    border-color: rgba(217, 119, 6, 0.5);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

/* 暗黑模式下的取消按钮 */
[data-theme="dark"] .cancel-btn {
    background: linear-gradient(135deg, #b45309, #92400e);
    color: #f3f4f6;
    border: 1px solid rgba(180, 83, 9, 0.4);
    box-shadow: 0 2px 8px rgba(180, 83, 9, 0.3);
}

[data-theme="dark"] .cancel-btn:hover {
    background: linear-gradient(135deg, #92400e, #78350f);
    border-color: rgba(146, 64, 14, 0.6);
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.5);
    color: #ffffff;
}
</style>
