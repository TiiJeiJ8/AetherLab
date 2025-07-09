<template>
    <div ref="thumbRef" class="chart-thumb"></div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    option: { type: Object, required: true }
})

const thumbRef = ref(null)
let chart = null

function getOptionWithoutTitle(option) {
    const opt = JSON.parse(JSON.stringify(option))
    delete opt.title
    return opt
}

function render() {
    if (!chart && thumbRef.value) {
        chart = echarts.init(thumbRef.value)
    }
    if (chart && props.option) {
        chart.setOption(getOptionWithoutTitle(props.option), true)
    }
}

watch(() => props.option, render, { deep: true })
onMounted(render)
onBeforeUnmount(() => {
    if (chart) chart.dispose()
})
</script>

<style scoped>
    .chart-thumb {
        width: 100px;
        height: 70px;
        min-width: 100px;
        min-height: 70px;
        border-radius: 6px;
        background: var(--bg-color);
        box-shadow: 0 0px 1px var(--text-color);
        margin-bottom: 4px;
    }
</style>