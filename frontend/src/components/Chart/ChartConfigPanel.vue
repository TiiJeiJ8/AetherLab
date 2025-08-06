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
            v-if="mappingConfig && mappingConfig.length"
            :mappingConfig="mappingConfig"
            :modelValue="chartConfig"
            @update:modelValue="onMappingModelUpdate"
        >
            <template #title-append>
            <!-- 自动渲染开关 -->
            <AutoRenderToggle v-model="autoRender" />
            </template>
        </ChartMappingConfig>
    </div>

    <!-- 基础配置区域：所有图表通用配置 -->
    <ChartBasicConfig
        v-model="chartConfig"
        :show-null-handling="showNullHandling"
        :chart-data="chartData"
        :chart-type="selectedChartType"
    />

    <!-- 动态数据过滤配置区域 -->
    <ChartFilterConfig
        v-model="chartConfig"
        :rawData="mainRawData"
    />

    <!-- 动态高级配置区域 -->
    <ChartAdvancedConfig
        v-if="currentTypeConfig.advanced && currentTypeConfig.advanced.length"
        :advancedConfig="currentTypeConfig.advanced"
        v-model="chartConfig"
    />

    <!-- 操作按钮 -->
    <div class="action-section">
        <!-- 应用配置按钮 -->
        <button
            class="apply-btn"
            :disabled="autoRender || !isConfigValid"
            @click="generateChart"
        >
        Apply Configuration
        </button>
        <!-- 重置配置按钮 -->
        <button class="reset-btn" @click="resetConfig">
        Reset Configuration
        </button>
    </div>

    <!-- 保存至图表历史区按钮 -->
    <button
        class="save-history-btn"
        @click="saveToHistory"
    >
        Save to History
    </button>

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
import { ref, computed, watch, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { chartIcons } from '../../assets/JS/SVG/chartIcons.js'
import { chartsTooltipConfig } from '../../assets/JS/Config/ChartsTooltipConfig.js'
import { chartTypeConfig } from '../../assets/JS/Config/ChartTypeConfig.js'
import AutoRenderToggle from '../Common/AutoRenderToggle.vue'
import ChartBasicConfig from './ChartBasicConfig.vue'
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
    },
})

// Emits
const emit = defineEmits(['config-change', 'generate-chart', 'save-history'])
// 保存到历史区
function saveToHistory() {
    // 触发保存事件，传递当前配置
    emit('save-history', {
        config: { ...chartConfig.value },
        colorTheme: chartConfig.value.colorScheme || 'default',
    })
}

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
    titlePosition: 'center',
    colorScheme: 'default',
    animation: true,
    legendVisible: true,
    isAggregate: false,
    dataRange: 'all',
    nullHandling: 'ignoreNull',
    aspectRatio: 'auto',
    // spicific to Geo_Map
    seriesType: 'map',
    mapType: 'china',
    aspectRatio: 'auto',
})

// 合并mapping字段，保留其它字段
function onMappingModelUpdate(mapping) {
    // 只合并mappingConfig中定义的key，其它字段保留
    const mappingKeys = (currentTypeConfig.value.mapping || []).map(item => item.key)
    const newConfig = { ...chartConfig.value }
    mappingKeys.forEach(key => {
        newConfig[key] = mapping[key]
    })
    chartConfig.value = newConfig
    emit('config-change', chartConfig.value)
}

// 需要显示 Null Handling 的图表类型
const showNullHandlingTypes = [
    'Unknown', 'Line', 'Bar', 'Scatter', 'Candlestick', 'Parallel', 'PictorialBar'
]
// 判断当前类型是否需要显示 Null Handling
const showNullHandling = computed(() => {
    const type = props.selectedChartType
    if (!type) return false
    // 兼容首字母大写/小写
    const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    return showNullHandlingTypes.includes(normalized)
})

// chartData自动获取当前用于绘图的数据来判断是否具有缺失值
const chartData = computed(() => props.chartData || [])

// 计算属性
const isConfigValid = computed(() => {
    const type = (props.selectedChartType || '').toLowerCase();
    const cfg = chartConfig.value;
    console.log('Current chart type:', type, 'with config:', JSON.parse(JSON.stringify(cfg)));
    if (['line', 'bar', 'scatter'].includes(type)) {
        const xValid = cfg.xAxis && cfg.xAxis.field;
        const y = cfg.yAxis;
        const yValid = Array.isArray(y) ? y.length > 0 : (y && y.field);
        return xValid && yValid;
    }
    if (['pie'].includes(type)) {
        // category/value 结构
        const cat = cfg.category;
        const val = cfg.value;
        return cat && cat.field && val && val.field;
    }
    if (['geo_map'].includes(type)) {
        return cfg.value && cfg.value.field;
    }
    if (['candlestick'].includes(type)) {
        return  cfg.time && cfg.time.field &&
            cfg.open && cfg.open.field &&
            cfg.close && cfg.close.field &&
            cfg.high && cfg.high.field &&
            cfg.low && cfg.low.field;
    }
    if (['heatmap'].includes(type)) {
        return cfg.xAxis && cfg.xAxis.field &&
            cfg.yAxis && cfg.yAxis.field &&
            cfg.value && cfg.value.field;
    }
    if (['radar'].includes(type)) {
        return Array.isArray(cfg.indicator) && cfg.indicator.length > 0 &&
        Array.isArray(cfg.value) && cfg.value.length > 0;
    }
    if (['boxplot'].includes(type)) {
        return cfg.category && cfg.category.field
    }
    if (['graph'].includes(type)) {
        return cfg.nodeID && cfg.nodeID.field &&
            cfg.edgeSource && cfg.edgeSource.field &&
            cfg.edgeTarget && cfg.edgeTarget.field;
    }
    if (['tree'].includes(type)) {
        return ( cfg.nodeID && cfg.nodeID.field && cfg.parentID && cfg.parentID.field )
    }
    if (['treemap', 'sunburst'].includes(type)) {
        return ( cfg.nodeID && cfg.nodeID.field &&
            cfg.parentID && cfg.parentID.field )
    }
    if (['parallel'].includes(type)) {
        return Array.isArray(cfg.dimensions) && cfg.dimensions.length > 0 &&
            cfg.dimensions.every(dim => dim.field);
    }
    if (['sankey'].includes(type)) {
        return cfg.source && cfg.source.field &&
            cfg.target && cfg.target.field &&
            cfg.value && cfg.value.field;
    }
    if (['funnel'].includes(type)) {
        return cfg.stage && cfg.stage.field &&
            cfg.value && cfg.value.field;
    }
    if (['gauge'].includes(type)) {
        return cfg.value && cfg.value.field;
    }
    if (['pictorialbar'].includes(type)) {
        return cfg.category && cfg.category.field &&
            cfg.value && cfg.value.field;
    }
    if (['themeriver'].includes(type)) {
        return cfg.date && cfg.date.field &&
            cfg.value && cfg.value.field;
    }
    if (['calendar'].includes(type)) {
        return cfg.date && cfg.date.field;
    }
});

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
        animation: chartConfig.value.animation,
        isAggregate: false,
        titlePosition: 'center',
        legendVisible: true,
        legendPosition: 'bottom',
        dataRange: 'all',
        seriesType: chartConfig.value.seriesType || 'map', // 保持当前的 seriesType，如果没有则默认为 'map'
        mapType: 'china',
        aspectRatio: 'auto',
        nullHandling: 'ignoreNull',
    }

    errorMessage.value = ''
    emit('config-change', chartConfig.value)
}

