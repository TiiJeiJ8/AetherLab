<template>
<div class="advanced-section">
<div class="section-header">
    <h4>Advanced Settings</h4>
</div>
<div v-for="item in advancedConfig" :key="item.key" class="config-item">
    <!-- 组件标题 -->
    <label>{{ item.label }}</label>

    <!-- 输入number,显示输入框 -->
    <input v-if="item.type === 'number'" type="number"
    :min="item.min" :max="item.max"
    :value="localConfig[item.key]"
    @input="updateField(item.key, $event.target.valueAsNumber)" />

    <!-- 输入checkbox,显示 -->
    <input v-if="item.type === 'checkbox'" type="checkbox"
    :checked="localConfig[item.key]"
    @change="updateField(item.key, $event.target.checked)" />

    <!-- 其他类型可扩展 -->
</div>
</div>
</template>

<script setup>
/* no-undef */
/* eslint-disable */
import { ref, watch } from 'vue'
const props = defineProps({
    advancedConfig: Array,
    modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const localConfig = ref({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
    localConfig.value = { ...val }
})

function updateField (key, value) {
    localConfig.value[key] = value
    emit('update:modelValue', { ...localConfig.value })
}
</script>

<style scoped>
.advanced-section { margin-bottom: 16px; }
.config-item { margin-bottom: 12px; }
</style>
