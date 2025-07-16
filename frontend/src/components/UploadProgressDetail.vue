<template>
    <div class="upload-progress-detail" v-if="show">
        <div class="progress-header">
            <div class="file-info">
                <span class="file-name">{{ fileName }}</span>
                <span class="file-size">{{ formatFileSize(fileSize) }}</span>
            </div>
            <div class="progress-actions">
                <button v-if="canPause" @click="$emit('pause')" class="action-btn pause-btn">
                    <span v-html="getThemeIcon('pause')"></span>
                </button>
                <button v-if="canResume" @click="$emit('resume')" class="action-btn resume-btn">
                    <span v-html="getThemeIcon('play')"></span>
                </button>
                <button v-if="canCancel" @click="$emit('cancel')" class="action-btn cancel-btn">
                    <span v-html="getThemeIcon('close')"></span>
                </button>
            </div>
        </div>

        <div class="progress-body">
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill"
                            :style="{ width: progress + '%' }"
                            :class="{ 'error': status === 'error', 'paused': status === 'paused' }"></div>
                </div>
                <div class="progress-text">{{ progress }}%</div>
            </div>

            <div class="progress-stats">
                <div class="stat-item">
                    <span class="stat-label">状态:</span>
                    <span class="stat-value" :class="status">{{ getStatusText(status) }}</span>
                </div>
                <div class="stat-item" v-if="speed > 0">
                    <span class="stat-label">速度:</span>
                    <span class="stat-value">{{ formatUploadSpeed(speed) }}</span>
                </div>
                <div class="stat-item" v-if="estimatedTimeLeft > 0">
                    <span class="stat-label">剩余时间:</span>
                    <span class="stat-value">{{ formatRemainingTime(estimatedTimeLeft) }}</span>
                </div>
                <div class="stat-item" v-if="chunks && chunks.total > 1">
                    <span class="stat-label">分块:</span>
                    <span class="stat-value">{{ chunks.uploaded }}/{{ chunks.total }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { getThemeIcon } from '../assets/JS/icons.js'
import { formatFileSize, formatUploadSpeed, formatRemainingTime } from '../utils/uploadConfig.js'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'uploading'
    },
    speed: {
        type: Number,
        default: 0
    },
    estimatedTimeLeft: {
        type: Number,
        default: 0
    },
    chunks: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['pause', 'resume', 'cancel'])

const canPause = computed(() => props.status === 'uploading')
const canResume = computed(() => props.status === 'paused')
const canCancel = computed(() => ['uploading', 'paused', 'error'].includes(props.status))

function getStatusText (status) {
    const statusMap = {
        uploading: '上传中',
        paused: '已暂停',
        error: '上传失败',
        completed: '上传完成',
        cancelled: '已取消'
    }
    return statusMap[status] || '未知状态'
}
</script>

<style scoped>
.upload-progress-detail {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    margin: 8px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
}

.file-size {
    font-size: 12px;
    color: var(--text-secondary);
}

.progress-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 6px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: rgba(0, 0, 0, 0.1);
}

.action-btn svg {
    width: 16px;
    height: 16px;
}

.pause-btn:hover {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
}

.resume-btn:hover {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
}

.cancel-btn:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
}

.progress-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.progress-bar-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.progress-bar {
    flex: 1;
    height: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #06b6d4);
    border-radius: 4px;
    transition: width 0.3s ease;
    animation: progressShine 2s ease-in-out infinite;
}

.progress-fill.error {
    background: linear-gradient(90deg, #ef4444, #dc2626);
    animation: none;
}

.progress-fill.paused {
    background: linear-gradient(90deg, #f59e0b, #d97706);
    animation: none;
}

.progress-text {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
    min-width: 40px;
    text-align: right;
}

.progress-stats {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
}

.stat-label {
    color: var(--text-secondary);
}

.stat-value {
    font-weight: 500;
    color: var(--text-color);
}

.stat-value.uploading {
    color: #3b82f6;
}

.stat-value.paused {
    color: #f59e0b;
}

.stat-value.error {
    color: #ef4444;
}

.stat-value.completed {
    color: #10b981;
}

@keyframes progressShine {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

.progress-fill {
    background-size: 200% 100%;
    background-image: linear-gradient(
        90deg,
        #3b82f6 0%,
        #06b6d4 25%,
        #3b82f6 50%,
        #06b6d4 75%,
        #3b82f6 100%
    );
}

/* 暗黑模式 */
[data-theme="dark"] .upload-progress-detail {
    background: var(--bg-color);
    border-color: var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .progress-bar {
    background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .progress-fill {
    background-image: linear-gradient(
        90deg,
        #1e40af 0%,
        #0891b2 25%,
        #1e40af 50%,
        #0891b2 75%,
        #1e40af 100%
    );
}

[data-theme="dark"] .progress-fill.error {
    background: linear-gradient(90deg, #b91c1c, #991b1b);
}

[data-theme="dark"] .progress-fill.paused {
    background: linear-gradient(90deg, #d97706, #b45309);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .progress-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .progress-actions {
        align-self: flex-end;
    }

    .progress-stats {
        gap: 8px;
    }

    .stat-item {
        flex: 1;
        min-width: 0;
    }
}
</style>
