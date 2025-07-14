<template>
<div class="chart-display">
    <div v-if="!hasSeries" class="empty-tip">
        <!-- SVG动画轮播组件 -->
        <AnimateIcon :icon-list="iconList" :interval="7500" :fade="600" />
        <div class="empty-title">No Chart Data</div>
        <div class="empty-desc">Select a chart type on the left and configure your data to <span class="faststart">get started fast</span> with visualization!</div>
    </div>
    <div v-else ref="chartRef" class="chart-container"></div>
</div>
</template>

<script setup>
/* eslint-disable */
const currentIcon = computed(() => {
    const icon = iconList[iconIndex.value]
    return icon && typeof icon === 'object' ? icon : null
})
/* eslint-disable */
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import LineChartIcon from '../svg/LineChartIcon.vue'
import BarChartIcon from '../svg/BarChartIcon.vue'
import PieChartIcon from '../svg/PieChartIcon.vue'
import ScatterChartIcon from '../svg/ScatterChartIcon.vue'
import MapChartIcon from '../svg/MapChartIcon.vue'
import KlineChartIcon from '../svg/KlineChartIcon.vue'
import RadarChartIcon from '../svg/RadarChartIcon.vue'
import BoxplotChartIcon from '../svg/BoxplotChartIcon.vue'
import HeatmapChartIcon from '../svg/HeatmapChartIcon.vue'
import GraphChartIcon from '../svg/GraphChartIcon.vue'
import TreeChartIcon from '../svg/TreeChartIcon.vue'
import TreemapChartIcon from '../svg/TreemapChartIcon.vue'
import SunburstChartIcon from '../svg/SunburstChartIcon.vue'
import ParallelChartIcon from '../svg/ParallelChartIcon.vue'
import SankeyChartIcon from '../svg/SankeyChartIcon.vue'
import FunnelChartIcon from '../svg/FunnelChartIcon.vue'
import GaugeChartIcon from '../svg/GaugeChartIcon.vue'
import PictorialBarChartIcon from '../svg/PictorialBarChartIcon.vue'
import ThemeRiverChartIcon from '../svg/ThemeRiverChartIcon.vue'
import CalendarChartIcon from '../svg/CalendarChartIcon.vue'
import AnimateIcon from '../Common/AnimateIcon.vue'
import * as echarts from 'echarts'

// 主题缓存, 避免污染echarts对象
const themeCache = {}

// 动态加载并注册主题
async function loadAndRegisterTheme(themeName) {
    if (themeCache[themeName]) return
    try {
        const res = await fetch(`/themes/${themeName}.json`)
        if (!res.ok) throw new Error('Theme file loads failed')
        const obj = await res.json()
        echarts.registerTheme(themeName, obj)
        themeCache[themeName] = { themeObj: obj }
    } catch (e) {
        console.warn('Theme load failed:', themeName, e)
    }
}

/**
 * Props
 * @prop {Object} option - ECharts 配置对象，必填
 * @prop {String} colorTheme - 主题名，默认 'default'
 */
const props = defineProps({
    option: { type: Object, required: true },
    colorTheme: { type: String, default: 'default' }
})

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

const hasSeries = computed(() => {
    return props.option && Array.isArray(props.option.series) && props.option.series.length > 0
})

// 空状态图标轮播逻辑
const iconList = [
    BarChartIcon,
    LineChartIcon,
    PieChartIcon,
    ScatterChartIcon,
    MapChartIcon,
    KlineChartIcon,
    RadarChartIcon,
    BoxplotChartIcon,
    HeatmapChartIcon,
    GraphChartIcon,
    TreeChartIcon,
    TreemapChartIcon,
    SunburstChartIcon,
    ParallelChartIcon,
    SankeyChartIcon,
    FunnelChartIcon,
    GaugeChartIcon,
    PictorialBarChartIcon,
    ThemeRiverChartIcon,
    CalendarChartIcon,
]
const iconIndex = ref(0)
const iconOpacity = ref(1)
let iconTimer = null
let fadeTimer = null

