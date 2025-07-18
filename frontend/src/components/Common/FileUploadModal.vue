<template>
<transition name="modal-expand" appear>
    <div v-if="show" class="file-modal" @click.self="onClose">
        <div class="file-content">
            <div class="file-header">
                <div class="header-left">
                    <span>File Manager</span>
                </div>
                <div class="header-right">
                    <button class="refresh-btn" @click="refreshFiles" title="Refresh file list">
                        <span v-html="getThemeIcon('refresh')"></span>
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
                        <!-- <div class="stat-item" v-if="stats.notUploadedCount > 0">
                            <span class="stat-label">Not Uploaded:</span>
                            <span class="stat-value">{{ stats.notUploadedCount }}</span>
                        </div> -->
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
                                        <span class="file-size" :title="`File Size: ${formatFileSize(file.size)}`">
                                            {{ formatFileSize(file.size) }}
                                        </span>
                                        <span class="file-type" :title="`File Type: ${file.name.split('.').pop().toUpperCase()}`">
                                            {{ file.name.split('.').pop().toUpperCase() }}
                                        </span>
                                        <span class="file-dimensions"
                                                v-if="file.rows && file.columns"
                                                :title="`Data Dimensions: ${file.rows} rows × ${file.columns} columns`">
                                                {{ file.rows }} x {{ file.columns }}
                                        </span>
                                        <span class="file-created"
                                                :title="`Created Time: ${new Date(file.createdAt).toLocaleString()}`">
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
                                <button v-if="file.status !== 'uploading'"
                                        @click="unloadFile(idx)"
                                        title="Delete file"
                                        class="action-btn delete-file-btn">
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
                <div class="workspace-list-header">
                    <div class="workspace-list-title">
                        <span class="workspace-icon">
                            📁<span class="workspace-count">{{ workspaceFiles.length }}</span>
                        </span>
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
import { getThemeIcon } from '../../assets/JS/SVG/icons.js'
import {
    uploadFile,
    deleteFile,
    renameFile,
    getFilePreview,
    getAllFiles
} from '../../assets/JS/services/FileServices.js'

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

// 获取状态文本（仅本地缓存状态）
function getStatusText(status) {
    const statusMap = {
        'local': 'Local Cache',
        'error': 'Error'
    }
    return statusMap[status] || 'Local Cache'
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

// 上传面板的工作区相关方法
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

// 刷新文件列表
async function refreshFiles() {
    await loadFiles()
}

// 页面加载时仅加载本地文件
onMounted(async () => {
    await loadFiles()
})

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
</script>

<style scoped>
@import '../../assets/CSS/FileUploadModal.css';
</style>
