<template>
<div class="preprocessing-display-container">
    <div v-if="!hasDataInWorkspace" class="empty-tip">
        <AnimateIcon :icon-list="iconList" :interval="7500" :fade="600" />
        <div class="empty-title">No Data Available</div>
        <div class="empty-desc">Please upload your data to <span class="faststart">get started with PREPROCESSING!</span></div>
    </div>
    <div v-else class="preprocessing-content">
        <div v-if="props.activeSidebarId === 'quality'">
            <!-- 质量分析内容 -->
            <h2>Data Quality Analysis</h2>
            <p>Here you can analyze the quality of your data, including missing values, duplicates, and outliers.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'raw-preview'">
            <!-- 原始数据预览内容 -->
            <h2>Raw Data Preview</h2>
            <p>Here you can preview the raw data before any preprocessing steps are applied.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'processed-preview'">
            <!-- 预处理后数据预览内容 -->
            <h2>Processed Data Preview</h2>
            <p>Here you can preview the data after preprocessing steps have been applied.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'remove-duplicates'">
            <!-- 去重内容 -->
            <h2>Remove Duplicates</h2>
            <p>Here you can identify and remove duplicate records from your dataset.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'outlier-detect'">
            <!-- 异常值检测内容 -->
            <h2>Outlier Detection</h2>
            <p>Here you can detect and handle outliers in your dataset.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'normalize'">
            <!-- 归一化内容 -->
            <h2>Data Normalization</h2>
            <p>Here you can apply normalization techniques to scale your data.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'encode'">
            <!-- 编码内容 -->
            <h2>Data Encoding</h2>
            <p>Here you can encode categorical variables into numerical format.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'filter-rows'">
            <!-- 行过滤内容 -->
            <h2>Row Filtering</h2>
            <p>Here you can filter rows based on specific criteria.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'filter-columns'">
            <!-- 列过滤内容 -->
            <h2>Column Filtering</h2>
            <p>Here you can filter columns based on specific criteria.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'feature-select'">
            <!-- 特征选择内容 -->
            <h2>Feature Selection</h2>
            <p>Here you can select important features for your analysis.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'feature-generate'">
            <!-- 特征生成内容 -->
            <h2>Feature Generation</h2>
            <p>Here you can generate new features from existing data.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'fill-missing'">
            <!-- 填充缺失值内容 -->
            <h2>Fill Missing Values</h2>
            <p>Here you can fill missing values using various strategies.</p>
        </div>
        <div v-else-if="props.activeSidebarId === 'impute-advanced'">
            <!-- 高级插补内容 -->
            <h2>Advanced Imputation</h2>
            <p>Here you can apply advanced imputation techniques to handle missing data.</p>
        </div>
        <div v-else>
            <h2>Welcome to Data Preprocessing</h2>
            <p>Select a module from the sidebar to get started.</p>
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted, onBeforeUnmount, computed, defineProps } from 'vue'
import LineChartIcon from '../svg/LineChartIcon.vue'
import BarChartIcon from '../svg/BarChartIcon.vue'
import PieChartIcon from '../svg/PieChartIcon.vue'
import ScatterChartIcon from '../svg/ScatterChartIcon.vue'
import MapChartIcon from '../svg/MapChartIcon.vue'
import KlineChartIcon from '../svg/KlineChartIcon.vue'
import RadarChartIcon from '../svg/RadarChartIcon.vue'
import BoxplotChartIcon from '../svg/BoxplotChartIcon.vue'
import HeatmapChartIcon from '../svg/HeatmapChartIcon.vue'
import GraphChartIcon from '../svg/GraphChartIcon.vue'
import TreeChartIcon from '../svg/TreeChartIcon.vue'
import TreemapChartIcon from '../svg/TreemapChartIcon.vue'
import SunburstChartIcon from '../svg/SunburstChartIcon.vue'
import ParallelChartIcon from '../svg/ParallelChartIcon.vue'
import SankeyChartIcon from '../svg/SankeyChartIcon.vue'
import FunnelChartIcon from '../svg/FunnelChartIcon.vue'
import GaugeChartIcon from '../svg/GaugeChartIcon.vue'
import PictorialBarChartIcon from '../svg/PictorialBarChartIcon.vue'
import ThemeRiverChartIcon from '../svg/ThemeRiverChartIcon.vue'
import CalendarChartIcon from '../svg/CalendarChartIcon.vue'
import AnimateIcon from '../Common/AnimateIcon.vue';
import { workspaceFiles } from '@/assets/JS/utils/dataStructureOptimize.js'

const iconList = [
    BarChartIcon,
    LineChartIcon,
    PieChartIcon,
    ScatterChartIcon,
    MapChartIcon,
    KlineChartIcon,
    RadarChartIcon,
    BoxplotChartIcon,
    HeatmapChartIcon,
    GraphChartIcon,
    TreeChartIcon,
    TreemapChartIcon,
    SunburstChartIcon,
    ParallelChartIcon,
    SankeyChartIcon,
    FunnelChartIcon,
    GaugeChartIcon,
    PictorialBarChartIcon,
    ThemeRiverChartIcon,
    CalendarChartIcon,
]
const iconIndex = ref(0)
const iconOpacity = ref(1)
let iconTimer = null
let fadeTimer = null

// 开启图标轮播
function startIconLoop() {
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
    iconOpacity.value = 1
    iconTimer = setInterval(() => {
        // 先淡出
        iconOpacity.value = 0
        fadeTimer = setTimeout(() => {
            iconIndex.value = (iconIndex.value + 1) % iconList.length
            iconOpacity.value = 1
        }, 400)
    }, 3500)
}

onMounted(() => {
    startIconLoop()
})
onBeforeUnmount(() => {
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
})

// 接收来自父组件的 activeSidebarId prop
const props = defineProps({
    activeSidebarId: {
        type: String,
        default: ''
    }
})

const hasDataInWorkspace = computed(() => {
    // 检查是否有有效数据文件
    if (!workspaceFiles.value || workspaceFiles.value.length === 0) return false
    // 至少有一个文件有 headers 且有数据行
    return workspaceFiles.value.some(file => {
        // 兼容多种数据结构
        if (Array.isArray(file.data) && file.data.length > 0 && Array.isArray(file.headers) && file.headers.length > 0) {
        return true
        }
        // 兼容 parsedData
        if (Array.isArray(file.parsedData) && file.parsedData.length > 0) {
        return true
        }
        return false
    })
})
</script>

<style scoped>
.preprocessing-display-container {
    width: 100%;
    height: 100%;
    min-height: clamp(300px, 40vh, 600px);
    max-width: 100vw;
    max-height: 80vh;
    background: var(--bg-color, #fff);
    border-radius: clamp(8px, 2vw, 12px);
    border: 1px solid var(--border-color, #ddd);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 2vw, 20px) clamp(32px, 4vw, 48px); /* 增大左右内边距 */
    overflow-x: auto; /* 横向可滚动，防止legend溢出 */
    overflow-y: auto;
}
.empty-tip {
    color: #888;
    text-align: center;
    letter-spacing: 1px;
    padding: 24px 10px 10px 10px;
    user-select: none;
    background: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.empty-title {
    font-size: 1.25em;
    font-weight: bold;
    color: #4F8EF7;
    margin-bottom: 6px;
}
.empty-desc {
    font-size: 1em;
    color: #666;
    margin-top: 2px;
}
.faststart {
    color: #FFB300;
    font-weight: bold;
}
</style>