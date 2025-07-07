<template>
<transition name="modal-fade">
    <div v-if="show"
        class="preview-modal"
        @click.self="onClose">
        <transition name="modal-slide" appear>
            <div class="preview-content" v-if="show">
                <!-- 头部 -->
                <div class="preview-header">
                    <div class="header-info">
                        <h3>{{ currentFile?.name || 'Data Preview' }}</h3>
                        <span class="file-info" v-if="currentFile">
                            {{ formatFileSize(currentFile.size) }} |
                            {{ currentFile.rows || 0 }} row × {{ currentFile.columns || 0 }} column (Only first 100 rows shown)
                        </span>
                    </div>
                    <button class="close-btn" @click="onClose">×</button>
                </div>

                <!-- 数据表格预览 -->
                <div class="preview-table-wrapper">
                    <div v-if="dataRows.length" class="table-container">
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th class="row-number">#</th>
                                    <th v-for="(header, idx) in tableHeaders"
                                        :key="idx"
                                        :title="header.length > 12 ? header : ''"
                                        class="column-header">{{ header }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in dataRows"
                                    :key="idx">
                                    <td class="row-number">{{ idx + 1 }}</td>
                                    <td v-for="(header, headerIdx) in tableHeaders"
                                        :key="headerIdx">
                                        {{ Array.isArray(row) ? row[headerIdx] : (typeof row === 'object' ? Object.values(row)[headerIdx] : row) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="empty-tip">
                        <div class="empty-icon">📊</div>
                        <p>暂无数据可预览</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</transition>
</template>

<script setup>
/* eslint-disable */
import { ref, computed } from 'vue'

const props = defineProps({
    show: Boolean,
    currentFile: Object,
    previewData: {
        type: Array,
        default: () => []
    },
    isSidePreview: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

// 表头计算 - 使用第一行数据作为标题
const tableHeaders = computed(() => {
    if (!props.previewData.length) return []
    
    // 获取第一行数据作为表头
    const firstRow = props.previewData[0]
    if (Array.isArray(firstRow)) {
        // 如果是数组格式，直接使用数组元素作为标题
        return firstRow
    } else if (typeof firstRow === 'object') {
        // 如果是对象格式，使用对象的值作为标题
        return Object.values(firstRow)
    }
    return []
})

// 实际数据行（排除标题行）
const dataRows = computed(() => {
    if (!props.previewData.length) return []
    return props.previewData.slice(1) // 跳过第一行（标题行）
})

// 格式化文件大小
function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function onClose() {
    emit('close')
}
</script>

<style scoped>
/* CSS变量定义 */
:root {
    --bg-color: #fff;
    --text-color: #1f2937;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
    --header-bg: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%);
    --table-bg: #fff;
    --table-header-bg: #f3f4f6;
    --table-row-hover: linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%);
    --row-number-bg: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    --row-number-header-bg: #e5e7eb;
    --scrollbar-track: #f1f5f9;
    --scrollbar-thumb: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
    --scrollbar-thumb-hover: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    --modal-backdrop: rgba(0, 0, 0, 0.6);
    --empty-icon-color: #9ca3af;
}

/* 暗黑模式变量 */
[data-theme="dark"] {
    --bg-color: #1f2937;
    --text-color: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
    --header-bg: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    --table-bg: #1f2937;
    --table-header-bg: #374151;
    --table-row-hover: linear-gradient(135deg, #374151 0%, #1e3a8a 100%);
    --row-number-bg: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
    --row-number-header-bg: #4b5563;
    --scrollbar-track: #374151;
    --scrollbar-thumb: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
    --scrollbar-thumb-hover: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%);
    --modal-backdrop: rgba(0, 0, 0, 0.8);
    --empty-icon-color: #6b7280;
}

/* 模态框基础样式 */
.preview-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--modal-backdrop);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    padding: 20px;
}

.preview-content {
    width: min(96vw, 1400px);
    height: min(92vh, 900px);
    background: var(--bg-color);
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color);
    margin: auto;
}

/* 头部样式 */
.preview-header {
    padding: 28px 32px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--header-bg);
    flex-shrink: 0;
    position: relative;
}

.preview-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 20px 20px 0 0;
}

.header-info h3 {
    margin: 0 0 6px 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.025em;
}

.file-info {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
}

