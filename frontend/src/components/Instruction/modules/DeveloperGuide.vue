<template>
<div class="developer-guide-module">
    <section id="overview" class="content-section">
    <h1>👨‍💻<br>Developer Guide</h1>
    <p class="section-description" style="margin-bottom: 5%">
        This section provides guidance for developers to extend, customize, and contribute to Fuck Charts.
    </p>
    </section>

    <section id="key-features" class="content-section">
    <h2>⭐ Key Topics</h2>
    <div class="feature-grid">
        <div class="feature-card" v-for="topic in topics" :key="topic.id">
        <div class="feature-icon">{{ topic.icon }}</div>
        <h3>{{ topic.title }}</h3>
        <p>{{ topic.description }}</p>
        </div>
    </div>
    </section>

    <section id="dev-steps" class="content-section">
    <h2>🛠️ Development Steps</h2>
    <div class="steps-container">
        <div class="step-item" v-for="(step, index) in devSteps" :key="step.id">
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
const topics = [
    {
        id: 'architecture',
        icon: '🏗️',
        title: 'Architecture',
        description: 'Overview of the project structure and technology stack.'
    },
    {
        id: 'customization',
        icon: '⚙️',
        title: 'Customization',
        description: 'How to add new chart types and extend functionalities.'
    },
    {
        id: 'contribution',
        icon: '🤝',
        title: 'Contribution',
        description: 'Guidelines for contributing to the project.'
    },
    // Add more topics as needed
]

const devSteps = [
    {
        id: 'setup',
        title: 'Setup Environment',
        description: 'Clone the repository and install dependencies.',
        code: `git clone https://github.com/TiiJeiJ8/Fuck-Charts.git
    cd Fuck-Charts
    npm install`
    },
    {
        id: 'dev',
        title: 'Start Development',
        description: 'Run the development server and start coding.',
        code: `npm run dev`
    },
    {
        id: 'customize',
        title: 'Customize Features',
        description: 'Modify or add new modules as needed.',
        code: null
    },
    {
        id: 'submit',
        title: 'Submit Pull Request',
        description: 'Push your changes and submit a pull request on GitHub.',
        code: null
    }
]
</script>

<style scoped>
@import '../../../assets/CSS/DeveloperGuide_instruction.css';
</style>