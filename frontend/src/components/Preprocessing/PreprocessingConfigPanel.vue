<template>
<div class="data-preprocessing-config-panel">
    <!-- 右侧边栏总标题 -->
    <div class="panel-header-DCP" style="position:relative; display:flex; align-items: center; justify-content: space-between">
        <h3 style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;">
            Preprocessing Configuration
        </h3>
        <!-- 预处理功能模块及相关提示 -->
        <div
            class="preprocessing-func-tag"
            @mouseenter="showTooltip($event, props.activeSidebarId)"
            @mouseleave="hideTooltip"
            style="position: relative; max-width: 50%; white-space: normal; word-break: break-all; text-align: right; right: 0; margin-right: 3%;"
        >
            <span class="preprocessing-func-name">{{ preprocessingTooltipConfig[props.activeSidebarId].label }}</span>
        </div>
    </div>

    <!-- 基本配置项区域 -->
    <preprocessingBasicConfig :files="props.files" @file-selected="handleFileSelected" />

    <!-- Tooltip DOM -->
    <div
        v-if="tooltip.visible"
        class="preprocessing-tooltip"
        :style="tooltip.style"
        ref="tooltipRef"
    >
        <div class="tooltip-header">
            <span class="tooltip-title">{{ tooltip.label }}</span>
            <span class="tooltip-description">{{ tooltip.description }}</span>
        </div>
        <div class="tooltip-section">
            <h4>Data Requirements</h4>
            <div class="tooltip-tags">
                <span
                    v-for="requirement in tooltip.dataRequirements"
                    :key="requirement"
                    class="tooltip-tag data-tag"
                >
                    {{ requirement }}
                </span>
            </div>
        </div>
        <div class="tooltip-section">
            <h4>Use Cases</h4>
            <div class="tooltip-tags">
                <span
                    v-for="useCase in tooltip.useCases"
                    :key="useCase"
                    class="tooltip-tag use-case-tag"
                >
                    {{ useCase }}
                </span>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { defineProps, nextTick, reactive, ref, onUnmounted, defineEmits } from 'vue';
import { preprocessingTooltipConfig } from '@/assets/JS/Config/preprocessingTooltipConfig.js';

import preprocessingBasicConfig from '../Preprocessing/panel/preprocessingBasicConfig.vue'

const emit = defineEmits(['file-selected'])

// 接收来自父组件的 activeSidebarId prop
const props = defineProps({
    activeSidebarId: {
        type: String,
        default: ''
    },
    files: {
        type: Array,
        default: () => []
    }
})

function handleFileSelected(file) {
    emit('file-selected', file)
}

// Tooltip state and ref
const tooltip = reactive({
    visible: false,
    id: '',
    label: '',
    description: '',
    dataRequirements: [],
    useCases: [],
    style: {},
})
const tooltipRef = ref(null)

// 计算提示框位置，确保不超出屏幕
function positionTooltip(event) {
    if (!tooltipRef.value) return;

    const tooltipEl = tooltipRef.value;
    const rect = tooltipEl.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = event.pageX + 10
    let top = event.pageY + 10
    
    // 防止右边超出屏幕
    if (left + rect.width > viewportWidth) {
        left = event.pageX - rect.width - 10
    }
    
    // 防止底部超出屏幕
    if (top + rect.height > viewportHeight) {
        top = event.pageY - rect.height - 10
    }
    
    // 防止左边超出屏幕
    if (left < 0) {
        left = 10
    }
    
    // 防止顶部超出屏幕
    if (top < 0) {
        top = 10
    }
    
    tooltip.style = {
        left: `${left}px`,
        top: `${top}px`,
        position: 'fixed',
        zIndex: 1000
    }
}

let tooltipTimeout = null
function showTooltip(event, id) {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
    }
    tooltipTimeout = setTimeout(() => {
        const tooltipConfig = preprocessingTooltipConfig[id]
        if (tooltipConfig) {
            tooltip.id = id
            tooltip.label = tooltipConfig.label || ''
            tooltip.description = tooltipConfig.description || ''
            tooltip.dataRequirements = tooltipConfig.dataRequirements || []
            tooltip.useCases = tooltipConfig.useCases || []
            tooltip.visible = true
            nextTick(() => {
                positionTooltip(event)
            })
        }
    }, 1200)
}
function hideTooltip() {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
        tooltipTimeout = null
    }
    tooltip.visible = false
}

onUnmounted(() => {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
        tooltipTimeout = null
    }
})

</script>

<style scoped>
@import '../../assets/CSS/PreprocessingConfigPanel.css';
</style>