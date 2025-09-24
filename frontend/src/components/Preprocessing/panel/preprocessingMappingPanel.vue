<template>
<div class="mapping-section">
    <div class="mapping-section-header">
        <h4 class="mapping-title">Preprocessing Mapping</h4>
    </div>
    <!-- 拖拽放置区 -->
    <div class="drop-zone"
        @dragover.prevent
        @dragenter.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        :class="{ 'drop-zone-active': dragOver }"
    >
        <div v-if="mappedColumns.length === 0" class="drop-placeholder">
            <div class="drop-icon">↓</div>
            <span class="drop-text">Drag columns here</span>
        </div>
        <div v-else class="mapping-multi-list">
            <span v-for="(field, idx) in mappedColumns" :key="field.field + idx" class="field-tag tag-item" :data-file="field.file">
                <span class="field-name">{{ field.field }}</span>
                <span class="type-tag" :class="'type-' + (field.type || 'unknown')">{{ field.type }}</span>
                <button class="remove-mapping-tag-btn" @click="() => removeField(idx)" title="Remove">×</button>
            </span>
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue';

const props = defineProps({
    activeSidebarId: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:mappedColumns'])
const dragOver = ref(false);
const mappedColumns = ref([]);

function handleDrop(event) {
    dragOver.value = false;
    try {
        let dragDataStr = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain');
        const dragData = JSON.parse(dragDataStr);
        if (dragData.type === 'column') {
            // console.log('[PreprocessingMappingPanel] drop column:', dragData.column);
            
            const exists = mappedColumns.value.some(f => f.field === dragData.column.name && f.file === dragData.column.file && f.index === dragData.column.index);
            if (!exists) {
                mappedColumns.value.push({
                    field: dragData.column.name,
                    type: dragData.column.type,
                    file: dragData.column.file || dragData.fileName || dragData.file || '',
                    index: dragData.column.index
                });
                // console.log('[PreprocessingMappingPanel] Mapped Columns:', mappedColumns.value);
                emit('update:mappedColumns', mappedColumns.value);
            }
        }
    } catch (e) {
        console.error("Drop failed:", e);
    }
}

function removeField(idx) {
    if (typeof idx === 'number') {
        mappedColumns.value.splice(idx, 1);
        emit('update:mappedColumns', mappedColumns.value);
    }
}
</script>

<style scoped>
.mapping-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.mapping-multi-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 8px;
    width: 100%;
}

.tag-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}

.field-tag {
    display: inline-flex;
    align-items: center;
    background: var(--bg-secondary, #f1f3f4);
    border-radius: 16px;
    padding: 2px 10px 2px 8px;
    font-size: 13px;
    color: var(--text-secondary, #b0afaf);
    gap: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    max-width: 220px;
    min-width: 0;
}

.field-name {
    font-weight: 500;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.type-tag {
    background: #e5e7eb;
    color: #6366f1;
    border-radius: 8px;
    font-size: 11px;
    padding: 0 6px;
    margin-left: 2px;
    text-transform: capitalize;
}

/* 数据类型标签样式 */
.type-string { background: #d1fae5; color: #047857; }
.type-number, .type-integer { background: #e0e7ef; color: #2563eb; }
.type-date { background: #fef9c3; color: #b45309; }
.type-boolean { background: #f3e8ff; color: #7c3aed; }
.type-category { background: #fce7f3; color: #be185d; }
.type-unknown { background: #e5e7eb; color: #6b7280; }
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

.remove-mapping-tag-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 16px;
    cursor: pointer;
    margin-left: 4px;
    transition: color 0.2s;
}
.remove-mapping-tag-btn:hover {
    color: #c72d4ef5;
    font-weight: 900;
}

.drop-zone {
    min-height: 50px;
    margin-bottom: 4px;
    border: 2px dashed var(--border-color, #e5e5e5);
    border-radius: 8px;
    box-sizing: border-box;
    padding: 8px 6px 6px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    background: var(--bg-color, #ffffff);
    position: relative;
    overflow: hidden;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: flex-start;
    gap: 6px 8px;
}
[data-theme="dark"] .drop-zone,
:root.dark .drop-zone {
    border-color: var(--border-color, #555555);
    background: var(--bg-color, #1e1e1e);
}
.drop-zone::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(84, 112, 198, 0.1), transparent);
    transition: left 0.5s ease;
}
.drop-zone:hover::after {
    opacity: 1;
}
.drop-zone:hover::before {
    left: 100%;
}
.drop-zone::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(84, 112, 198, 0.1), rgba(145, 204, 117, 0.1));
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}
.drop-zone-active {
    border-color: var(--primary-color, #5470c6);
    background-color: rgba(84, 112, 198, 0.05);
    transform: scale(1.02);
    box-shadow: 0 4px 20px var(--shadow-color, rgba(84, 112, 198, 0.15));
    border-style: solid;
    animation: pulseGlow 2s infinite alternate;
}
@keyframes pulseGlow {
    0% {
        box-shadow: 0 4px 20px rgba(84, 112, 198, 0.2);
        border-color: var(--primary-color);
    }

    100% {
        box-shadow: 0 8px 40px rgba(84, 112, 198, 0.5);
        border-color: var(--accent-color);
    }
}

.drop-placeholder {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 0;
    color: var(--text-secondary, #999);
    transition: all 0.3s ease;
    pointer-events: none;
}

.drop-placeholder::before {
    content: '📝';
    font-size: 16px;
    opacity: 0.6;
    transition: all 0.3s ease;
}

.drop-zone:hover .drop-placeholder {
    color: var(--primary-color, #5470c6);
    transform: scale(1.05);
}

.drop-zone:hover .drop-placeholder::before {
    animation: bounceIcon 0.6s ease infinite;
}
@keyframes bounceIcon {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

.drop-icon {
    font-size: 16px;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.drop-zone:hover .drop-icon {
    animation: bounceArrow 0.6s ease;
}
@keyframes bounceArrow {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-3px);
    }

    60% {
        transform: translateY(-2px);
    }
}

.drop-text {
    font-size: 12px;
    transition: color 0.3s ease;
}
</style>
