<template>
<div class="mapping-section">
<div class="mapping-section-header">
    <h4>Data Mapping</h4>
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
            @drop.prevent="handleDrop($event, item.key)"
            :class="{ 'drop-zone-active': dragOverIndex === index }"
        >
            <div v-if="!getFieldDisplay(localConfig[item.key])" class="drop-placeholder">
                <div class="drop-icon">↓</div>
                <span class="drop-text">Drag a column here</span>
            </div>
            <input v-else :value="getFieldDisplay(localConfig[item.key])" @input="updateField(item.key, $event.target.value)" :placeholder="'Select ' + item.label" />
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

function handleDrop(event, key) {
    try {
        const dragData = JSON.parse(event.dataTransfer.getData('text/plain'))
        if (dragData.type === 'column') {
        // 只存储字段名和类型
        updateField(key, { field: dragData.column.name, type: dragData.column.type })
        }
    } catch (e) {
        // ignore
    }
    dragOverIndex.value = null
}
</script>

<style scoped>
.mapping-section { margin-bottom: 16px; }
.mapping-item { margin-bottom: 12px; }
</style>