import { fileDataMap } from '@/assets/JS/utils/dataStructureOptimize.js'

const mainRawData = computed(() => {
    // 以当前结构文件为主
    if (props.currentFile && props.currentFile.name && fileDataMap.value[props.currentFile.name]) {
        return fileDataMap.value[props.currentFile.name]
    }
    return []
})

// 动态生成 mappingConfig，支持 Geo_Map 多类型
const mappingConfig = computed(() => {
    // 普通图表类型直接返回
    if (props.selectedChartType !== 'Geo_Map') {
        return currentTypeConfig.value.mapping || [];
    }
    // 地图类型根据 seriesType 动态返回
    const baseMapping = currentTypeConfig.value.mapping || [];
    const seriesType = chartConfig.value.seriesType;
    if (seriesType === 'map' || seriesType === 'bar') {
        return [
            baseMapping.find(f => f.key === 'nameField'),
            baseMapping.find(f => f.key === 'value'),
        ].filter(Boolean);
    } else if (seriesType === 'heatmap') {
        return [
            baseMapping.find(f => f.key === 'lngField'),
            baseMapping.find(f => f.key === 'latField'),
            baseMapping.find(f => f.key === 'value'),
        ].filter(Boolean);
    } else if (seriesType === 'scatter') {
        return [
            baseMapping.find(f => f.key === 'lngField'),
            baseMapping.find(f => f.key === 'latField'),
            baseMapping.find(f => f.key === 'value'),
            baseMapping.find(f => f.key === 'name'),
        ].filter(Boolean);
        // seriesType === 'heatmap'
    } else if (seriesType === 'lines') {
        return [
            baseMapping.find(f => f.key === 'fromLngField'),
            baseMapping.find(f => f.key === 'fromLatField'),
            baseMapping.find(f => f.key === 'toLngField'),
            baseMapping.find(f => f.key === 'toLatField'),
            baseMapping.find(f => f.key === 'fromName'),
            baseMapping.find(f => f.key === 'toName'),
            baseMapping.find(f => f.key === 'value'),
        ].filter(Boolean);
    } else if (seriesType === 'pie') {
        const valueField = baseMapping.find(f => f.key === 'value');
        return [
            baseMapping.find(f => f.key === 'lngField'),
            baseMapping.find(f => f.key === 'latField'),
            baseMapping.find(f => f.key === 'nameField'),
            valueField ? { ...valueField, multiple: false } : undefined,
            baseMapping.find(f => f.key === 'categoryField'),
        ].filter(Boolean);
    }
    // 默认
    return baseMapping;
});

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

// 监听全局主题变化
function handleGlobalThemeChange(event) {
    const { colorScheme } = event.detail
    console.log('[ChartConfigPanel] Global theme changed to:', colorScheme)
    
    // 更新图表配置中的colorScheme
    if (chartConfig.value.colorScheme !== colorScheme) {
        chartConfig.value.colorScheme = colorScheme
        // 触发配置变化事件
        emit('config-change', chartConfig.value)
        
        // 如果自动渲染开启且配置有效，立即重新生成图表
        if (autoRender.value && isConfigValid.value) {
            emit('generate-chart', chartConfig.value)
        }
    }
}

// 生命周期钩子
onMounted(() => {
    // 监听全局主题变化事件
    window.addEventListener('app-theme-change', handleGlobalThemeChange)
    
    // 初始化时同步当前主题状态
    const currentTheme = document.documentElement.getAttribute('data-theme')
    if (currentTheme === 'dark' && chartConfig.value.colorScheme !== 'dark') {
        chartConfig.value.colorScheme = 'dark'
    } else if (currentTheme === 'light' && chartConfig.value.colorScheme !== 'default') {
        chartConfig.value.colorScheme = 'default'
    }
})

onUnmounted(() => {
    // 清理事件监听器
    window.removeEventListener('app-theme-change', handleGlobalThemeChange)
})
</script>

<style scoped>

@import '../../assets/CSS/ChartConfigPanel.css';

</style>
