<template>
<div class="chart-config-panel">
    <!-- 右侧边栏总标题 -->
    <div class="panel-header-CCP" style="position: relative; display: flex; align-items: center; justify-content: space-between;">
        <h3 style="margin: 0;">
            Chart Configuration
        </h3>
        <!-- 图表类型及相关提示 -->
        <div
            class="chart-type-tag"
            @mouseenter="showTooltip($event, props.selectedChartType)"
            @mouseleave="hideTooltip"
            style="position: relative; max-width: 50%; white-space: normal; word-break: break-all; text-align: right; right: 0; margin-right: 3%;"
        >
            <span class="chart-type-icon" v-html="getChartIcon(selectedChartType)"></span>
            <span class="chart-type-name">{{ selectedChartType }}</span>
        </div>
    </div>

    <!-- 动态数据映射配置区域 -->
    <div class="mapping-section-toggle-wrapper">
        <ChartMappingConfig
            v-if="currentTypeConfig.mapping"
            :mappingConfig="currentTypeConfig.mapping"
            v-model="chartConfig"
        >
            <template #title-append>
            <!-- 自动渲染开关 -->
            <AutoRenderToggle v-model="autoRender" />
            </template>
        </ChartMappingConfig>
    </div>

    <!-- 动态数据过滤配置区域 -->
    <ChartFilterConfig
        v-if="currentTypeConfig.filter && currentTypeConfig.filter.length"
        :filterConfig="currentTypeConfig.filter"
        v-model="chartConfig"
    />

    <!-- 动态高级配置区域 -->
    <ChartAdvancedConfig
        v-if="currentTypeConfig.advanced && currentTypeConfig.advanced.length"
        :advancedConfig="currentTypeConfig.advanced"
        v-model="chartConfig"
    />

    <!-- 操作按钮 -->
    <div class="action-section">
        <button
        class="apply-btn"
        :disabled="autoRender || !isConfigValid"
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
import { chartIcons } from '../../assets/JS/SVG/chartIcons.js'
import { chartsTooltipConfig } from '../../assets/JS/Config/ChartsTooltipConfig.js'
import { chartTypeConfig } from '../../assets/JS/Config/ChartTypeConfig.js'
import AutoRenderToggle from '../Common/AutoRenderToggle.vue'
import { getThemeIcon } from '@/assets/JS/SVG/icons.js'
import ChartMappingConfig from './ChartMappingConfig.vue'
import ChartFilterConfig from './ChartFilterConfig.vue'
import ChartAdvancedConfig from './ChartAdvancedConfig.vue'

// 当前类型的配置
const currentTypeConfig = computed(() => {
  // 兼容首字母大写/小写
    return chartTypeConfig[props.selectedChartType] || chartTypeConfig[props.selectedChartType.charAt(0).toUpperCase() + props.selectedChartType.slice(1)] || {}
})

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

// 自动渲染开关，默认手动渲染
const autoRender = ref(false)

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
    const xValid = chartConfig.value.xAxis && chartConfig.value.xAxis.field;
    const y = chartConfig.value.yAxis;
    const yValid = Array.isArray(y) ? y.length > 0 : (y && y.field);
    return xValid && yValid;
})

// 监听 chartConfig 变化，自动渲染
watch(chartConfig, (val) => {
    if (autoRender.value && isConfigValid.value) {
        emit('generate-chart', chartConfig.value)
    }
    console.log('Current chartConfig:', JSON.parse(JSON.stringify(val)))
}, { deep: true })

// 监听自动渲染开关变化，切换为实时时立即渲染
watch(autoRender, (val) => {
    if (val && isConfigValid.value) {
        emit('generate-chart', chartConfig.value)
    }
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
    // 自动渲染开启时，切换类型后立即触发渲染
    if (autoRender.value && isConfigValid.value) {
        emit('generate-chart', chartConfig.value)
    }
})
</script>

<style scoped>

@import '../../assets/CSS/ChartConfigPanel.css';

</style>
