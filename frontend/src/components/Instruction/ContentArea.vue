<template>
<div class="content-area">
    <!-- 正常内容 -->
    <div class="module-content">
        <!-- 快速开始 -->
        <QuickStart
            v-if="activeModule === 'quick-start'"
            @section-change="$emit('section-change', $event)"
        />

        <!-- 数据可视化 -->
        <DataVisualization
            v-else-if="activeModule === 'data-visualization'"
            :active-sub-module="activeSubModule"
            @section-change="$emit('section-change', $event)"
            @progress-update="$emit('progress-update', $event)"
        />

        <!-- 数据预处理 -->
        <DataPreprocessing
            v-else-if="activeModule === 'data-preprocessing'"
            :active-sub-module="activeSubModule"
            @section-change="$emit('section-change', $event)"
        />

        <!-- 数学建模 -->
        <MathematicalModeling
            v-else-if="activeModule === 'mathematical-modeling'"
            :active-sub-module="activeSubModule"
            @section-change="$emit('section-change', $event)"
        />

        <!-- 开发者指南 -->
        <DeveloperGuide
            v-else-if="activeModule === 'developer-guide'"
            :active-sub-module="activeSubModule"
            @section-change="$emit('section-change', $event)"
        />

        <!-- 默认内容 -->
        <div v-else class="default-content">
            <h2>👋 欢迎使用 Fuck Charts</h2>
            <p>请选择左侧导航来查看具体内容。</p>
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import QuickStart from './modules/QuickStart.vue'
import DataVisualization from './modules/DataVisualization.vue'
import DataPreprocessing from './modules/DataPreprocessing.vue'
import MathematicalModeling from './modules/MathematicalModeling.vue'
import DeveloperGuide from './modules/DeveloperGuide.vue'

const props = defineProps({
    activeModule: {
        type: String,
        required: true
    },
    activeSubModule: {
        type: String,
        default: ''
    },
    searchResults: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['section-change', 'progress-update', 'clear-search'])

const navigateToResult = (result) => {
    // 导航到搜索结果
    emit('section-change', result.id)
}
</script>

<style scoped>
@import '../../assets/CSS/ContentArea_instruction.css';
</style>
