<template>
<div class="filter-section">
<div class="section-header">
    <h4>Data Filtering</h4>
</div>
<div v-for="item in filterConfig" :key="item.key" class="filter-item">
    <label>{{ item.label }}</label>
    <select v-if="item.type === 'select'"
    :value="localConfig[item.key]"
    @change="updateField(item.key, $event.target.value)">
    <option v-for="opt in item.options" :key="opt" :value="opt">{{ opt }}</option>
    </select>
    <!-- 其他类型可扩展 -->
</div>
</div>
</template>

<script setup>
/* no-undef */
/* eslint-disable */
import { ref, watch } from 'vue'
const props = defineProps({
    filterConfig: Array,
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
.filter-section { margin-bottom: 16px; }
.filter-item { margin-bottom: 12px; }
</style>
