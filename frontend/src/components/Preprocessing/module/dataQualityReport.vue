<template>
<div class="data-quality-report-container">
    <div v-if="!report" class="report-placeholder">
        <p style="user-select: none;">Press <strong>Apply Configuration</strong> to view the data quality report.</p>
    </div>
        <div v-else class="report-content">
            <!-- Header & KPI Cards -->
            <div class="dq-header">
                <h2 style="user-select: none;">Data Quality Report</h2>
                <div class="dq-cards">
                    <div class="dq-card" :class="healthClass"
                            @mouseenter="showKpiTip($event, 'health')" @mouseleave="hideKpiTip">
                        <div class="dq-card-title">Health Score</div>
                        <div class="dq-card-value">{{ Math.round(report.metrics.healthScore) }}</div>
                    </div>
                <div class="dq-card" @mouseenter="showKpiTip($event, 'missing')" @mouseleave="hideKpiTip">
                    <div class="dq-card-title">Missing Rate</div>
                    <div class="dq-card-value">{{ (report.metrics.missing.globalRate * 100).toFixed(2) }}%</div>
                </div>
                <div class="dq-card" @mouseenter="showKpiTip($event, 'duplicate')" @mouseleave="hideKpiTip">
                    <div class="dq-card-title">Duplicate Rate</div>
                    <div class="dq-card-value">{{ (report.metrics.duplicates.rate * 100).toFixed(2) }}%</div>
                </div>
                <div class="dq-card" @mouseenter="showKpiTip($event, 'numeric')" @mouseleave="hideKpiTip">
                    <div class="dq-card-title">Numeric Columns</div>
                    <div class="dq-card-value">{{ report.meta.numericCols.length }}</div>
                </div>
                <div class="dq-card" @mouseenter="showKpiTip($event, 'categorical')" @mouseleave="hideKpiTip">
                    <div class="dq-card-title">Categorical Columns</div>
                    <div class="dq-card-value">{{ report.meta.categoricalCols.length }}</div>
                </div>
            </div>
        </div>

        <!-- Charts (3 columns) -->
        <div class="dq-charts three-cols">
            <div class="chart-box">
                <div class="chart-title">Missing Rate</div>
                <div ref="missingRef" class="echart"></div>
            </div>
            <div class="chart-box">
                <div class="chart-title">Boxplot & Outliers</div>
                <div ref="outlierRef" class="echart"></div>
            </div>
            <div class="chart-box">
                <div class="chart-title">Distribution
                    <div v-if="distributionFields.length" class="dist-dropdown" ref="distDropdownRoot">
                        <div class="dist-input" @click="toggleDropdown" :class="{ open: dropdownOpen }">
                            <input type="text" v-model="distQuery" @input="onQueryInput" @keydown.down.prevent="onKeyDown('down')" @keydown.up.prevent="onKeyDown('up')" @keydown.enter.prevent="onKeyDown('enter')" placeholder="Search field..." />
                            <button class="dist-toggle" @click.stop="toggleDropdown" aria-label="Toggle">▾</button>
                        </div>
                        <ul v-show="dropdownOpen" class="dist-list" role="listbox">
                            <li v-for="(f, idx) in filteredDistributionFields" :key="f" :class="{ 'is-active': idx === highlightedIndex }" @click="selectDistribution(f)" @mousemove="highlightIndex(idx)">{{ f }}</li>
                        </ul>
                    </div>
                </div>
                <div ref="distRef" class="echart"></div>
            </div>
        </div>

        <!-- Text (Recommendations + Issues) -->
        <div class="dq-texts">
            <div class="dq-section" v-html="report.html.suggestions"></div>
            <div class="dq-section" v-html="report.html.issues"></div>
        </div>

        <!-- KPI Tooltip -->
        <transition name="fade">
            <div v-if="tip.visible" class="kpi-tooltip" :style="tip.style">
                <div class="kpi-title">{{ tip.title }}</div>
                <div class="kpi-desc">{{ tip.desc }}</div>
            </div>
        </transition>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'

import { generateDataQualityReport } from '@/assets/JS/utils/reportGen.js'
import { getTheme as getEchartsTheme } from '@/assets/JS/utils/themeDispatcher.js'

const props = defineProps({
    data: { type: Object, default: () => ({}) },
    titleName: { type: String, default: '' }
})