function startIconLoop() {
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
    iconOpacity.value = 1
    iconTimer = setInterval(() => {
        // 先淡出
        iconOpacity.value = 0
        fadeTimer = setTimeout(() => {
            iconIndex.value = (iconIndex.value + 1) % iconList.length
            iconOpacity.value = 1
        }, 400)
    }, 3500)
}

// 获取对比色函数
function getContrastColor(bg) {
    let r, g, b
    if (!bg) return '#333'
    if (bg.startsWith('#')) {
        if (bg.length === 4) {
        r = parseInt(bg[1] + bg[1], 16)
        g = parseInt(bg[2] + bg[2], 16)
        b = parseInt(bg[3] + bg[3], 16)
        } else if (bg.length === 7) {
        r = parseInt(bg.slice(1, 3), 16)
        g = parseInt(bg.slice(3, 5), 16)
        b = parseInt(bg.slice(5, 7), 16)
        }
    } else if (bg.startsWith('rgb')) {
        const arr = bg.match(/\d+/g)
        if (arr && arr.length >= 3) {
        r = parseInt(arr[0])
        g = parseInt(arr[1])
        b = parseInt(arr[2])
        }
    }
    if (r === undefined || g === undefined || b === undefined) return '#eee'
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b)
    return luminance > 180 ? '#222' : '#333'
}

function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
function isTransparent(bg) {
    if (!bg) return true
    if (bg === 'transparent') return true
    if (bg.startsWith('rgba')) {
        const arr = bg.match(/\d+(\.\d+)?/g)
        if (arr && arr.length === 4 && parseFloat(arr[3]) === 0) return true
    }
    return false
}

// 串行锁 promise
let renderChartLock = Promise.resolve()
async function renderChart() {
    renderChartLock = renderChartLock.then(async () => {
        console.log('Start rendering chart')
        console.log('value of hasSeries:', hasSeries.value)
        if (!hasSeries.value) return
        if (chartInstance) {
            chartInstance.dispose()
            chartInstance = null
        }
        const themeName = props.colorTheme
        await loadAndRegisterTheme(props.colorTheme)
        console.log('Rendering chart with theme:', themeName)
        chartInstance = echarts.init(chartRef.value, themeName)
        if (props.option) {
            const option = JSON.parse(JSON.stringify(props.option))
            // legend位置自适应处理
            if (option.legend && option.legend.top) {
                const pos = option.legend.top
                if (pos === 'left' || pos === 'right') {
                    option.legend.orient = 'vertical'
                    option.legend.top = 40
                    option.legend.left = pos === 'left' ? 0 : undefined
                    option.legend.right = pos === 'right' ? 0 : undefined
                    option.legend.width = 80
                } else if (pos === 'top') {
                    option.legend.orient = 'horizontal'
                    option.legend.top = option.title ? 36 : 16 // 避免与标题重叠
                    option.legend.left = 'center'
                    option.legend.right = undefined
                    option.legend.width = undefined
                } else if (pos === 'bottom') {
                    option.legend.orient = 'horizontal'
                    option.legend.top = undefined
                    option.legend.left = 'center'
                    option.legend.right = undefined
                    option.legend.bottom = 0
                    option.legend.width = undefined
                }
            }
            // 动态处理x轴标签过长和过密
            // x轴标签过长处理
            if (option.xAxis && option.xAxis.data && Array.isArray(option.xAxis.data)) {
                const labelCount = option.xAxis.data.length
                if (!option.xAxis.axisLabel) option.xAxis.axisLabel = {}
                if (labelCount > 12) {
                    option.xAxis.axisLabel.rotate = 45
                }
                if (labelCount > 40) {
                    option.xAxis.axisLabel.interval = Math.ceil(labelCount / 20)
                } else {
                    option.xAxis.axisLabel.interval = 0
                }
                option.xAxis.axisLabel.overflow = 'truncate'
                option.xAxis.axisLabel.width = 80
                option.xAxis.axisLabel.ellipsis = '...'
            }
            console.log('[Rendering Theme]Setting chart option:', option)
            chartInstance.setOption(option, { notMerge: true, replaceMerge: ['series'] })
        }
    })
}

