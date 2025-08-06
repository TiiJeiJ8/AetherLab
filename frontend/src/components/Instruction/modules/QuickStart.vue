<template>
<div class="quick-start-module quick-start">
    <section class="content-section">
        <!-- LOGO -->
        <h1 style="user-select: none;"><span class="float-rocket-icon">🚀</span><br>Fast Start</h1>
        <p class="section-description" style="margin-bottom: 5%">Welcome to AetherLab! This is a powerful platform for data visualization, processing, and modeling.</p>

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

    <!-- Overview Section -->
    <section id="overview" class="content-section">
        <!-- What is AetherLab -->
        <section id="what-is-aetherLab" class="content-section">
            <h2>❓ What is AetherLab</h2>
            <div class="content-card">
                <p>AetherLab is a lightweight data processing and visualization tool for individuals and small teams. Built on the ECharts library and a Flask + Vue hybrid architecture, it enables multi-user collaboration over a local area network (LAN).</p>
                <ul>
                <li>Supports 15+ chart types</li>
                <li>Flexible data filtering</li>
                <li>Powerful official theme system</li>
                <li>LAN multi-user collaboration</li>
                <!--todo More -->
                </ul>
            </div>
        </section>

        <!-- Key Features -->
        <section id="key-features" class="content-section">
        <h2>⭐ Key Features</h2>
        <div class="feature-grid">
            <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            </div>
        </div>
    </div>
    </section>

    <!-- Your First Chart -->
    <section id="first-chart" class="content-section">
    <h2>🎯 Create Your First Chart</h2>
    <div class="steps-container">
        <div class="step-item" v-for="(step, index) in quickStartSteps" :key="step.id">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
            <div v-if="step.code" class="code-example">
            <pre><code>{{ step.code }}</code></pre>
            </div>
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

const features = [
    {
        id: 'visualization',
        icon: '📊',
        title: 'Data Visualization',
        description: 'Supports 15+ chart types, no coding required for professional data presentation.'
    },
    {
        id: 'themes',
        icon: '🎨',
        title: 'Rich Themes',
        description: 'Multiple built-in themes, supports custom styles.'
    },
    {
        id: 'data',
        icon: '📁',
        title: 'Flexible Data Preprocessing',
        description: 'Supports various data formats, provides powerful data cleaning and transformation.'
    },
    {
        id: 'security',
        icon: '🔒',
        title: 'Data Security',
        description: 'All operations are performed locally to protect user privacy.'
    },
    {
        id: 'lowBurden',
        icon: '🛠️',
        title: 'Frontend-Backend Separation',
        description: 'Separate frontend (input/display) and backend (high-performance computing on a local LAN host).'
    },
    {
        id: 'collaboration',
        icon: '👥',
        title: 'Multi-user Collaboration',
        description: 'Supports simultaneous use by multiple users in a LAN.'
    },
    //todo More
]

const quickStartSteps = [
    {
        id: 'upload-data',
        title: 'Upload Data File',
        description: 'Click the "Files" button to upload data files in CSV, Excel, or other formats.',
        code: null
    },
    {
        id: 'select-chart-type',
        title: 'Select Chart Type',
        description: 'Choose the appropriate visualization from 20+ chart types.',
        code: null
    },
    {
        id: 'configure-chart',
        title: 'Configure Chart',
        description: 'Set data mapping, styles, themes, and other parameters.',
        code: null
    },
    {
        id: 'generate-chart',
        title: 'Generate Chart',
        description: 'Click the "Generate Chart" button to create your visualization.',
        code: null
    },
    {
        id: 'customize-style',
        title: 'Customize Chart',
        description: 'Adjust styles, themes, data filters and advanced settings to meet your needs.',
        code: null
    }
]

// 监听滚动，更新当前章节
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
    emit('section-change', 'overview')
    nextTick(async () => {
        await renderArchChart()
    })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '../../../assets/CSS/QuickStart_instruction.css';
</style>
