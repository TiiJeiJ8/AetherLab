<template>
<div class="data-visualization-module">
    <section id="chart-types" class="content-section">
    <h1 style="user-select: none;"><span class="float-chart-icon">📊</span><br>Visualization</h1>
    <p class="section-description" style="margin-bottom: 15%">Explore the rich chart types and visualization features provided by AetherLab.</p>

    <div class="chart-categories">
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

    <section id="chart-selection" class="content-section">
    <h2>🤔 How to Choose the Right Chart</h2>
    <div class="selection-guide">
        <div class="guide-item" v-for="guide in selectionGuides" :key="guide.id">
        <div class="guide-scenario">
            <h4>{{ guide.scenario }}</h4>
            <p>{{ guide.description }}</p>
        </div>
        <div class="recommended-charts">
            <span class="recommend-label">Recommended Charts：</span>
            <div class="chart-tags">
            <span class="chart-tag" v-for="chart in guide.charts" :key="chart">
                {{ chart }}
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
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['section-change'])

const chartCategories = [
    {
        id: 'basic',
        title: 'Basic Charts',
        icon: '📊',
        charts: [
        { id: 'line', name: 'Line Chart', icon: '📈' },
        { id: 'bar', name: 'Bar Chart', icon: '📊' },
        { id: 'pie', name: 'Pie Chart', icon: '🥧' },
        { id: 'scatter', name: 'Scatter Plot', icon: '⚬' }
        ]
    },
    {
        id: 'statistical',
        title: 'Statistical Charts',
        icon: '📋',
        charts: [
        { id: 'boxplot', name: 'Box Plot', icon: '📦' },
        { id: 'histogram', name: 'Histogram', icon: '📊' },
        { id: 'violin', name: 'Violin Plot', icon: '🎻' },
        { id: 'heatmap', name: 'Heatmap', icon: '🔥' }
        ]
    },
    {
        id: 'geographical',
        title: 'Geographical Charts',
        icon: '🗺️',
        charts: [
        { id: 'map', name: 'Map', icon: '🌍' },
        { id: 'geo_heatmap', name: 'Geo Heatmap', icon: '🔥' }
        ]
    },
    {
        id: 'relationship',
        title: 'Relationship Charts',
        icon: '🕸️',
        charts: [
        { id: 'network', name: 'Network Graph', icon: '🕸️' },
        { id: 'sankey', name: 'Sankey Diagram', icon: '🌊' },
        { id: 'tree', name: 'Tree Chart', icon: '🌳' },
        { id: 'graph', name: 'Graph Chart', icon: '🔗' }
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

const selectionGuides = [
    {
        id: 'comparison',
        scenario: 'Compare Data',
        description: 'When you need to compare numerical differences between different categories or groups',
        charts: ['Bar Chart', 'Column Chart', 'Radar Chart', 'Parallel Coordinates']
    },
    {
        id: 'trend',
        scenario: 'Show Trends',
        description: 'When you need to show how data changes over time',
        charts: ['Line Chart', 'Area Chart', 'Stream Graph']
    },
    {
        id: 'proportion',
        scenario: 'Display Proportions',
        description: 'When you need to show the proportional relationship of each part to the whole',
        charts: ['Pie Chart', 'Donut Chart', 'Sunburst Chart', 'Treemap']
    },
    {
        id: 'relationship',
        scenario: 'Analyze Relationships',
        description: 'When you need to explore correlations or relationships between variables',
        charts: ['Scatter Plot', 'Bubble Chart', 'Heatmap', 'Network Graph']
    },
    {
        id: 'distribution',
        scenario: 'Distribution Analysis',
        description: 'When you need to analyze the distribution characteristics of data',
        charts: ['Histogram', 'Box Plot', 'Violin Plot', 'Density Plot']
    }
]

const bestPractices = [
    {
        id: 'data-quality',
        icon: '🎯',
        title: 'Data Quality',
        description: 'Ensuring data accuracy and completeness is the foundation of creating effective visualizations',
        tips: [
        'Check for missing values and outliers in data',
        'Ensure correct data types',
        'Verify logical consistency of data'
        ]
    },
    {
        id: 'color-usage',
        icon: '🎨',
        title: 'Color Usage',
        description: 'Proper use of colors can enhance chart readability and aesthetics',
        tips: [
        'Use colorblind-friendly color schemes',
        'Avoid too many colors causing visual confusion',
        'Use colors to highlight important information'
        ]
    },
    {
        id: 'clarity',
        icon: '👁️',
        title: 'Clarity',
        description: 'Charts should be clear and easy to understand, able to convey information quickly',
        tips: [
        'Add clear titles and labels',
        'Set appropriate axis ranges',
        'Avoid overly complex charts'
        ]
    },
    {
        id: 'interactivity',
        icon: '🖱️',
        title: 'Interactivity',
        description: 'Appropriate interactive features can enhance user experience',
        tips: [
        'Add hover tooltip information',
        'Support zoom and filter functions',
        'Provide data drill-down capabilities'
        ]
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
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '../../../assets/CSS/DataVisualization_instruction.css';
</style>