const report = ref(null)
const activeTab = ref('missing')
const distributionFields = ref([])
const selectedDistribution = ref('')
const distQuery = ref('')
const dropdownOpen = ref(false)
const highlightedIndex = ref(-1)

const filteredDistributionFields = computed(() => {
    const q = String(distQuery.value || '').trim().toLowerCase()
    if (!q) return distributionFields.value.slice()
    return distributionFields.value.filter(f => String(f).toLowerCase().includes(q))
})

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value
    if (dropdownOpen.value) {
        // open: reset highlight
        highlightedIndex.value = -1
    }
}
function onQueryInput() {
    // keep dropdown open while typing
    if (!dropdownOpen.value) dropdownOpen.value = true
    highlightedIndex.value = -1
}
function selectDistribution(name) {
    selectedDistribution.value = name
    distQuery.value = ''
    dropdownOpen.value = false
    // re-render chart with new selection
    renderCharts()
}
function highlightIndex(i) { highlightedIndex.value = i }
function onKeyDown(dir) {
    const list = filteredDistributionFields.value
    if (!list.length) return
    if (dir === 'down') {
        highlightedIndex.value = Math.min(list.length - 1, highlightedIndex.value + 1)
    } else if (dir === 'up') {
        highlightedIndex.value = Math.max(0, highlightedIndex.value - 1)
    } else if (dir === 'enter') {
        const idx = highlightedIndex.value >= 0 ? highlightedIndex.value : 0
        const val = list[idx]
        if (val) selectDistribution(val)
    }
}

// ECharts 实例与容器引用
let missingChart = null
let outlierChart = null
let distChart = null
const missingRef = ref(null)
const outlierRef = ref(null)
const distRef = ref(null)

const healthClass = computed(() => {
    const s = report.value?.metrics.healthScore || 0
    if (s >= 80) return 'ok'
    if (s >= 60) return 'warn'
    return 'bad'
})

// KPI Tooltip
const tip = ref({ visible: false, title: '', desc: '', style: {} })
let tipTimer = null
const TIP_DELAY = 750 // ms
const kpiTips = {
    health: {
        title: 'Health Score',
        desc: 'A composite score (0-100) summarizing overall data quality using missing, duplicates and outliers.'
    },
    missing: {
        title: 'Missing Rate',
        desc: 'Percentage of missing values across all columns and rows.'
    },
    duplicate: {
        title: 'Duplicate Rate',
        desc: 'Proportion of duplicate rows. High values suggest you should de-duplicate with business keys.'
    },
    numeric: {
        title: 'Numeric Columns',
        desc: 'Number of columns detected as numeric, used for boxplots and histogram analysis.'
    },
    categorical: {
        title: 'Categorical Columns',
        desc: 'Number of columns treated as categories, used for frequency distributions.'
    }
}
function positionTip(e) {
    const vw = window.innerWidth, vh = window.innerHeight
    const padding = 12
    let left = e.clientX + 14
    let top = e.clientY + 14
    // 临时尺寸估计，避免溢出（真实渲染后基本也能覆盖）
    const estWidth = 260, estHeight = 90
    if (left + estWidth > vw) left = Math.max(padding, e.clientX - estWidth - 14)
    if (top + estHeight > vh) top = Math.max(padding, e.clientY - estHeight - 14)
    tip.value.style = { left: `${left}px`, top: `${top}px` }
}
function showKpiTip(e, key) {
    const cfg = kpiTips[key]
    if (!cfg) return
    // 清除旧的延迟
    if (tipTimer) {
        clearTimeout(tipTimer)
        tipTimer = null
    }
    // 先更新内容，但不立即显示
    tip.value.title = cfg.title
    tip.value.desc = cfg.desc
    tip.value.visible = false
    // 延迟显示
    const evt = { clientX: e.clientX, clientY: e.clientY }
    tipTimer = setTimeout(() => {
        positionTip(evt)
        tip.value.visible = true
    }, TIP_DELAY)
}
function hideKpiTip() {
    if (tipTimer) {
        clearTimeout(tipTimer)
        tipTimer = null
    }
    tip.value.visible = false
}

