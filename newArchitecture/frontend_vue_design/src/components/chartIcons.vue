<template>
<div class="chart-type-panel">
    <button
    v-for="type in types"
    :key="type"
    class="sideBar-btn"
    v-html="renderButton(type)"
    @click="handleClick(type)"
    ></button>
</div>
</template>

<script setup>
/* eslint-disable */
import { chartTypes, chartIcons } from '../assets/JS/chartIcons.js'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    types: {
        type: Array,
        default: () => chartTypes
    }
})

const emit = defineEmits(['select'])

function renderButton(type) {
    const icon = chartIcons[type] || ''
    return `${icon}<span class="label">${type}</span>`
}

function handleClick(type) {
    emit('select', type)
}
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
}
.sideBar-btn:hover {
    background-color: rgba(136, 133, 133, 0.1);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.sideBar-btn svg {
    fill: currentColor;
}
.label {
    white-space: nowrap;
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
}
</style>
