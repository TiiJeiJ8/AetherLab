<template>
<div class="chart-display" ref="containerRef">
    <div v-if="!hasSeries" class="empty-tip">
        <!-- SVG动画轮播组件 -->
        <AnimateIcon :icon-list="iconList" :interval="7500" :fade="600" />
        <div class="empty-title">No Chart Data</div>
        <div class="empty-desc">Select a chart type on the left and configure your data to <span class="faststart">get started fast</span> with visualization!</div>
    </div>
    <div v-else class="chart-container" :style="containerStyle">
        <div ref="chartRef" class="chart-inner"></div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
const currentIcon = computed(() => {
    const icon = iconList[iconIndex.value]
    return icon && typeof icon === 'object' ? icon : null
})
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
 * @prop {String} aspectRatio - 宽高比，默认 'auto'
 */
const props = defineProps({
    option: { type: Object, required: true },
    colorTheme: { type: String, default: 'default' },
    aspectRatio: { type: String, default: 'auto' }
})

const chartRef = ref(null)
const containerRef = ref(null)
let chartInstance = null
let resizeObserver = null

const hasSeries = computed(() => {
    return props.option && Array.isArray(props.option.series) && props.option.series.length > 0
})

// 获取容器的实际尺寸
const containerDimensions = ref({ width: 0, height: 0 })

// 计算容器样式
const containerStyle = computed(() => {
    if (props.aspectRatio === 'auto') {
        return {
            width: '100%',
            height: '100%'
        }
    }
    
    // 解析比例
    const [widthRatio, heightRatio] = props.aspectRatio.split(':').map(Number)
    const targetRatio = widthRatio / heightRatio
    
    const { width: containerWidth, height: containerHeight } = containerDimensions.value
    
    if (containerWidth === 0 || containerHeight === 0) {
        // 如果还没有获取到容器尺寸，使用默认的padding-bottom方式
        return {
            width: '100%',
            height: '0',
            paddingBottom: `${(1 / targetRatio) * 100}%`,
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '80vh'
        }
    }
    
    // 根据容器的实际尺寸和目标比例来计算最佳尺寸
    const currentRatio = containerWidth / containerHeight
    
    let finalWidth, finalHeight
    
    if (currentRatio > targetRatio) {
        // 容器更宽，以高度为准
        finalHeight = Math.min(containerHeight, containerWidth / targetRatio)
        finalWidth = finalHeight * targetRatio
    } else {
        // 容器更高，以宽度为准
        finalWidth = Math.min(containerWidth, containerHeight * targetRatio)
        finalHeight = finalWidth / targetRatio
    }
    
    // 确保不超出容器边界
    finalWidth = Math.min(finalWidth, containerWidth)
    finalHeight = Math.min(finalHeight, containerHeight)
    
    return {
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
        maxWidth: '100%',
        maxHeight: '80vh'
    }
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

// // 获取对比色函数
// function getContrastColor(bg) {
//     let r, g, b
//     if (!bg) return '#333'
//     if (bg.startsWith('#')) {
//         if (bg.length === 4) {
//         r = parseInt(bg[1] + bg[1], 16)
//         g = parseInt(bg[2] + bg[2], 16)
//         b = parseInt(bg[3] + bg[3], 16)
//         } else if (bg.length === 7) {
//         r = parseInt(bg.slice(1, 3), 16)
//         g = parseInt(bg.slice(3, 5), 16)
//         b = parseInt(bg.slice(5, 7), 16)
//         }
//     } else if (bg.startsWith('rgb')) {
//         const arr = bg.match(/\d+/g)
//         if (arr && arr.length >= 3) {
//         r = parseInt(arr[0])
//         g = parseInt(arr[1])
//         b = parseInt(arr[2])
//         }
//     }
//     if (r === undefined || g === undefined || b === undefined) return '#eee'
//     const luminance = (0.299 * r + 0.587 * g + 0.114 * b)
//     return luminance > 180 ? '#222' : '#333'
// }

// function getCssVar(name) {
//     return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
// }
// function isTransparent(bg) {
//     if (!bg) return true
//     if (bg === 'transparent') return true
//     if (bg.startsWith('rgba')) {
//         const arr = bg.match(/\d+(\.\d+)?/g)
//         if (arr && arr.length === 4 && parseFloat(arr[3]) === 0) return true
//     }
//     return false
// }

// 串行锁 promise
let renderChartLock = Promise.resolve()

// 渲染图表函数
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
                    option.legend.top = 80
                    option.legend.left = pos === 'left' ? 0 : undefined
                    option.legend.right = pos === 'right' ? 50 : undefined
                    option.legend.width = 60

                    // grid自适应收缩
                    if (!option.grid) option.grid = {}
                    if (pos === 'left') {
                        option.grid.left = 223 // 给左侧legend留空间
                    } else {
                        option.grid.right = 180 // 给右侧legend留空间
                    }

                    // x轴标签宽度自适应
                    if (option.xAxis && option.xAxis.axisLabel) {
                        option.xAxis.axisLabel.width = 90 // 左右legend时标签宽度小些
                    }
                } else if (pos === 'top') {
                    option.legend.orient = 'horizontal'
                    option.legend.top = option.title ? 36 : 16 // 避免与标题重叠
                    option.legend.left = 'center'
                    option.legend.right = undefined
                    option.legend.width = undefined

                    // grid自适应收缩
                    if (!option.grid) option.grid = {}
                    option.grid.top = (option.title ? 120 : 36) // 给顶部legend留空间

                    // x轴标签宽度自适应
                    if (option.xAxis && option.xAxis.axisLabel) {
                        option.xAxis.axisLabel.width = 90 // 顶部legend时标签宽度大些
                    }
                } else if (pos === 'bottom') {
                    option.legend.orient = 'horizontal'
                    option.legend.top = undefined
                    option.legend.left = 'center'
                    option.legend.right = undefined
                    option.legend.bottom = -2
                    option.legend.width = undefined

                    // grid自适应收缩
                    if (!option.grid) option.grid = {}
                    option.grid.bottom = 150 // 给底部legend留空间

                    // x轴标签宽度自适应
                    if (option.xAxis && option.xAxis.axisLabel) {
                        option.xAxis.axisLabel.width = 120 // 底部legend时标签宽度大些
                    }
                }
            }
            // 动态处理x轴标签过长和过密
            // x轴标签过长处理
            if (option.xAxis && option.xAxis.data && Array.isArray(option.xAxis.data)) {
                const labelCount = option.xAxis.data.length
                const maxLabelLength = Math.max(...option.xAxis.data.map(v => String(v).length))
                if (!option.xAxis.axisLabel) option.xAxis.axisLabel = {}

                // 标签数量过多时旋转
                if (labelCount > 24) {
                    option.xAxis.axisLabel.rotate = 45
                }
                // 标签数量极多时间隔显示
                if (labelCount > 80) {
                    option.xAxis.axisLabel.interval = Math.ceil(labelCount / 40)
                } else {
                    option.xAxis.axisLabel.interval = 0
                }
                // 标签内容过长时截断
                if (maxLabelLength > 10) {
                    option.xAxis.axisLabel.overflow = 'truncate'
                    option.xAxis.axisLabel.ellipsis = '...'
                    option.xAxis.axisLabel.width = 100 // 可根据maxLabelLength动态调整
                }
            }
            console.log('[Rendering Theme]Setting chart option:', option)
            chartInstance.setOption(option, { notMerge: true, replaceMerge: ['series'] })
        }
    })
}