// 自动为导入或更新的数据生成报告
watch(
    () => props.data,
    async (newData) => {
        // 如果传入空对象或 null/undefined，则清空报告并释放图表资源
        if (!newData || (typeof newData === 'object' && Object.keys(newData).length === 0)) {
            report.value = null
            // dispose charts
            missingChart?.dispose(); missingChart = null
            outlierChart?.dispose(); outlierChart = null
            distChart?.dispose(); distChart = null
            return
        }
        if (newData && Object.keys(newData).length) {
            report.value = await generateDataQualityReport(newData)
            await nextTick()
            // Prepare distribution selector
            const dkeys = report.value?.charts?.distributions ? Object.keys(report.value.charts.distributions) : []
            distributionFields.value = dkeys
            selectedDistribution.value = dkeys.length ? dkeys[0] : ''
            renderCharts()
        }
    },
    { immediate: true }
)

function renderCharts() {
    // 惰性引入 echarts，避免 SSR 或打包差异问题
    const echarts = require('echarts')
    const themeName = getCurrentThemeName()
    try { echarts.registerTheme(themeName, getEchartsTheme(themeName)) } catch (e) { /* 重复注册无碍 */ }
    const palette = getThemePalette()
    const themed = (option, role) => applyChartTheme(option, palette, role)
    // 缺失
    if (missingRef.value) {
        missingChart?.dispose()
        missingChart = echarts.init(missingRef.value, themeName)
        if (report.value?.charts.missingBar) {
            const opt = themed(report.value.charts.missingBar, 'missing')
            missingChart.setOption(opt)
        }
    }
    // 异常
    if (outlierRef.value) {
        outlierChart?.dispose()
        outlierChart = echarts.init(outlierRef.value, themeName)
        if (report.value?.charts.outlierBox) {
            const opt = themed(report.value.charts.outlierBox, 'outlier')
            outlierChart.setOption(opt)
        }
    }
    // 分布
    if (distRef.value) {
        distChart?.dispose()
        distChart = echarts.init(distRef.value, themeName)
        // Prefer per-column distributions if available
        const dists = report.value?.charts?.distributions
        let opt = null
        if (dists && selectedDistribution.value && dists[selectedDistribution.value]) {
            opt = themed(dists[selectedDistribution.value], 'distribution')
        } else if (report.value?.charts.distribution) {
            opt = themed(report.value.charts.distribution, 'distribution')
        }
        if (opt) distChart.setOption(opt)
    }
}

function handleResize() {
    missingChart?.resize();
    outlierChart?.resize();
    distChart?.resize();
}

onMounted(() => {
    if (report.value) renderCharts()
    window.addEventListener('resize', handleResize)
        // 监听全局主题事件（来自 ThemeButton）
        window.addEventListener('app-theme-change', handleAppThemeChange)
        // 监听主题切换（class 或 data-theme 变化）
    const targets = [document.documentElement, document.body].filter(Boolean)
    themeObserver = new MutationObserver(() => {
                // 轻量 debounce
                cancelAnimationFrame(themeRAF)
                themeRAF = requestAnimationFrame(() => renderCharts())
        })
    targets.forEach(t => themeObserver.observe(t, { attributes: true, attributeFilter: ['class', 'data-theme'] }))

    // 点击外部关闭下拉
    document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('app-theme-change', handleAppThemeChange)
    missingChart?.dispose();
    outlierChart?.dispose();
    distChart?.dispose();
        themeObserver?.disconnect()
    document.removeEventListener('click', onDocClick)
})

function onDocClick(e) {
    const root = distDropdownRoot?.value
    if (!root) return
    if (!root.contains(e.target)) {
        dropdownOpen.value = false
    }
}

const distDropdownRoot = ref(null)

