<template>
<div class="chart-config-panel">
<!-- 右侧边栏总标题 -->
<div class="panel-header-CCP">
    <h3>Chart Configuration</h3>
</div>

<!-- 数据映射配置区域 -->
<div class="mapping-section">
    <div class="mapping-section-header">
    <h4>Data Mapping</h4>
    <div class="chart-type-tag"
         @mouseenter="showTooltip($event, selectedChartType)"
         @mouseleave="hideTooltip">
        <span class="chart-type-icon" v-html="getChartIcon(selectedChartType)"></span>
        <span class="chart-type-name">{{ selectedChartType }}</span>
    </div>
    </div>

    <!-- X轴配置 -->
    <div class="mapping-item">
    <div class="mapping-item-header">
        <label class="mapping-label">
        X Axis
        <span class="required-star">*</span>
        </label>
        <div class="mapping-type-tag">category</div>
    </div>
    <div
        class="drop-zone"
        :class="{
        'drop-zone-active': isDragOver.xAxis,
        'drop-zone-filled': chartConfig.xAxis.field,
        'drop-zone-error': dragError.xAxis
        }"
        @drop="handleDrop($event, 'xAxis')"
        @dragover.prevent="handleDragOver($event, 'xAxis')"
        @dragenter.prevent="handleDragEnter('xAxis')"
        @dragleave.prevent="handleDragLeave('xAxis')"
    >
        <div v-if="!chartConfig.xAxis.field" class="drop-placeholder">
        <div class="drop-icon">↓</div>
        <span class="drop-text">Drag column here</span>
        </div>
        <div v-else class="mapped-field">
        <div class="field-info">
            <span class="field-name">{{ chartConfig.xAxis.field }}</span>
            <span class="field-type">{{ chartConfig.xAxis.type }}</span>
        </div>
        <button class="remove-btn" @click="removeMapping('xAxis')">×</button>
        </div>
    </div>
    </div>

    <!-- Y轴配置 -->
    <div class="mapping-item">
    <div class="mapping-item-header">
        <label class="mapping-label">
        Y Axis
        <span class="required-star">*</span>
    </label>
        <div class="mapping-type-tag">value</div>
    </div>
    <div
        class="drop-zone"
        :class="{
        'drop-zone-active': isDragOver.yAxis,
        'drop-zone-filled': chartConfig.yAxis.field,
        'drop-zone-error': dragError.yAxis
        }"
        @drop="handleDrop($event, 'yAxis')"
        @dragover.prevent="handleDragOver($event, 'yAxis')"
        @dragenter.prevent="handleDragEnter('yAxis')"
        @dragleave.prevent="handleDragLeave('yAxis')"
    >
        <div v-if="!chartConfig.yAxis.field" class="drop-placeholder">
        <div class="drop-icon">↓</div>
        <span class="drop-text">Drag column here</span>
        </div>
        <div v-else class="mapped-field">
        <div class="field-info">
            <span class="field-name">{{ chartConfig.yAxis.field }}</span>
            <span class="field-type">{{ chartConfig.yAxis.type }}</span>
        </div>
        <button class="remove-btn" @click="removeMapping('yAxis')">×</button>
        </div>
    </div>
    </div>

    <!-- 数据系列配置 -->
    <div class="mapping-item">
    <div class="mapping-item-header">
        <label class="mapping-label">Data Series</label>
        <div class="mapping-type-tag">value</div>
    </div>
    <div
        class="drop-zone"
        :class="{
        'drop-zone-active': isDragOver.series,
        'drop-zone-filled': chartConfig.series.length > 0,
        'drop-zone-error': dragError.series
        }"
        @drop="handleDrop($event, 'series')"
        @dragover.prevent="handleDragOver($event, 'series')"
        @dragenter.prevent="handleDragEnter('series')"
        @dragleave.prevent="handleDragLeave('series')"
    >
        <div v-if="chartConfig.series.length === 0" class="drop-placeholder">
        <div class="drop-icon">↓</div>
        <span class="drop-text">Drag column here</span>
        </div>
        <div v-else class="mapped-series">
        <div
            v-for="(serie, index) in chartConfig.series"
            :key="index"
            class="mapped-field"
        >
            <div class="field-info">
            <span class="field-name">{{ serie.field }}</span>
            <span class="field-type">{{ serie.type }}</span>
            </div>
            <button class="remove-btn" @click="removeSeriesMapping(index)">×</button>
        </div>
        </div>
    </div>
    </div>
