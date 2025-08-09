<template>
<section id="top"></section>
<div class="data-visualization-module data-visualization">
    <!-- LOGO -->
    <section id="chart-types" class="content-section">
        <h1 style="user-select: none;"><span class="float-chart-icon">📊</span><br>Visualization</h1>
        <p class="section-description" style="margin-bottom: 15%">Explore the rich chart types and visualization features provided by AetherLab.</p>

        <!-- Contribution button -->
        <div class="contribution-links">
            <a href="https://github.com/TiiJeiJ8/AetherLab" target="_blank" class="contrib-link">
                <span class="contrib-icon">🐙</span>
                <span>GitHub Repository</span>
            </a>
            <a href="https://github.com/TiiJeiJ8/AetherLab/issues" target="_blank" class="contrib-link">
                <span class="contrib-icon">🐛</span>

                <span>Issues</span>
            </a>
            <a href="https://github.com/TiiJeiJ8/AetherLab/pulls" target="_blank" class="contrib-link">
                <span class="contrib-icon">🔄</span>
                <span>Pull Requests</span>
            </a>
        </div>
    </section>

    <!-- Chart Generation Process -->
    <section id="generation-process" class="content-section">
    <h2>⚙️ Chart Generation Process</h2>
    <p>Understand the steps involved in generating a chart in AetherLab.</p>
    <div class="steps-container">
        <div class="step-item" v-for="(step, index) in StartSteps" :key="step.id">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
            <img v-if="step.img" :src="step.img" alt="step image" class="step-image" />
        </div>
        </div>
    </div>
    </section>

    <!-- Chart Gallery -->
    <section id="chart-gallery" class="content-section">
        <h2>🖼️ Chart Gallery</h2>
        <div ref="galleryChart" style="width:100%;height:750px;"></div>
        <div id="chart-categories" class="chart-categories">
            <div class="category-card" v-for="category in chartCategories" :key="category.id">
                <h3>{{ category.icon }} {{ category.title }}</h3>
                <div class="charts-grid">
                    <div class="chart-item" v-for="chart in category.charts" :key="chart.id">
                    <span class="chart-icon">{{ chart.icon }}</span>
                    <span class="chart-name">{{ chart.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Choose a Chart -->
    <section id="chart-selection-guide" class="content-section">
        <h2>🧭 Choose a Chart</h2>
        <p>Select appropriate charts based on data requirements and usage scenarios.</p>
        <div class="chart-selection-guide-area">
            <div class="selection-column">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <h4 style="margin: 0;">Data Requirements</h4>
                <button class="reset-btn" @click="resetSelection">Reset</button>
                </div>
                <input v-model="requirementFilter" placeholder="Search data requirements..." class="tag-search" />
                <div class="tag-list tag-scroll">
                <span
                    v-for="req in filteredRequirements"
                    :key="req"
                    :class="['tag', { selected: selectedRequirements.includes(req) }]"
                    @click="toggleRequirement(req)"
                >{{ req }}</span>
                </div>
            </div>
            <div class="selection-column">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <h4 style="margin: 0;">Use Cases</h4>
                <button class="reset-btn" @click="resetSelection">Reset</button>
                </div>
                <input v-model="usecaseFilter" placeholder="Search use cases..." class="tag-search" />
                <div class="tag-list tag-scroll">
                <span
                    v-for="use in filteredUseCases"
                    :key="use"
                    :class="['tag', { selected: selectedUseCases.includes(use) }]"
                    @click="toggleUseCase(use)"
                >{{ use }}</span>
                </div>
            </div>
            <div class="recommend-column">
                <h4>Charts recommended</h4>
                <div v-if="filteredCharts.length === 0" class="no-result">Select labels</div>
                <div v-for="chart in filteredCharts" :key="chart.name" class="chart-recommend-item">
                    <span class="chart-icon">{{ chart.icon }}</span>
                    <span class="chart-name">{{ chart.name }}</span>
                    <span class="chart-desc">{{ chart.description }}</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Chart Details -->
    <section id="chart-details" class="content-section">
        <ChartDetails />
    </section>

    <!-- Chart History -->
    <section id="chart-history" class="content-section">
        <h2>📜 Chart History</h2>
        <section class="content-card">
                <p>
                    The Chart History section allows you to:
                    <ul style="margin: 8px 0 8px 20px;">
                        <li>Save your generated charts for future use</li>
                        <li>Preview and restore any saved chart</li>
                        <li>Edit chart titles for easy identification</li>
                        <li>Delete charts you no longer need</li>
                    </ul>
                    <b>How to use:</b>
                    <ol style="margin: 8px 0 8px 20px;">
                        <li>After configuring and generating a chart, click <b>Save to History</b> in the configuration panel.</li>
                        <li>Click the <b>History button</b> to open the Chart History panel.</li>
                        <li><b>Click thumbnail</b> to reproduce the chart, or <b>edit/delete</b> the chart as needed.</li>
                    </ol>
                </p>
        </section>
    </section>

    <!-- Future Plans -->
    <section id="future-plans" class="content-section">
        <h2>🗓 Future Plans</h2>
        <section class="future-plans-cards">
            <div v-for="plan in futurePlans_dataVisualization" :key="plan.title" :class="['future-plan-card', { 'suggestion-card': plan.suggestion }]">
                <span class="plan-icon">{{ plan.icon }}</span>
                <div class="plan-content">
                    <b>{{ plan.title }}</b>
                    <div class="plan-desc" v-if="!plan.suggestion">{{ plan.desc }}</div>
                    <div class="plan-desc" v-else v-html="plan.desc"></div>
                </div>
            </div>
        </section>
    </section>
</div>
</template>

<script setup>
/* eslint-disable */
import { nextTick, onMounted, onUnmounted, ref, computed, reactive } from 'vue'
import ChartDetails from '../ChartDetails.vue'
import { chartsTooltipConfig } from '../../../assets/JS/Config/ChartsTooltipConfig'
import { generateChartGalleryOption } from '../../../assets/instructions/instruction_chart_gen'
import { futurePlans_dataVisualization } from '../../../assets/JS/Config/FuturePlansConfig.js'

// 接收父组件传入的非 props 属性，避免 Extraneous non-props attributes 警告
const props = defineProps({
    activeSubModule: { type: String, default: '' }
})

// 声明自定义事件，避免 Extraneous non-emits 监听器警告
const emit = defineEmits(['sectionChange', 'progressUpdate'])

const galleryChart = ref(null)

const renderGalleryChart = async () => {
    if (!galleryChart.value) return
    const chart = echarts.init(galleryChart.value)
    const option = await generateChartGalleryOption()
    chart.setOption(option)
}

const StartSteps = [
    {
        id: 'upload-data',
        title: 'Upload Data File',
        description: 'Click the "Files" button to upload data files in CSV, Excel, or other formats.',
        code: null,
        img: '/img-step/step-upload-file.gif'
    },
    {
        id: 'check-data',
        title: 'Check Data',
        description: 'Preview the uploaded data in the "Data Preview" panel to ensure it is correct.',
        code: null,
        img: '/img-step/step-check-data.gif'
    },
    {
        id: 'add-to-workspace',
        title: 'Add file to Workspace',
        description: 'Click the "Add to Workspace" button to add the selected file to your workspace.',
        code: null,
        img: '/img-step/step-add-workspace.gif'
    },
    {
        id: 'select-chart-type',
        title: 'Select Chart Type',
        description: 'Choose the appropriate visualization from 25+ chart types.',
        code: null,
        img: '/img-step/step-select-chart-type.gif'
    },
    {
        id: 'open-structure-panel',
        title: 'Open Structure Panel',
        description: 'Click the "Structure" button to open the chart structure panel.',
        code: null,
        img: '/img-step/step-open-structure-panel.gif'
    },
    {
        id: 'configure-chart',
        title: 'Configure Chart',
        description: 'Set data mapping, styles, themes, and other parameters.',
        code: null,
        img: '/img-step/step-config-chart.gif'
    },
    {
        id: 'generate-chart',
        title: 'Generate Chart',
        description: 'Click the "Apply Configuration" button to create your visualization.',
        code: null,
        img: '/img-step/step-generate-chart.gif'
    },
    {
        id: 'customize-style',
        title: 'Customization',
        description: 'Adjust styles, themes, data filters and advanced settings to meet your needs.',
        code: null,
        img: '/img-step/step-customization.gif'
    }
]

const chartCategories = [
    {
        id: 'basic',
        title: 'Basic Charts',
        icon: '📊',
        charts: [
            { id: 'line', name: 'Line Chart', icon: '📈' },
            { id: 'bar', name: 'Bar Chart', icon: '📊' },
            { id: 'pie', name: 'Pie Chart', icon: '🥧' },
            { id: 'scatter', name: 'Scatter Plot', icon: '⚬' },
            { id: 'radar', name: 'Radar Chart', icon: '📡' },
            { id: 'area', name: 'Area Chart', icon: '🌄' },
        ]
    },
    {
        id: 'geospatial',
        title: 'Geospatial Charts',
        icon: '🗺️',
        charts: [
            { id: 'geo_map', name: 'Geo of Map', icon: '🌍' },
            { id: 'geo_heatmap', name: 'Geo of Heatmap', icon: '🔥' },
            { id: 'geo_scatter', name: 'Geo of Scatter', icon: '⚬' },
            { id: 'geo_pie', name: 'Geo of Pie', icon: '🥧' }
        ]
    },
    {
        id: 'financial',
        title: 'Financial Charts',
        icon: '💹',
        charts: [
            { id: 'candlestick', name: 'Candlestick Chart', icon: '🕯️' },
        ]
    },
    {
        id: 'statistical',
        title: 'Statistical Charts',
        icon: '📋',
        charts: [
            { id: 'boxplot', name: 'Box Plot', icon: '📦' },
        ]
    },
    {
        id: 'advanced',
        title: 'Advanced Charts',
        icon: '⚡',
        charts: [
            { id: 'nightingale', name: 'Rose', icon: '🌹' },
            { id: 'doughnut', name: 'Doughnut', icon: '🍩' },
            { id: 'heatmap', name: 'Heatmap', icon: '🔥' },
            { id: 'parallel', name: 'Parallel', icon: '📏' },
            { id: 'ripple', name: 'Ripple', icon: '💧' }
        ]
    },
    {
        id: 'network',
        title: 'Network Charts',
        icon: '🕸️',
        charts: [
            { id: 'graph', name: 'Graph', icon: '🕸️' }
        ]
    },
    {
        id: 'hierarchical',
        title: 'Hierarchical Charts',
        icon: '🌳',
        charts: [
            { id: 'tree', name: 'Tree', icon: '🌳' },
            { id: 'treemap', name: 'Treemap', icon: '🗂️' },
            { id: 'sunburst', name: 'Sunburst', icon: '☀️' }
        ]
    },
    {
        id: 'flow',
        title: 'Flow Charts',
        icon: '🔄',
        charts: [
            { id: 'sankey', name: 'Sankey Diagram', icon: '🌊' },
            { id: 'funnel', name: 'Funnel', icon: '🔄' },
            { id: 'themeRiver', name: 'ThemeRiver', icon: '🌈' }
        ]
    },
    {
        id: 'indicator',
        title: 'Indicator Charts',
        icon: '📟',
        charts: [
            { id: 'gauge', name: 'Gauge', icon: '📟' }
        ]
    }
]

// --- 图表类型推荐区逻辑 ---

// 1. 生成所有唯一的标签
const allRequirements = computed(() => {
    const set = new Set()
    Object.values(chartsTooltipConfig).forEach(cfg => {
        (cfg.dataRequirements || []).forEach(r => set.add(r))
    })
    return Array.from(set)
})
const allUseCases = computed(() => {
    const set = new Set()
    Object.values(chartsTooltipConfig).forEach(cfg => {
        (cfg.useCases || []).forEach(u => set.add(u))
    })
    return Array.from(set)
})

// 搜索过滤
const requirementFilter = ref('')
const usecaseFilter = ref('')
const filteredRequirements = computed(() =>
    allRequirements.value.filter(r => r.toLowerCase().includes(requirementFilter.value.trim().toLowerCase()))
)
const filteredUseCases = computed(() =>
    allUseCases.value.filter(u => u.toLowerCase().includes(usecaseFilter.value.trim().toLowerCase()))
)

// 2. 选中标签
const selectedRequirements = reactive([])
const selectedUseCases = reactive([])

function toggleRequirement(req) {
    const idx = selectedRequirements.indexOf(req)
    if (idx === -1) selectedRequirements.push(req)
    else selectedRequirements.splice(idx, 1)
}
function toggleUseCase(use) {
    const idx = selectedUseCases.indexOf(use)
    if (idx === -1) selectedUseCases.push(use)
    else selectedUseCases.splice(idx, 1)
}
function resetSelection() {
    selectedRequirements.splice(0, selectedRequirements.length)
    selectedUseCases.splice(0, selectedUseCases.length)
}

// 3. 推荐图表筛选
const filteredCharts = computed(() => {
    if (selectedRequirements.length === 0 && selectedUseCases.length === 0) return []
    const iconMap = {
        Line: '📈', Bar: '📊', Pie: '🥧', Scatter: '⚬', Radar: '📡', Boxplot: '📦',
        Heatmap: '🔥', Graph: '🕸️', Tree: '🌳', Treemap: '🗂️', Sunburst: '☀️',
        Parallel: '📏', Sankey: '🌊', Funnel: '🔄', Gauge: '📟',
        Candlestick: '🕯️', PictorialBar: '🖼️', ThemeRiver: '🌈', Calendar: '📅',
        'GEO/MAP': '🌍'
    }
    return Object.entries(chartsTooltipConfig)
        .filter(([name, cfg]) => {
        // “与”逻辑：所有选中的标签都要被图表包含
        const reqHit = selectedRequirements.length === 0 || selectedRequirements.every(r => (cfg.dataRequirements || []).includes(r))
        const useHit = selectedUseCases.length === 0 || selectedUseCases.every(u => (cfg.useCases || []).includes(u))
        return reqHit && useHit
        })
        .map(([name, cfg]) => ({
        name,
        icon: iconMap[name] || '📊',
        description: cfg.description
        }))
})

const basicCharts = [
    {
        id: 'line',
        name: 'Line Chart',
        icon: '📈',
        description: 'Suitable for showing data trends over time',
        features: ['Time Series', 'Trend Analysis', 'Multi-line Comparison']
    },
    {
        id: 'bar',
        name: 'Bar Chart',
        icon: '📊',
        description: 'Suitable for comparing values across different categories',
        features: ['Category Comparison', 'Ranked Display', 'Combined Charts']
    },
    {
        id: 'pie',
        name: 'Pie Chart',
        icon: '🥧',
        description: 'Suitable for showing proportions of parts to the whole',
        features: ['Proportion Analysis', 'Donut Chart', 'Rose Chart']
    },
    {
        id: 'scatter',
        name: 'Scatter Plot',
        icon: '⚬',
        description: 'Suitable for exploring relationships between two variables',
        features: ['Correlation Analysis', 'Bubble Chart', 'Cluster Display']
    }
]

const advancedCharts = [
    {
        id: 'sankey',
        name: 'Sankey Diagram',
        icon: '🌊',
        description: 'Suitable for showing data flow and transformation processes',
        features: ['Process Analysis', 'Energy Flow', 'Path Tracking']
    },
    {
        id: 'sunburst',
        name: 'Sunburst Chart',
        icon: '☀️',
        description: 'Suitable for displaying hierarchical data',
        features: ['Hierarchical Relationships', 'Drill-down Analysis', 'Proportion Display']
    },
    {
        id: 'parallel',
        name: 'Parallel Coordinates',
        icon: '📏',
        description: 'Suitable for comparative analysis of multi-dimensional data',
        features: ['Multi-dimensional Comparison', 'Pattern Discovery', 'Anomaly Detection']
    },
    {
        id: 'radar',
        name: 'Radar Chart',
        icon: '📡',
        description: 'Suitable for multi-dimensional comprehensive evaluation',
        features: ['Comprehensive Evaluation', 'Capability Analysis', 'Comparison Display']
    }
]


// Listen to scroll, update current section
const handleScroll = () => {
    const sections = document.querySelectorAll('.content-section')
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const offsetTop = section.offsetTop - 100
        
        if (scrollTop >= offsetTop) {
            emit('sectionChange', section.id)
            break
        }
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    emit('sectionChange', 'chart-types')
    nextTick(async () => {
        await renderGalleryChart()
    })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '../../../assets/CSS/DataVisualization_instruction.css';
</style>