// ----- Theme Helpers -----
let themeObserver = null
let themeRAF = 0
function getCssVar(name, fallback = '') {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name)
    return val && val.trim() ? val.trim() : fallback
}
function getThemePalette() {
    return {
        text: getCssVar('--text-color', '#222'),
        border: getCssVar('--border-color', '#e5e7eb'),
        primary: getCssVar('--primary-color', '#4F8EF7'),
        warning: getCssVar('--warning-color', '#f59e0b'),
        bg: getCssVar('--bg-color', '#fff')
    }
}
function normalizeAxis(axis, palette) {
    const arr = Array.isArray(axis) ? axis : [axis]
    arr.forEach(ax => {
        if (!ax) return
        ax.axisLabel = Object.assign({ color: palette.text }, ax.axisLabel)
        ax.axisLine = Object.assign({ lineStyle: { color: palette.border } }, ax.axisLine)
        if (ax.splitLine) {
            ax.splitLine = Object.assign({ lineStyle: { color: palette.border, opacity: 0.3 } }, ax.splitLine)
            ax.splitLine.lineStyle = Object.assign({ color: palette.border, opacity: 0.3 }, ax.splitLine.lineStyle)
        }
    })
    return Array.isArray(axis) ? arr : arr[0]
}
function applyChartTheme(option, palette, role) {
    const opt = JSON.parse(JSON.stringify(option || {}))
    opt.backgroundColor = 'transparent'
    opt.textStyle = Object.assign({ color: palette.text }, opt.textStyle)
    // read CSS variables for grid tuning
    const gridColorVar = getCssVar('--chart-grid-color', palette.border)
    const gridOpacityVar = parseFloat(getCssVar('--chart-grid-opacity', '0.18')) || 0.18
    const gridVOpacityVar = parseFloat(getCssVar('--chart-grid-vertical-opacity', '0.06')) || 0.06
    const gridWidthVar = parseFloat(getCssVar('--chart-grid-width', '1')) || 1
    if (opt.legend) {
        const legends = Array.isArray(opt.legend) ? opt.legend : [opt.legend]
        legends.forEach(l => {
            l.textStyle = Object.assign({ color: palette.text }, l.textStyle)
        })
        opt.legend = Array.isArray(opt.legend) ? legends : legends[0]
    }
    if (opt.tooltip) {
        opt.tooltip = Object.assign({ backgroundColor: 'rgba(0,0,0,0.7)', textStyle: { color: palette.text } }, opt.tooltip)
    }
    if (opt.dataZoom) {
        const dz = Array.isArray(opt.dataZoom) ? opt.dataZoom : [opt.dataZoom]
        dz.forEach(z => {
            z.textStyle = Object.assign({ color: palette.text }, z.textStyle)
            if (z.dataBackground) {
                z.dataBackground.lineStyle = Object.assign({ color: palette.border }, z.dataBackground.lineStyle)
                z.dataBackground.areaStyle = Object.assign({ color: 'rgba(180,180,180,0.2)' }, z.dataBackground.areaStyle)
            }
            z.borderColor = z.borderColor || palette.border
            z.fillerColor = z.fillerColor || 'rgba(100,100,100,0.2)'
            z.handleStyle = Object.assign({ color: palette.border }, z.handleStyle)
        })
        opt.dataZoom = Array.isArray(opt.dataZoom) ? dz : dz[0]
    }
    if (opt.title) {
        const titles = Array.isArray(opt.title) ? opt.title : [opt.title]
        titles.forEach(t => {
            t.textStyle = Object.assign({ color: palette.text }, t.textStyle)
        })
        opt.title = Array.isArray(opt.title) ? titles : titles[0]
    }
    // Normalize axes and adjust grid lines for dark theme: remove vertical grid lines (x-axis splitLine)
    const isDark = getCurrentThemeName() === 'dark'
    if (opt.xAxis) {
        opt.xAxis = normalizeAxis(opt.xAxis, palette)
        const xaxes = Array.isArray(opt.xAxis) ? opt.xAxis : [opt.xAxis]
        xaxes.forEach(xa => {
            xa.splitLine = xa.splitLine || {}
            if (isDark) {
                // reduce visibility for vertical grid lines in dark theme
                xa.splitLine.show = false
                xa.splitLine.lineStyle = Object.assign({ color: gridColorVar, opacity: gridVOpacityVar, width: gridWidthVar }, xa.splitLine.lineStyle)
            } else {
                xa.splitLine.show = xa.splitLine.show !== false
                xa.splitLine.lineStyle = Object.assign({ color: gridColorVar, opacity: gridOpacityVar, width: gridWidthVar }, xa.splitLine.lineStyle)
            }
        })
        opt.xAxis = Array.isArray(opt.xAxis) ? xaxes : xaxes[0]
    }
    if (opt.yAxis) {
        opt.yAxis = normalizeAxis(opt.yAxis, palette)
        const yaxes = Array.isArray(opt.yAxis) ? opt.yAxis : [opt.yAxis]
        yaxes.forEach(ya => {
            ya.splitLine = ya.splitLine || {}
            // horizontal lines should be visible but subtle in dark theme
            ya.splitLine.show = true
            ya.splitLine.lineStyle = Object.assign({ color: gridColorVar, opacity: gridOpacityVar, width: gridWidthVar }, ya.splitLine.lineStyle)
        })
        opt.yAxis = Array.isArray(opt.yAxis) ? yaxes : yaxes[0]
    }
    if (opt.series) {
        const seriesArr = Array.isArray(opt.series) ? opt.series : [opt.series]
        seriesArr.forEach(s => {
                if (s.type === 'bar' && role === 'missing') {
                    // 仅缺失率条形图使用警告色突出，其它系列交由主题接管颜色
                    s.itemStyle = Object.assign({ color: palette.warning }, s.itemStyle)
                }
                // 其它系列颜色交给主题（避免覆盖主题色盘）
        })
        opt.series = Array.isArray(opt.series) ? seriesArr : seriesArr[0]
    }
    return opt
}

    function getCurrentThemeName() {
        const el = document.documentElement
        const dataTheme = el.getAttribute('data-theme')
        if (dataTheme === 'dark') return 'dark'
        if (el.classList && el.classList.contains('dark')) return 'dark'
        return 'default'
    }

    function handleAppThemeChange() {
        // 与 MutationObserver 保持一致：收到事件即重绘
        renderCharts()
    }
