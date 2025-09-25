<template>
<div class="basic-config-section">
    <div class="basic-config-header" style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <h4 class="basic-config-title" style="margin: 0;">Basic Configuration</h4>
        <AutoRenderToggle v-model="autoRender" />
    </div>
    <!-- 文件选择下拉框 -->
    <div class="basic-config-item">
        <label for="file-select">File</label>
        <select id="file-select" v-model="selectedFile">
            <option v-for="file in props.files" :key="file.id" :value="file">{{ file.name }}</option>
        </select>
    </div>
    <!-- 是否使用自定义数据列 -->
    <div class="basic-config-item">
        <label>Custom Data Cols</label>
        <label class="switch">
            <input id="custom-data-columns" type="checkbox" v-model="useCustomDataColumns" />
            <span class="slider"></span>
        </label>
        <span style="margin-left: 8px; min-width: 32px;">{{ useCustomDataColumns ? 'On' : 'Off' }}</span>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, defineModel } from 'vue';
import AutoRenderToggle from '../../Common/AutoRenderToggle.vue';

const autoRender = defineModel('autoRender')

const props = defineProps({
    files: { type: Array, default: () => [] }
})

const emit = defineEmits(['file-selected', 'update:autoRender'])
const selectedFile = ref(null)

// 当文件列表变化时
watch(() => props.files, (newFiles) => {
    const currentFileId = selectedFile.value?.id
    const fileExists = newFiles.some(f => f.id === currentFileId)

    if (!fileExists) {
        // 如果当前选中的文件不在新列表中，或者没有文件被选中
        // 则默认选择第一个文件（如果列表不为空）
        selectedFile.value = newFiles.length > 0 ? newFiles[0] : null
        emit('file-selected', selectedFile.value) // 发出事件通知父组件
    }
}, { immediate: true, deep: true })

// 当用户手动选择文件时，发出事件
watch(selectedFile, (newFile) => {
    emit('file-selected', newFile)
})

// 当自动渲染选项变化时，发出事件
watch(autoRender, (newVal) => {
    emit('update:autoRender', newVal)
})

// 是否使用自定义数据列
const useCustomDataColumns = defineModel('useCustomDataColumns')
</script>

<style scoped>
.basic-config-section {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 16px 12px 8px 12px;
    margin-bottom: 16px;
    background: #fafbfc;
    transition: background 0.2s, border 0.2s;
    animation: fadeInUp 0.6s ease;
    animation-fill-mode: both;
    animation-delay: 0.35s;
}
[data-theme="dark"] .basic-config-section {
    border: 1px solid #444;
    background: var(--bg-secondary);
}

.basic-config-section .basic-config-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.basic-config-section .basic-config-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    flex-wrap: nowrap;
}

.basic-config-section .basic-config-item label {
    width: 120px;
    font-size: 14px;
    color: #333;
    transition: color 0.2s;
}
[data-theme="dark"] .basic-config-item label {
    color: #dee2e6;
}

.basic-config-section .basic-config-item select {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
    color: #222;
    transition: background 0.2s, color 0.2s, border 0.2s;
}
[data-theme="dark"] .basic-config-item select {
    background: var(--bg-secondary);
    color: #dee2e6;
    border: 1px solid #444;
}

.switch {
    position: relative;
    display: inline-block;
    width: 38px;
    height: 22px;
    margin-left: 6px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--bg-secondary);
    transition: .3s;
    border-radius: 22px;
    border: 2px solid var(--border-color, #ccc);
}

.switch input:checked + .slider {
    background-color: #2fcb51be;
}
</style>
