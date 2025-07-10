<template>
    <div class="chart-type-panel">
        <button
        v-for="type in types.slice(1)"
        :key="type"
        class="sideBar-btn"
        :class="{ 'selected': selectedType === type }"
        v-html="renderButton(type)"
        @click="handleClick(type)"
        @mouseenter="showTooltip($event, type)"
        @mouseleave="hideTooltip"
        ></button>
        <!-- 提示框 -->
        <div
            v-if="tooltip.visible"
            class="chart-tooltip"
            :style="tooltip.style"
            ref="tooltipRef"
        >
            <div class="tooltip-header">
                <span class="tooltip-title">{{ tooltip.type }}</span>
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
import { chartTypes, chartIcons } from '../../assets/JS/SVG/chartIcons.js'
import { chartsTooltipConfig } from '../../assets/JS/Config/ChartsTooltipConfig.js'
import { watch, ref, reactive, nextTick } from 'vue'

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
const tooltipRef = ref(null)

// 提示框状态
const tooltip = reactive({
    visible: false,
    type: '',
    description: '',
    dataRequirements: [],
    useCases: [],
    style: {}
})

let tooltipTimeout = null

function renderButton(type) {
    const icon = chartIcons[type] || ''
    return `${icon}<span class="label">${type}</span>`
}

function handleClick(type) {
    selectedType.value = type
    emit('select', type)
    emit('update:modelValue', type)
}

// 显示提示框
function showTooltip(event, type) {
    // 清除之前的定时器
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
    }
    
    // 设置1秒延迟
    tooltipTimeout = setTimeout(() => {
        const config = chartsTooltipConfig[type]
        if (config) {
            tooltip.type = type
            tooltip.description = config.description
            tooltip.dataRequirements = config.dataRequirements
            tooltip.useCases = config.useCases
            tooltip.visible = true
            
            // 在下一个tick中计算位置，确保DOM已更新
            nextTick(() => {
                positionTooltip(event)
            })
        }
    }, 1200) // 1.2秒延迟
}

// 隐藏提示框
function hideTooltip() {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
        tooltipTimeout = null
    }
    tooltip.visible = false
}

// 计算提示框位置，确保不超出屏幕
function positionTooltip(event) {
    if (!tooltipRef.value) return
    
    const tooltipEl = tooltipRef.value
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

/* 提示框样式 */
.chart-tooltip {
    background: var(--bg-color);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    max-width: 320px;
    min-width: 280px;
    font-size: 14px;
    line-height: 1.4;
    backdrop-filter: blur(10px);
    animation: tooltipFadeIn 0.2s ease-out;
}

/* 深色模式下的提示框样式 */
@media (prefers-color-scheme: dark) {
    .chart-tooltip {
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
}

.tooltip-header {
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
    padding-bottom: 8px;
}

.tooltip-title {
    font-weight: 600;
    font-size: 16px;
    color: var(--text-color);
    display: block;
    margin-bottom: 4px;
}

.tooltip-description {
    color: var(--text-color);
    opacity: 0.8;
    font-size: 13px;
    font-style: italic;
}

.tooltip-section {
    margin-bottom: 12px;
}

.tooltip-section:last-child {
    margin-bottom: 0;
}

.tooltip-section h4 {
    margin: 0 0 8px 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-color);
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.tooltip-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tooltip-tag {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.data-tag {
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    color: #1565c0;
    border: 1px solid #90caf9;
}

.use-case-tag {
    background: linear-gradient(135deg, #f3e5f5, #e1bee7);
    color: #7b1fa2;
    border: 1px solid #ce93d8;
}

/* 深色模式下的标签样式 */
[data-theme="dark"] .data-tag {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #dbeafe;
    border-color: #60a5fa;
}

[data-theme="dark"] .use-case-tag {
    background: linear-gradient(135deg, #581c87, #9333ea);
    color: #f3e8ff;
    border-color: #c084fc;
}


.tooltip-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 提示框淡入动画 */
@keyframes tooltipFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
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
