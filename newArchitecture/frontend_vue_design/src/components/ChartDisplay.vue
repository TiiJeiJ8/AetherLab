<template>
<div class="chart-display">
    <div v-if="!hasSeries" class="empty-tip">No Charts data</div>
    <div v-else ref="chartRef" class="chart-container"></div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    option: { type: Object, required: true }
})

const chartRef = ref(null)
let chartInstance = null

const hasSeries = computed(() => {
    return props.option && Array.isArray(props.option.series) && props.option.series.length > 0
})

function renderChart() {
    if (!hasSeries.value) return
    if (!chartInstance && chartRef.value) {
        chartInstance = echarts.init(chartRef.value)
    }
    if (chartInstance && props.option) {
        chartInstance.setOption(props.option, true)
    }
}

watch(() => props.option, renderChart, { deep: true })
onMounted(renderChart)
onBeforeUnmount(() => {
    if (chartInstance) chartInstance.dispose()
})
</script>

<style scoped>
.chart-display {
    width: 100%;
    height: 100%;
    min-height: clamp(300px, 60vh, 600px); /* 响应式高度 */
    background: var(--bg-color, #fff);
    border-radius: clamp(8px, 2vw, 12px);
    box-shadow: 0 0 1px var(--text-color);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 2vw, 20px);
}

.chart-container {
    width: 100% !important; /* 覆盖 inline style */
    height: 100% !important;
    min-height: inherit;
}

.empty-tip {
    color: #aaa;
    font-size: clamp(1em, 2vw, 1.2em);
    text-align: center;
    letter-spacing: 1px;
    padding: 20px;
    user-select: none;
}

/* 小屏幕适配 */
@media (max-width: 767px) {
    .chart-display {
        height: 100%;      /* 填充父容器 */
        padding: 8px;
        border-radius: 8px;
    }

    .empty-tip {
        font-size: 0.9em;
        padding: 10px;
    }
}
</style>