onMounted(() => {
    startIconLoop()
    renderChart()
    // 监听容器大小变化，自适应图表
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            if (chartInstance) chartInstance.resize()
        })
        if (chartRef.value) resizeObserver.observe(chartRef.value)
    } else {
        window.addEventListener('resize', () => {
            if (chartInstance) chartInstance.resize()
        })
    }
})

onBeforeUnmount(() => {
    if (chartInstance) chartInstance.dispose()
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
    if (resizeObserver && chartRef.value) resizeObserver.unobserve(chartRef.value)
})

watch([() => props.option, () => props.colorTheme], renderChart, { deep: true })
onMounted(renderChart)
onBeforeUnmount(() => {
    if (chartInstance) chartInstance.dispose()
})
</script>

<style scoped>
.chart-display {
    width: 100%;
    height: 100%;
    min-height: clamp(300px, 40vh, 600px);
    max-width: 100vw;
    max-height: 80vh;
    background: var(--bg-color, #fff);
    border-radius: clamp(8px, 2vw, 12px);
    box-shadow: 0 0 1px 1px var(--text-color);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 2vw, 20px) clamp(32px, 4vw, 48px); /* 增大左右内边距 */
    overflow-x: auto; /* 横向可滚动，防止legend溢出 */
    overflow-y: auto;
}

.chart-container {
    width: 100% !important;
    height: 100% !important;
    min-height: 320px;
    min-width: 0;
    max-width: 100vw;
    max-height: 80vh;
    overflow: visible; /* 允许legend溢出显示 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-tip {
    color: #888;
    text-align: center;
    letter-spacing: 1px;
    padding: 24px 10px 10px 10px;
    user-select: none;
    background: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.empty-svg {
    margin-bottom: 15px;
    opacity: 0.92;
    animation: floatX 3.2s ease-in-out infinite;
    will-change: transform;
}
.dynamic-line-svg .line-path {
    stroke-dasharray: 120;
    stroke-dashoffset: 120;
    animation: line-draw 1.2s cubic-bezier(.4,1.6,.6,1) forwards;
}
.dynamic-line-svg .dot {
    opacity: 0;
    transform: scale(0.5);
    animation: dot-pop 0.5s cubic-bezier(.4,1.6,.6,1) forwards;
}
.dynamic-line-svg .dot1 { animation-delay: 0.7s; }
.dynamic-line-svg .dot2 { animation-delay: 0.85s; }
.dynamic-line-svg .dot3 { animation-delay: 1.0s; }
.dynamic-line-svg .dot4 { animation-delay: 1.15s; }
.dynamic-line-svg .dot5 { animation-delay: 1.3s; }
@keyframes line-draw {
    to { stroke-dashoffset: 0; }
}
@keyframes dot-pop {
    0% { opacity: 0; transform: scale(0.5); }
    60% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
.empty-title {
    font-size: 1.25em;
    font-weight: bold;
    color: #4F8EF7;
    margin-bottom: 6px;
}
.empty-desc {
    font-size: 1em;
    color: #666;
    margin-top: 2px;
}
.faststart {
    color: #FFB300;
    font-weight: bold;
}

/* 小屏幕适配 */
@media (max-width: 767px) {
    .chart-display {
        height: 100%;
        padding: 8px;
        border-radius: 8px;
    }
    .empty-tip {
        font-size: 0.95em;
        padding: 10px 2px 6px 2px;
    }
    .empty-title {
        font-size: 1.05em;
    }
    .empty-desc {
        font-size: 0.95em;
    }
    .empty-svg svg {
        width: 44px;
        height: 44px;
    }
}
</style>
