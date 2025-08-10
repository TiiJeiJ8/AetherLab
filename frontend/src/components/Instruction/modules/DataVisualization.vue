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
            <img v-if="step.img" :src="isDark && step.img_dark ? step.img_dark : step.img" alt="step image" class="step-image" />
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

    <!-- Data Filter -->
    <section id="data-filter" class="content-section">
        <h2>🔍 Data Filter</h2>
        <section class="content-card">
            <p>Use the data filter to refine your chart data and improve visualization accuracy. The filtering system supports multiple conditions with flexible logic operations.</p>

            <h3>Filter Features</h3>
            <ul style="margin: 8px 0 8px 20px;">
                <li><b>Multiple Data Types:</b> Number, String, Category, Boolean, Date</li>
                <li><b>Flexible Operators:</b> Equals, Contains, Greater/Less Than, In/Not In</li>
                <li><b>Logic Operations:</b> AND/OR between multiple conditions</li>
                <li><b>Dynamic Values:</b> Category fields show available options automatically</li>
            </ul>

            <h3>How to Use Data Filter</h3>
            <ol style="margin: 8px 0 8px 20px;">
                <li><b>Add Filter Condition:</b> Click "+ Add Condition" button</li>
                <li><b>Select Field:</b> Choose from mapped data fields in your chart</li>
                <li><b>Choose Operator:</b> Select comparison method based on field type</li>
                <li><b>Set Value:</b> Enter filter value or select from dropdown (for categories)</li>
                <li><b>Logic Toggle:</b> Switch between AND/OR for multiple conditions</li>
                <li><b>Remove Condition:</b> Click "×" button to delete unwanted filters</li>
            </ol>

            <h3>Operator Types by Data Type</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin: 12px 0;">
                <div class="filter-type-card">
                    <b>🔢 Number/Integer</b>
                    <ul style="font-size: 13px; margin-top: 4px;">
                        <li>Equals, Not Equals</li>
                        <li>Greater/Less Than</li>
                        <li>Greater/Less Than or Equal</li>
                    </ul>
                </div>
                <div class="filter-type-card">
                    <b>📝 String</b>
                    <ul style="font-size: 13px; margin-top: 4px;">
                        <li>Equals, Not Equals</li>
                        <li>Contains, Not Contains</li>
                        <li>Starts With, Ends With</li>
                    </ul>
                </div>
                <div class="filter-type-card">
                    <b>🏷️ Category</b>
                    <ul style="font-size: 13px; margin-top: 4px;">
                        <li>Equals, Not Equals</li>
                        <li>In (multiple selection)</li>
                        <li>Not In (exclusion)</li>
                    </ul>
                </div>
                <div class="filter-type-card">
                    <b>📅 Date</b>
                    <ul style="font-size: 13px; margin-top: 4px;">
                        <li>Equals, Not Equals</li>
                        <li>Before, After</li>
                    </ul>
                </div>
            </div>

            <h3>Filter Tips</h3>
            <ul style="margin: 8px 0 8px 20px;">
                <li><b>Field Selection:</b> Only mapped chart fields are available for filtering</li>
                <li><b>Category Values:</b> Dropdown shows unique values from your data automatically</li>
                <li><b>Multiple Selection:</b> Use "In" operator for category fields to select multiple values</li>
                <li><b>Logic Combination:</b> AND requires all conditions to be true, OR requires any condition to be true</li>
                <li><b>Real-time Update:</b> Filters apply automatically as you configure them</li>
                <li><b>Validation:</b> All fields must be completed before filter becomes active</li>
            </ul>

            <h3>Common Use Cases</h3>
            <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin: 8px 0;">
                <b>Example 1:</b> Sales data filtering<br>
                <span>• </span>
                <code style="font-size: 16px; color: var(--text-secondary);border: 1px solid var(--border-color);border-radius: 10px;padding: 4px">Region equals "North America" AND Sales &gt; 10000</code><br><br>
                <b>Example 2:</b> Category analysis<br>
                <span>• </span>
                <code style="font-size: 16px; color: var(--text-secondary);border: 1px solid var(--border-color);border-radius: 10px;padding: 4px">Product Type in ["Electronics", "Books"] OR Price &lt; 50</code><br><br>
                <b>Example 3:</b> Text search<br>
                <span>• </span>
                <code style="font-size: 16px; color: var(--text-secondary);border: 1px solid var(--border-color);border-radius: 10px;padding: 4px">Product Name contains "Phone" AND Description not contains "Refurbished"</code>
            </div>
        </section>
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

    <!-- 疑难解惑 -->
    <section id="troubleshooting" class="content-section">
        <h2>🛠 Troubleshooting</h2>
        <section class="troubleshooting-cards">
            <div class="troubleshooting-card" v-for="(tip, idx) in troubleshootingTips" :key="idx">
                <span class="troubleshooting-icon">💡</span>
                <span v-html="tip"></span>
            </div>
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
import { generateChartGalleryOption } from '../../../assets/JS/instructions/instruction_chart_gen.js'
import { futurePlans_dataVisualization } from '../../../assets/JS/Config/FuturePlansConfig.js'
import { instructionConfig } from '../../../assets/JS/instructions/config.js'

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

const StartSteps = instructionConfig['StartSteps']

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

const troubleshootingTips = [
    'If the date format data cannot be recognized correctly, please check if the column name is "date/time/日期/时间", and automatic parsing and recognition will be implemented in the future',
    'Ensure your data is properly formatted and mapped to the chart fields.',
    'Check for any errors in the console log for more details.',
    'If a chart fails to render, try refreshing the page or clearing your browser cache or click "Reset Config" button.',
    'For persistent issues, please report them on our <a href="https://github.com/AetherLab/AetherLab/issues">GitHub Issues</a> page.'
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

// 主题状态（本地维护）
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')

// 主题切换事件处理
function handler(e) {
    const colorScheme = e?.detail?.colorScheme
    isDark.value = colorScheme === 'dark'
}

onMounted(() => {
    window.addEventListener('app-theme-change', handler)
    window.addEventListener('scroll', handleScroll)
    emit('sectionChange', 'chart-types')
    nextTick(async () => {
        await renderGalleryChart()
    })
})

onUnmounted(() => {
    window.removeEventListener('app-theme-change', handler)
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '../../../assets/CSS/DataVisualization_instruction.css';

.troubleshooting-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 12px;
}
.troubleshooting-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px 20px;
    min-width: 400px;
    max-width: 400px;
    flex: 1 1 220px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
.troubleshooting-icon {
    font-size: 1.5em;
    margin-right: 8px;
}
</style>