</script>

<style scoped>
.data-quality-report-container {
    width: 100%;
    height: 100%;
    padding: 6px; /* 减少内边距以获得更大可用宽度 */
    overflow-y: auto;
}
/* 限制内容最大宽度，保持不同数据文件下的报告宽度一致 */
.report-content {
    max-width: var(--dq-max-width, 1200px);
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}
.report-placeholder {
    text-align: center;
    color: var(--text-secondary, #888);
    font-size: 1.2em;
}
/* Header & cards */
.dq-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    background: var(--bg-color, #fff);
}
.dq-header h2 {
    margin: 0;
}
.dq-cards {
    display: grid;
    grid-template-columns: repeat(5, minmax(200px, 1fr));
    gap: 14px;
    min-width: 0;
}
.dq-card {
    padding: 14px 16px;
    border-radius: 10px;
    background: var(--bg-secondary, #f6f7fb);
    border: 1px solid var(--border-color, #e5e7eb);
}
.dq-card {
    position: relative;
    cursor: default;
}
.dq-card.ok {
    border-color: var(--success-color, #16a34a);
}
.dist-select {
    margin-left: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid var(--border-color, #e5e7eb);
    background: var(--bg-color, #fff);
}

/* Searchable dropdown styles */
.dist-dropdown {
    display: inline-block;
    position: relative;
    margin-left: 12px;
    vertical-align: middle
}
.dist-input {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 6px;
    overflow: hidden;
    background: var(--bg-color, #fff);
}
.dist-input.open {
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.dist-input input {
    border: none;
    outline: none;
    padding: 6px 8px;
    min-width: 160px;
    background: transparent;
    color: var(--text-color, #222)
}
.dist-toggle {
    border: none;
    background: transparent;
    padding: 6px 8px;
    cursor: pointer;
    color: var(--text-color, #222)
}
.dist-list {
    position: absolute;
    left: 0;
    top: calc(100% + 6px);
    z-index: 40;
    max-height: 260px;
    overflow: auto; min-width: 220px;
    background: var(--bg-color, #fff);
    border: 1px solid var(--border-color, #e5e7eb);
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    border-radius: 6px; padding: 6px 0;
    scrollbar-width: none;
}
.dist-list li {
    list-style: none;
    padding: 8px 12px;
    cursor: pointer;
    color: var(--text-color, #222)
}
.dist-list li:hover, .dist-list li.is-active {
    background: var(--bg-secondary, #f3f4f6);
}

/* Dark theme overrides when document has data-theme="dark" or .dark class */
:root[data-theme='dark'] .dist-input,
.dark .dist-input,
:root[data-theme='dark'] .dist-list,
.dark .dist-list {
    background: var(--bg-color, #333333ff);
    border-color: var(--border-dark, #223049);
}
:root[data-theme='dark'] .dist-input input,
.dark .dist-input input,
:root[data-theme='dark'] .dist-list li,
.dark .dist-list li {
    color: var(--text-dark, #d8e6ff);
}
:root[data-theme='dark'] .dist-list li:hover,
.dark .dist-list li:hover,
:root[data-theme='dark'] .dist-list li.is-active,
.dark .dist-list li.is-active {
    background: rgba(255,255,255,0.04);
}
.dq-card.warn {
    border-color: var(--warning-color, #d97706);
}
.dq-card.bad {
    border-color: var(--error-color, #dc2626);
}
.dq-card-title {
    font-size: 13px;
    color: var(--text-secondary, #666);
}
.dq-card-value {
    font-size: 26px;
    font-weight: 800;
}

/* Charts */
.dq-charts.three-cols {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}
.chart-box {
    width: 100%;
    height: 400px;
    background: var(--bg-color, #fff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
}
.chart-box {
    min-width: 0;
    box-sizing: border-box;
}
.chart-title {
    font-size: 14px;
    color: var(--text-color, #444);
    margin: 2px 8px;
}
.echart {
    width: 100%;
    height: 100%;
}

/* Text sections */
.dq-texts {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    align-items: stretch;
}
.dq-section.wide {
    grid-column: 1 / -1;
}
.dq-section:first-child, .dq-section:nth-child(2) {
    min-height: 160px;
}
@media (max-width: 1200px) {
    .dq-texts { grid-template-columns: 1fr; }
    .dq-section.wide { grid-column: auto; }
}
.dq-section {
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    background: var(--bg-color, #fff);
    padding: 12px;
    color: var(--text-color);
    box-sizing: border-box;
}
.dq-section.wide {
    max-height: 360px;
    overflow: auto;
}
.dq-section:first-child, .dq-section:nth-child(2) {
    min-height: 180px;
}
.dq-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-word;
}
.dq-table th, .dq-table td {
    padding: 8px;
    border: 1px solid var(--border-color, #e5e7eb);
}
/* Prevent first column from expanding the table; truncate long field names */
::v-deep .dq-issues .dq-table th:first-child,
::v-deep .dq-issues .dq-table td:first-child {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/* Header & cards */
.dq-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.dq-cards { display: flex; gap: 12px; flex-wrap: wrap; }
.dq-card { min-width: 120px; padding: 10px 12px; border-radius: 8px; background: var(--bg-secondary, #f6f7fb); border: 1px solid var(--border-color, #e5e7eb); }
.dq-card.ok { border-color: var(--success-color, #16a34a); }
.dq-card.warn { border-color: var(--warning-color, #d97706); }
.dq-card.bad { border-color: var(--error-color, #dc2626); }
.dq-card-title { font-size: 12px; color: var(--text-secondary, #666); }
.dq-card-value { font-size: 20px; font-weight: 700; }

/* Tabs */
/* .dq-tabs { display: flex; gap: 8px; margin: 8px 0 12px; }
.dq-tabs button { padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color, #e5e7eb); background: var(--bg, #fff); cursor: pointer; }
.dq-tabs button.active { background: #4F8EF7; color: #fff; border-color: #4F8EF7; } */
/* KPI Tooltip */
.kpi-tooltip {
    position: fixed;
    z-index: 2000;
    max-width: 280px;
    background: var(--bg-tertiary, rgba(30,41,59,.96));
    color: var(--text-color, #fff);
    border-radius: 8px;
    padding: 10px 12px;
    box-shadow: 0 6px 20px var(--shadow-color, rgba(0,0,0,0.25));
    border: 1px solid var(--border-color, #3b3b3b);
    pointer-events: none;
}
.kpi-tooltip .kpi-title { font-weight: 700; margin-bottom: 6px; font-size: 13px; }
.kpi-tooltip .kpi-desc { font-size: 12px; line-height: 1.45; opacity: 0.95; }

/* Styles for HTML injected content (v-html) - use deep selector so scoped SFC styles apply */
::v-deep .dq-issues .dq-table {
    width: 100%;
    border-collapse: collapse;
}
::v-deep .dq-issues .dq-table th,
::v-deep .dq-issues .dq-table td {
    padding: 1px;
    border: 1px solid var(--border-color, #e5e7eb);
    text-align: left;
    vertical-align: middle;
}
::v-deep .dq-issues .dq-table thead th {
    background: rgba(0,0,0,0.03);
    color: var(--text-secondary, #666);
}
::v-deep .dq-issues .dq-field-name {
    display: inline-block;
    max-width: 220px; /* 控制截断宽度，可按需调整 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>