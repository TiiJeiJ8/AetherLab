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
        <div ref="galleryChart" style="width:100%;height:700px;"></div>
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

    <section id="basic-charts" class="content-section">
    <h2>📈 Basic Charts</h2>
    <div class="charts-showcase">
        <div class="chart-showcase" v-for="chart in basicCharts" :key="chart.id">
        <div class="chart-preview">
            <span class="preview-icon">{{ chart.icon }}</span>
        </div>
        <div class="chart-info">
            <h4>{{ chart.name }}</h4>
            <p>{{ chart.description }}</p>
            <div class="chart-features">
            <span class="feature-tag" v-for="feature in chart.features" :key="feature">
                {{ feature }}
            </span>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="advanced-charts" class="content-section">
    <h2>🎯 Advanced Charts</h2>
    <div class="charts-showcase">
        <div class="chart-showcase" v-for="chart in advancedCharts" :key="chart.id">
        <div class="chart-preview">
            <span class="preview-icon">{{ chart.icon }}</span>
        </div>
        <div class="chart-info">
            <h4>{{ chart.name }}</h4>
            <p>{{ chart.description }}</p>
            <div class="chart-features">
            <span class="feature-tag" v-for="feature in chart.features" :key="feature">
                {{ feature }}
            </span>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="best-practices" class="content-section">
    <h2>💡 Best Practices</h2>
    <div class="practices-list">
        <div class="practice-item" v-for="practice in bestPractices" :key="practice.id">
        <div class="practice-icon">{{ practice.icon }}</div>
        <div class="practice-content">
            <h4>{{ practice.title }}</h4>
            <p>{{ practice.description }}</p>
            <ul v-if="practice.tips">
            <li v-for="tip in practice.tips" :key="tip">{{ tip }}</li>
            </ul>
        </div>
        </div>
    </div>
    </section>
</div>
</template>

<script setup>
/* eslint-disable */
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { generateChartGalleryOption } from '../../../assets/instructions/instruction_chart_gen'
const galleryChart = ref(null)

const renderGalleryChart = async () => {
    if (!galleryChart.value) return
    const chart = echarts.init(galleryChart.value)
    const option = await generateChartGalleryOption()
    chart.setOption(option)
}

const emit = defineEmits(['section-change'])

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
        emit('section-change', section.id)
        break
        }
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    emit('section-change', 'chart-types')
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