</div>

<!-- 数据过滤 -->
<div class="filter-section">
    <div class="section-header" @click="toggleDataFilter">
    <h4>Data Filtering</h4>
    <div class="toggle-icon" :class="{ 'toggle-open': showDataFilter }">▼</div>
    </div>
    <div v-if="showDataFilter" class="section-content">
    <div class="filter-item">
        <label>Data Range</label>
        <select v-model="chartConfig.dataRange">
        <option value="all">All Data</option>
        <option value="first100">First 100 rows</option>
        <option value="last100">Last 100 rows</option>
        <option value="sample">Random Sample</option>
        </select>
    </div>
    <div class="filter-item">
        <label>Null Value Handling</label>
        <select v-model="chartConfig.nullHandling">
        <option value="ignore">Ignore null values</option>
        <option value="zero">Replace with 0</option>
        <option value="interpolate">Linear interpolation</option>
        </select>
    </div>
    </div>
</div>

<!-- 高级配置 -->
<div class="advanced-section">
    <div class="section-header" @click="toggleAdvancedConfig">
    <h4>Advanced Settings</h4>
    <div class="toggle-icon" :class="{ 'toggle-open': showAdvancedConfig }">▼</div>
    </div>
    <div v-if="showAdvancedConfig" class="section-content">
    <div class="config-item">
        <label>Chart Title</label>
        <input type="text" v-model="chartConfig.title" placeholder="Enter chart title">
    </div>
    <div class="config-item">
        <label>Color Theme</label>
        <select v-model="chartConfig.colorScheme">
        <option value="default">Default</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="warm">Warm</option>
        <option value="cool">Cool</option>
        </select>
    </div>
    <div class="config-item">
        <label>Animation</label>
        <input type="checkbox" v-model="chartConfig.animation">
    </div>
    </div>
</div>

<!-- 操作按钮 -->
<div class="action-section">
    <button
    class="apply-btn"
    :disabled="!isConfigValid"
    @click="generateChart"
    >
    Apply Configuration
    </button>
    <button class="reset-btn" @click="resetConfig">
    Reset Configuration
    </button>
</div>

<!-- 错误提示 -->
<div v-if="errorMessage" class="error-message">
    <div class="error-text">{{ errorMessage }}</div>
</div>

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
import { ref, computed, watch, reactive, nextTick } from 'vue'
import { chartIcons } from '../assets/JS/SVG/chartIcons.js'
import { chartsTooltipConfig } from '../assets/JS/Config/ChartsTooltipConfig.js'

// Props
const props = defineProps({
    selectedChartType: {
        type: String,
        default: 'line'
    },
    currentFile: {
        type: Object,
        default: null
    }
})

// Emits
const emit = defineEmits(['config-change', 'generate-chart'])

// 响应式数据
const showDataFilter = ref(false)
const showAdvancedConfig = ref(false)
const errorMessage = ref('')
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

// 拖拽状态
const isDragOver = ref({
    xAxis: false,
    yAxis: false,
    series: false
})

const dragError = ref({
    xAxis: false,
    yAxis: false,
    series: false
})

// 图表配置
const chartConfig = ref({
    xAxis: {
        field: '',
        type: ''
    },
    yAxis: {
        field: '',
        type: ''
    },
    series: [],
    title: '',
    colorScheme: 'default',
    animation: true,
    dataRange: 'all',
    nullHandling: 'ignore'
})

// 计算属性
const isConfigValid = computed(() => {
    return chartConfig.value.xAxis.field &&
            (chartConfig.value.yAxis.field || chartConfig.value.series.length > 0)
})

