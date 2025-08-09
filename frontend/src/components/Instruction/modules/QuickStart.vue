<template>
<section id="top"></section>
<div class="quick-start-module quick-start">
    <section class="content-section">
        <!-- LOGO -->
        <h1 style="user-select: none;"><span class="float-rocket-icon">🚀</span><br>Quick Start</h1>
        <p class="section-description" style="margin-bottom: 5%">Welcome to AetherLab! This is a powerful platform for data visualization, processing, and modeling.</p>

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

    <!-- Overview Section -->
    <section id="overview" class="content-section">
        <!-- What is AetherLab -->
        <section id="what-is-aetherLab" class="content-section">
            <h2>❓ What is AetherLab</h2>
            <div class="content-card">
                <p>AetherLab is a lightweight data processing and visualization tool for individuals and small teams. Built on the ECharts library and a Flask + Vue hybrid architecture, it enables multi-user collaboration over a local area network (LAN).</p>
                <ul>
                <li>Supports 25+ chart types</li>
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
        </section>

        <!-- Software Architecture -->
        <section id="architecture" class="content-section">
            <h2>🏗️ Software Architecture</h2>
            <div ref="archChart" style="width:100%;height:500px;"></div>
        </section>
    </section>

    <!-- Deployment -->
    <section id="installation" class="content-section">
        <h2>🗒 Source Code</h2>
        <section id="source-download" class="content-card">
            <p>Download the source code from my <a href="https://github.com/TiiJeiJ8/AetherLab" target="_blank">GitHub Repository</a>.</p>
            <div class="code-example" style="position: relative;">
                <span class="languageType">bash</span>
<pre style="padding-top: 24px;"><code class="language-bash">git clone https://github.com/TiiJeiJ8/AetherLab.git</code></pre>
            </div>
            <br>
            <p>Install dependencies</p>
            <ul>
                <li>Frontend <span class="tech-tag">VUE 3</span></li>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">cmd (Windows)</span>
<pre style="padding-top: 24px;">
<code class="language-bat">cd frontend
npm install</code>
</pre>
                </div>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">bash (Linux/macOS)</span>
<pre style="padding-top: 24px;">
<code class="language-bash">cd frontend
npm install</code>
</pre>
                </div>

                <li>Backend <span class="tech-tag">Flask + Python</span></li>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">cmd (Windows)</span>
<pre style="padding-top: 24px;">
<code class="language-bat">cd backend
pip install -r requirement.txt</code>
</pre>
                </div>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">bash (Linux/macOS)</span>
<pre style="padding-top: 24px;">
<code class="language-bash">cd backend
pip install -r requirement.txt</code>
</pre>
                </div>
            </ul>
            <p>Development environment startup</p>
            <ul>
                <li>Frontend Startup <span class="tech-tag">Default Port: 8000</span></li>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">cmd (Windows)</span>
<pre style="padding-top: 24px;">
<code class="language-bat">cd frontend
npm run serve</code>
</pre>
                </div>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">bash (Linux/macOS)</span>
<pre style="padding-top: 24px;">
<code class="language-bash">cd frontend
npm run serve</code>
</pre>
                </div>
                <li>Backend Startup <span class="tech-tag">Default Port: 8050</span></li>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">cmd (Windows)</span>
<pre style="padding-top: 24px;">
<code class="language-bat">cd backend
python App.py</code>
</pre>
                </div>
                <div class="code-example" style="position: relative;">
                    <span class="languageType">bash (Linux/macOS)</span>
<pre style="padding-top: 24px;">
<code class="language-bash">cd backend
python App.py</code>
</pre>
                </div>
            </ul>
        </section>
        <br>
        <h2>📦 Package</h2>
        <section id="package-download" class="content-card">
            <p>Download the source code from <a href="https://github.com/AetherLab" target="_blank">Github Repository</a></p>
            <ul>
                <li>Frontend build</li>
                <div class="code-example" style="position: relative;">
<span class="languageType">bash / cmd</span>
<pre style="padding-top: 24px;"><code class="language-bash">cd frontend
npm run build</code></pre>
                </div>
                <li>Backend build</li>
                <div class="code-example" style="position: relative;">
<span class="languageType">bash / cmd</span>
<pre style="padding-top: 24px;"><code class="language-bash">cd backend
python App.py</code></pre>
                </div>
                <p>After building, the <code>dist</code> directory will be automatically served by the Flask backend according to the directory structure below. No extra configuration is needed.</p>
                <div class="code-example" style="position: relative;">
<span class="languageType">Markdown</span>
<pre style="padding-top: 24px;"><code class="language-plaintext">AetherLab/
└── frontend/
    ├── dist
└── backend/
    ├── App.py
    ├── ...
</code></pre>
                </div>
            </ul>
            <p>After STARTUP, visit <a href="http://localhost:8080" target="_blank">http://localhost:8080</a> in your browser.</p>
            <br>
            <p>
                If you encounter any issues, please check
                <a href="https://github.com/AetherLab/vissues" target="_blank">Github Issues</a>.
            </p>
        </section>
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
            <img v-if="step.img" :src="isDark && step.img_dark ? step.img_dark : step.img" alt="step image" class="step-image" />
        </div>
        </div>
    </div>
    </section>
</div>
</template>

<script setup>
/* eslint-disable */
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { instructionConfig } from '../../../assets/JS/instructions/config.js'
// 引入 ECharts 和工具函数
import * as echarts from 'echarts'
import { generateArchitectureGraphOption } from '../../../assets/JS/instructions/instruction_chart_gen.js'
const archChart = ref(null)

const renderArchChart = async () => {
    if (!archChart.value) return
    const chart = echarts.init(archChart.value)
    const option = await generateArchitectureGraphOption()
    chart.setOption(option)
}

const emit = defineEmits(['section-change'])

const features = [
    {
        id: 'visualization',
        icon: '📊',
        title: 'Data Visualization',
        description: 'Supports 25+ chart types, no coding required for professional data presentation.'
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
    // More...
]


const quickStartSteps = instructionConfig['StartSteps']

// 主题状态（本地维护）
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')

// 主题切换事件处理
function handler(e) {
    const colorScheme = e?.detail?.colorScheme
    isDark.value = colorScheme === 'dark'
}

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
    window.addEventListener('app-theme-change', handler)
    window.addEventListener('scroll', handleScroll)
    emit('section-change', 'overview')
    nextTick(async () => {
        await renderArchChart()
    })
})

onUnmounted(() => {
    window.removeEventListener('app-theme-change', handler)
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '../../../assets/CSS/QuickStart_instruction.css';
</style>