// 更新容器尺寸
function updateContainerDimensions() {
    if (containerRef.value) {
        const rect = containerRef.value.getBoundingClientRect()
        containerDimensions.value = {
            width: rect.width,
            height: rect.height
        }
    }
}

onMounted(() => {
    startIconLoop()
    // 初始获取容器尺寸
    updateContainerDimensions()
    renderChart()
    
    // 监听容器大小变化，自适应图表
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            updateContainerDimensions()
            if (chartInstance) {
                // 延迟执行resize，确保CSS变化已完成
                setTimeout(() => {
                    chartInstance.resize()
                }, 50)
            }
        })
        if (containerRef.value) resizeObserver.observe(containerRef.value)
    } else {
        window.addEventListener('resize', () => {
            updateContainerDimensions()
            if (chartInstance) {
                setTimeout(() => {
                    chartInstance.resize()
                }, 50)
            }
        })
    }
})

onBeforeUnmount(() => {
    if (chartInstance) chartInstance.dispose()
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
    if (resizeObserver) {
        if (containerRef.value) resizeObserver.unobserve(containerRef.value)
        resizeObserver.disconnect()
    }
})

watch([() => props.option, () => props.colorTheme], renderChart, { deep: true })
watch(() => props.aspectRatio, () => {
    // 当aspectRatio变化时，重新计算尺寸并resize图表
    if (chartInstance) {
        setTimeout(() => {
            chartInstance.resize()
        }, 100)
    }
})
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
    border: 1px solid var(--border-color, #ddd);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 2vw, 20px) clamp(32px, 4vw, 48px); /* 增大左右内边距 */
    overflow-x: auto; /* 横向可滚动，防止legend溢出 */
    overflow-y: auto;
}

.chart-container {
    min-height: 320px;
    min-width: 0;
    max-width: 100%;
    max-height: 80vh;
    overflow: visible; /* 允许legend溢出显示 */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto; /* 居中显示 */
}

.chart-inner {
    width: 100%;
    height: 100%;
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
