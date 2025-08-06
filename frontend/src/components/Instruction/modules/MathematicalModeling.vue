<template>
<div class="mathematical-modeling-module">
    <section id="overview" class="content-section">
    <h1 style="user-select: none;"><span class="float-pencil-icon">✏️</span><br>Modeling</h1>
    <p class="section-description" style="margin-bottom: 5%">
        This section introduces the mathematical modeling features of Fuck Charts, including clustering, regression, and predictive analysis.
    </p>
    </section>

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

    <section id="modeling-steps" class="content-section">
    <h2>📝 Modeling Steps</h2>
    <div class="steps-container">
        <div class="step-item" v-for="(step, index) in modelingSteps" :key="step.id">
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
const features = [
    {
        id: 'clustering',
        icon: '🔗',
        title: 'Clustering Analysis',
        description: 'Supports K-means and hierarchical clustering for data grouping.'
    },
    {
        id: 'regression',
        icon: '📈',
        title: 'Regression Analysis',
        description: 'Provides linear and polynomial regression modeling.'
    },
    {
        id: 'prediction',
        icon: '🔮',
        title: 'Predictive Modeling',
        description: 'Enables time series and trend prediction.'
    },
    // Add more features as needed
]

const modelingSteps = [
    {
        id: 'prepare',
        title: 'Prepare Data',
        description: 'Clean and preprocess your data for modeling.',
        code: null
    },
    {
        id: 'select-model',
        title: 'Select Model Type',
        description: 'Choose the appropriate modeling method (e.g., clustering, regression).',
        code: null
    },
    {
        id: 'configure',
        title: 'Configure Parameters',
        description: 'Set model parameters and options.',
        code: null
    },
    {
        id: 'run',
        title: 'Run Modeling',
        description: 'Execute the modeling process and view results.',
        code: null
    }
]
</script>

<style scoped>
@import '../../../assets/CSS/MathematicalModeling_instruction.css';
</style>