function getChartIcon (type) {
    // 直接使用传入的类型，chartIcons.js 中的键是首字母大写格式
    return chartIcons[type] || ''
}

function toggleDataFilter() {
    showDataFilter.value = !showDataFilter.value
}

function toggleAdvancedConfig() {
    showAdvancedConfig.value = !showAdvancedConfig.value
}

// 显示提示框
function showTooltip(event, type) {
    // 清除之前的定时器
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
    }
    
    // 设置1.2秒延迟
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

// 拖拽处理
function handleDragEnter (target) {
    isDragOver.value[target] = true
    dragError.value[target] = false
    }

function handleDragLeave (target) {
    isDragOver.value[target] = false
}

function handleDragOver (event, target) {
    event.preventDefault()
    isDragOver.value[target] = true
}

function handleDrop (event, target) {
    event.preventDefault()
    isDragOver.value[target] = false

    try {
        const dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

        if (dragData.type === 'column') {
        const column = dragData.column

        // 验证数据类型是否适合目标区域
        if (validateColumnForTarget(column, target)) {
            mapColumnToTarget(column, target)
            errorMessage.value = ''
        } else {
            dragError.value[target] = true
            errorMessage.value = `Column "${column.name}" data type is not suitable for ${getTargetName(target)}`
            setTimeout(() => {
            dragError.value[target] = false
            errorMessage.value = ''
            }, 3000)
        }
        }
    } catch (error) {
        console.error('Drop failed:', error)
        errorMessage.value = 'Drag and drop failed, please try again'
    }
}

function validateColumnForTarget (column, target) {
    const columnType = column.type

    switch (target) {
        case 'xAxis':
        // X轴通常接受类别型数据
        return ['string', 'category', 'date'].includes(columnType)
        case 'yAxis':
        // Y轴通常接受数值型数据
        return ['number', 'integer'].includes(columnType)
        case 'series':
        // 系列数据通常接受数值型数据
        return ['number', 'integer'].includes(columnType)
        default:
        return true
    }
}

function mapColumnToTarget (column, target) {
    switch (target) {
        case 'xAxis':
        chartConfig.value.xAxis = {
            field: column.name,
            type: column.type
        }
        break
        case 'yAxis':
        chartConfig.value.yAxis = {
            field: column.name,
            type: column.type
        }
        break
        case 'series':
        // 系列可以有多个，但这里简化为单个
        chartConfig.value.series = [{
            field: column.name,
            type: column.type
        }]
        break
    }

    emit('config-change', chartConfig.value)
}

function removeMapping (target) {
    switch (target) {
        case 'xAxis':
        chartConfig.value.xAxis = { field: '', type: '' }
        break
        case 'yAxis':
        chartConfig.value.yAxis = { field: '', type: '' }
        break
        case 'series':
        chartConfig.value.series = []
        break
    }

    emit('config-change', chartConfig.value)
}

function removeSeriesMapping (index) {
    chartConfig.value.series.splice(index, 1)
    emit('config-change', chartConfig.value)
}

function getTargetName (target) {
    const names = {
        xAxis: 'X Axis',
        yAxis: 'Y Axis',
        series: 'Data Series'
    }
    return names[target] || target
}

function generateChart () {
    if (!isConfigValid.value) {
        errorMessage.value = 'Please complete the required data mapping configuration'
        return
    }

    emit('generate-chart', chartConfig.value)
}

function resetConfig () {
    chartConfig.value = {
        xAxis: { field: '', type: '' },
        yAxis: { field: '', type: '' },
        series: [],
        title: '',
        colorScheme: 'default',
        animation: true,
        dataRange: 'all',
        nullHandling: 'ignore'
    }

    errorMessage.value = ''
    emit('config-change', chartConfig.value)
}

// 监听图表类型变化
watch(() => props.selectedChartType, (newType) => {
    // 根据图表类型调整配置
    if (newType === 'Pie' || newType === 'pie') {
        // 饼图不需要Y轴
        chartConfig.value.yAxis = { field: '', type: '' }
    }
})
</script>

<style scoped>

@import '../assets/CSS/ChartConfigPanel.css';

</style>
