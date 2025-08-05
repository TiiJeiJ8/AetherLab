<template>
<div class="developer-guide center-content">
    <section id="mathematic-modeling" class="content-section">
        <h1>👨‍💻<br>开发指南</h1>
        <p class="module-description">
        为开发者提供扩展和自定义 Fuck Charts 的详细指南。
        </p>

        <div class="content-sections">
        <section class="content-section">
            <h3>🏗️ 项目架构</h3>
            <p>了解项目的整体架构和核心概念。</p>
            <div class="architecture-overview">
            <div class="arch-item">
                <span class="arch-icon">⚡</span>
                <div class="arch-content">
                <h4>Vue 3 + Composition API</h4>
                <p>现代化的前端框架，响应式数据管理</p>
                </div>
            </div>
            <div class="arch-item">
                <span class="arch-icon">📊</span>
                <div class="arch-content">
                <h4>ECharts 图表引擎</h4>
                <p>强大的数据可视化图表库</p>
                </div>
            </div>
            <div class="arch-item">
                <span class="arch-icon">🎨</span>
                <div class="arch-content">
                <h4>模块化主题系统</h4>
                <p>可扩展的主题和样式管理</p>
                </div>
            </div>
            </div>
        </section>

        <section class="content-section">
            <h3>🔧 自定义图表类型</h3>
            <p>学习如何添加新的图表类型和配置选项。</p>
            <div class="code-example">
            <h4>添加新图表类型的步骤：</h4>
            <ol>
                <li>在 <code>ChartTypeConfig.js</code> 中定义配置</li>
                <li>在 <code>chartOptions/</code> 目录创建图表生成器</li>
                <li>在 <code>echartOptionUtils.js</code> 中注册类型</li>
                <li>添加数据处理器到 <code>dataMergeUtils.js</code></li>
            </ol>
            </div>
        </section>

        <section class="content-section">
            <h3>🎨 主题开发</h3>
            <p>创建和自定义图表主题。</p>
            <div class="theme-info">
            <div class="theme-item">
                <span class="theme-color" style="background: #5470c6;"></span>
                <span>主色调配置</span>
            </div>
            <div class="theme-item">
                <span class="theme-color" style="background: #91cc75;"></span>
                <span>辅助色彩搭配</span>
            </div>
            <div class="theme-item">
                <span class="theme-color" style="background: #fac858;"></span>
                <span>强调色设计</span>
            </div>
            </div>
        </section>

        <section class="content-section">
            <h3>📚 API 文档</h3>
            <p>核心 API 和组件接口说明。</p>
            <div class="api-list">
            <div class="api-item">
                <code>generateEChartOption()</code>
                <span>图表选项生成器</span>
            </div>
            <div class="api-item">
                <code>mergeChartData()</code>
                <span>数据合并处理器</span>
            </div>
            <div class="api-item">
                <code>registerChartType()</code>
                <span>图表类型注册器</span>
            </div>
            </div>
        </section>

        <section class="content-section">
            <h3>🚀 部署指南</h3>
            <p>应用部署和生产环境配置。</p>
            <div class="deployment-steps">
            <div class="step-item">
                <span class="step-number">1</span>
                <div class="step-content">
                <h4>构建项目</h4>
                <code>npm run build</code>
                </div>
            </div>
            <div class="step-item">
                <span class="step-number">2</span>
                <div class="step-content">
                <h4>配置服务器</h4>
                <p>配置 Nginx 或其他 Web 服务器</p>
                </div>
            </div>
            <div class="step-item">
                <span class="step-number">3</span>
                <div class="step-content">
                <h4>环境变量</h4>
                <p>设置生产环境相关配置</p>
                </div>
            </div>
            </div>
        </section>
        </div>

        <div class="contribution-section">
        <h3>🤝 贡献指南</h3>
        <p>欢迎为 Fuck Charts 项目贡献代码！</p>
        <div class="contribution-links">
            <a href="https://github.com/TiiJeiJ8/Fuck-Charts" target="_blank" class="contrib-link">
            <span class="contrib-icon">🐙</span>
            <span>GitHub 仓库</span>
            </a>
            <a href="https://github.com/TiiJeiJ8/Fuck-Charts/issues" target="_blank" class="contrib-link">
            <span class="contrib-icon">🐛</span>
            <span>问题反馈</span>
            </a>
            <a href="https://github.com/TiiJeiJ8/Fuck-Charts/pulls" target="_blank" class="contrib-link">
            <span class="contrib-icon">🔄</span>
            <span>提交 PR</span>
            </a>
        </div>
        </div>
    </section>
</div>
</template>

<script setup>
/* eslint-disable */
// 开发者指南模块
</script>

<style scoped>
@import '../../../assets/CSS/DeveloperGuide_instruction.css';
</style>
