<template>
<div class="mapping-section">
<div class="mapping-section-header" style="display: flex; align-items: center; justify-content: space-between;">
    <h4 style="margin: 0;">Data Mapping</h4>
    <slot name="title-append"></slot>
</div>
<div v-for="(item, index) in mappingConfig" :key="item.key" class="mapping-item">
    <div class="mapping-item-header">
    <label class="mapping-label">
        {{ item.label }}
        <span v-if="item.required" class="required-star">*</span>
    </label>
    <div class="mapping-type-tag">{{ item.type }}</div>
    </div>
        <div class="drop-zone"
            @dragover.prevent
            @dragenter.prevent="dragOverIndex = index"
            @dragleave.prevent="dragOverIndex = null"
            @drop.prevent="handleDrop($event, item.key, item.multiple)"
            :class="{ 'drop-zone-active': dragOverIndex === index }"
        >
            <!-- 多选模式 -->
            <template v-if="item.multiple">
                <div v-if="!Array.isArray(localConfig[item.key]) || localConfig[item.key].length === 0" class="drop-placeholder">
                    <div class="drop-icon">↓</div>
                    <span class="drop-text">Drag columns here</span>
                </div>
                <div v-else class="mapping-multi-list">
                    <span v-for="(field, idx) in localConfig[item.key]" :key="field.field + idx" class="field-tag tag-item" :data-file="field.file">
                        <span class="field-name">{{ field.field }}</span>
                        <span class="type-tag" :class="'type-' + (field.type || 'unknown')">{{ field.type }}</span>
                        <button class="remove-mapping-tag-btn" @click="() => removeField(item.key, idx)" title="Remove">×</button>
                    </span>
                </div>
            </template>
            <!-- 单选模式 -->
            <template v-else>
                <div v-if="!getFieldDisplay(localConfig[item.key])" class="drop-placeholder">
                    <div class="drop-icon">↓</div>
                    <span class="drop-text">Drag a column here</span>
                </div>
                <div v-else class="mapping-single-item tag-item">
                    <span class="field-tag">
                        <span class="field-name">{{ getFieldDisplay(localConfig[item.key]) }}</span>
                        <span class="type-tag" :class="'type-' + (localConfig[item.key]?.type || 'unknown')">{{ localConfig[item.key]?.type }}</span>
                    </span>
                    <button class="remove-mapping-tag-btn" @click="() => removeField(item.key)" title="Remove">×</button>
                </div>
            </template>
        </div>
    </div>
</div>
</template>

<script setup>
/* no-undef */
/* eslint-disable */
import { ref, watch } from 'vue'
const props = defineProps({
    mappingConfig: Array,
    modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const localConfig = ref({ ...props.modelValue })
const dragOverIndex = ref(null)

watch(() => props.modelValue, (val) => {
    localConfig.value = { ...val }
})

function updateField (key, value) {
    localConfig.value[key] = value
    emit('update:modelValue', { ...localConfig.value })
}

function getFieldDisplay(val) {
    if (typeof val === 'object' && val !== null) {
        return val.field || ''
    }
    return val ?? ''
}

function handleDrop(event, key, multiple) {
    try {
        let dragDataStr = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain')
        const dragData = JSON.parse(dragDataStr)
        if (dragData.type === 'column') {
            // 多选
            if (multiple) {
                if (!Array.isArray(localConfig.value[key])) {
                    localConfig.value[key] = []
                }
                // 唯一性判断需包含 index
                const exists = localConfig.value[key].some(f => f.field === dragData.column.name && f.file === dragData.column.file && f.index === dragData.column.index)
                if (!exists) {
                    localConfig.value[key].push({
                        field: dragData.column.name,
                        type: dragData.column.type,
                        file: dragData.column.file || dragData.fileName || dragData.file || '',
                        index: dragData.column.index
                    })
                    emit('update:modelValue', { ...localConfig.value })
                }
            // 单选
            } else {
                updateField(key, {
                    field: dragData.column.name,
                    type: dragData.column.type,
                    file: dragData.column.file || dragData.fileName || dragData.file || '',
                    index: dragData.column.index
                })
            }
        }
    } catch (e) {
        // ignore
    }
    dragOverIndex.value = null
}

// 支持单选和多选的移除
function removeField(key, idx) {
    if (typeof idx === 'number') {
        // 多选，移除指定项
        if (Array.isArray(localConfig.value[key])) {
        localConfig.value[key].splice(idx, 1)
        emit('update:modelValue', { ...localConfig.value })
        }
    } else {
        // 单选，直接清空
        localConfig.value[key] = ''
        emit('update:modelValue', { ...localConfig.value })
    }
}
</script>

<style scoped>
/* eslint-disable */
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
</style>