.close-btn {
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 10px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1;
}

.close-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    transform: scale(1.1);
}

/* 表格区域 */
.preview-table-wrapper {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--table-bg);
}

.table-container {
    flex: 1;
    overflow: auto;
    padding: 0;
}

.preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background: var(--table-bg);
}

.preview-table th {
    background: var(--table-header-bg);
    font-weight: 700;
    color: var(--text-color);
    padding: 16px 20px;
    text-align: left;
    border-bottom: 2px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 20;
    font-size: 14px;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    /* 确保背景不透明，防止数据行穿透 */
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 长标题处理 */
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* 添加标题提示 */
    position: relative;
}

.preview-table td {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    transition: all 0.2s ease;
    background: var(--table-bg);
}

.preview-table tr:hover {
    background: var(--table-row-hover);
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.row-number {
    background: var(--row-number-bg) !important;
    font-weight: 600;
    color: var(--text-secondary) !important;
    text-align: center !important;
    width: 70px;
    min-width: 70px;
    max-width: 70px !important;
    font-family: 'Consolas', 'Monaco', monospace;
}

.preview-table th.row-number {
    background: var(--row-number-header-bg) !important;
    font-weight: 800;
    /* 确保行号列有不透明背景 */
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 列标题样式 */
.column-header {
    cursor: help;
    transition: all 0.2s ease;
}

.column-header:hover {
    background: var(--table-row-hover) !important;
    transform: translateY(-1px);
}

/* 暗黑模式下确保标题背景不透明 */
[data-theme="dark"] .preview-table th {
    background: var(--table-header-bg) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .preview-table th.row-number {
    background: var(--row-number-header-bg) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 空状态 */
.empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--empty-icon-color);
    padding: 80px 20px;
    animation: fadeInEmpty 0.6s ease-out;
    background: var(--table-bg);
}

.empty-icon {
    font-size: 72px;
    margin-bottom: 20px;
    opacity: 0.6;
    animation: bounceIcon 2s ease-in-out infinite;
}

.empty-tip p {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: var(--text-secondary);
}

@keyframes fadeInEmpty {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounceIcon {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

/* 动画效果 */
.modal-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

.modal-slide-enter-active {
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-slide-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.modal-slide-enter-from {
    opacity: 0;
    transform: scale(0.85) translateY(-30px);
}

.modal-slide-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
}

/* 表格行动画 */
.preview-table tbody tr {
    animation: fadeInRow 0.6s ease-out backwards;
}

.preview-table tbody tr:nth-child(1) { animation-delay: 0.1s; }
.preview-table tbody tr:nth-child(2) { animation-delay: 0.15s; }
.preview-table tbody tr:nth-child(3) { animation-delay: 0.2s; }
.preview-table tbody tr:nth-child(4) { animation-delay: 0.25s; }
.preview-table tbody tr:nth-child(5) { animation-delay: 0.3s; }
.preview-table tbody tr:nth-child(n+6) { animation-delay: 0.35s; }

@keyframes fadeInRow {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .preview-content {
        width: 96vw;
        height: 92vh;
        margin: 15px;
        border-radius: 16px;
    }
    
    .side-preview .preview-content {
        width: 96vw;
        height: 88vh;
        margin: 8px;
    }
    
    .preview-header {
        padding: 20px 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .close-btn {
        position: absolute;
        top: 20px;
        right: 24px;
    }
    
    .preview-table th,
    .preview-table td {
        padding: 12px 16px;
        font-size: 13px;
    }
    
    .preview-table th {
        max-width: 120px;
    }
    
    .row-number {
        width: 50px;
        min-width: 50px;
        max-width: 50px !important;
    }
}

/* 滚动条样式 */
.table-container::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.table-container::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-radius: 5px;
}

.table-container::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 5px;
    border: 1px solid var(--border-color);
}

.table-container::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
}

.table-container::-webkit-scrollbar-corner {
    background: var(--scrollbar-track);
}

/* 暗黑模式下的特殊调整 */
[data-theme="dark"] .preview-content {
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(55, 65, 81, 0.3);
}

[data-theme="dark"] .close-btn:hover {
    background: rgba(248, 113, 113, 0.15);
    color: #f87171;
}

[data-theme="dark"] .preview-table tr:hover {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

[data-theme="dark"] .preview-table th {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>