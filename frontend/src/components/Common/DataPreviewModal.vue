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
                                        :title="String(header).length > 12 ? String(header) : ''"
                                        class="column-header">{{ String(header) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in dataRows"
                                    :key="idx">
                                    <td class="row-number">{{ idx + 1 }}</td>
                                    <td v-for="(header, headerIdx) in tableHeaders"
                                        :key="headerIdx"
                                        :title="getCellValue(row, header, headerIdx)">
                                        {{ getCellValue(row, header, headerIdx) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="empty-tip">
                        <div class="empty-icon">📊</div>
                        <p>No data available...</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</transition>
</template>

<script setup>
/* eslint-disable */
import { computed } from 'vue'
import { getCellValue, formatFileSize } from '@/assets/JS/utils/dataPreviewUtils.js'

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

// 表头计算 - 修复数据类型处理逻辑
const tableHeaders = computed(() => {
    if (!props.previewData.length) return []
    const firstRow = props.previewData[0]
    if (Array.isArray(firstRow)) {
        return firstRow
    } else if (typeof firstRow === 'object' && firstRow !== null) {
        return Object.keys(firstRow)
    }
    return []
})

// 实际数据行（根据数据类型决定是否排除标题行）
const dataRows = computed(() => {
    if (!props.previewData.length) return []
    const firstRow = props.previewData[0]
    if (Array.isArray(firstRow)) {
        return props.previewData.slice(1)
    } else if (typeof firstRow === 'object' && firstRow !== null) {
        return props.previewData
    }
    return props.previewData
})

function onClose() {
    emit('close')
}
</script>

<style scoped>
@import '../../assets/CSS/DataPreviewModal.css';
</style>