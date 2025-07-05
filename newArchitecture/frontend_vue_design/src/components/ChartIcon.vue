<template>
    <div class="chart-type-panel">
        <button
        v-for="type in types"
        :key="type"
        class="sideBar-btn"
        :class="{ 'selected': selectedType === type }"
        v-html="renderButton(type)"
        @click="handleClick(type)"
        ></button>
    </div>
</template>
<script setup>
/* eslint-disable */
import { chartTypes, chartIcons } from '../assets/JS/chartIcons.js'
import { watch, ref } from 'vue'

const props = defineProps({
    types: {
        type: Array,
        default: () => chartTypes
    },

    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['select', 'update:modelValue'])

const selectedType = ref(props.modelValue)

function renderButton(type) {
    const icon = chartIcons[type] || ''
    return `${icon}<span class="label">${type}</span>`
}

function handleClick(type) {
    selectedType.value = type
    emit('select', type)
    emit('update:modelValue', type)
}

watch(() => props.modelValue, (newValue) => {
    selectedType.value = newValue
})
</script>

<style scoped>
.chart-type-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.sideBar-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-color);
    padding: 6px 14px;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
}
.sideBar-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
}
.sideBar-btn:hover {
    background-color: rgba(136, 133, 133, 0.1);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 选中状态的样式 */
.sideBar-btn.selected {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.sideBar-btn.selected::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.sideBar-btn.selected:hover {
    background: linear-gradient(135deg, #2563eb, #5b21b6);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.sideBar-btn.selected:hover::before {
    left: 100%;
}

/* 点击动画 */
.sideBar-btn:active {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease;
}

.sideBar-btn.selected:active {
    transform: translateY(-1px) scale(0.98);
}
.sideBar-btn svg {
    fill: currentColor;
    transition: all 0.3s ease;
}
.sideBar-btn.selected svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}
.label {
    white-space: nowrap;
    transition: all 0.3s ease;
}

.sideBar-btn.selected .label {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 选中状态的动画效果 */
@keyframes selectedShine {
    0% {
        background-position: -100% 0;
    }
    100% {
        background-position: 100% 0;
    }
}

.sideBar-btn.selected:hover .chart-icon-svg {
    transform: scale(1.1);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
}

.sideBar-btn.selected:hover .label {
    transform: translateX(2px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>

<style>
.chart-icon-svg {
    width: 1.6em;
    height: 1.6em;
    min-width: 24px;
    min-height: 24px;
    max-width: 32px;
    max-height: 32px;
    color: var(--text-color);
    fill: currentColor;
    vertical-align: middle;
    display: inline-block;
    transition: all 0.3s ease;
}

.sideBar-btn.selected .chart-icon-svg {
    color: white;
}
</style>
