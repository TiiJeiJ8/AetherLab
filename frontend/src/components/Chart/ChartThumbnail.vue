<template>
    <div ref="thumbRef" class="chart-thumb"></div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

/**
 * Props
 * @prop {Object} option - ECharts 配置对象，必填
 * @prop {String} colorTheme - 主题名，默认 'default'
 */
const props = defineProps({
    option: { type: Object, required: true },
    colorTheme: { type: String, default: 'default' }
})

const thumbRef = ref(null)
let chart = null
const themeCache = {}

async function loadAndRegisterTheme(themeName) {
    if (themeCache[themeName]) return
    try {
        const res = await fetch(`/themes/${themeName}.json`)
        if (!res.ok) throw new Error('Theme file loads failed')
        const obj = await res.json()
        echarts.registerTheme(themeName, obj)
        themeCache[themeName] = { themeObj: obj }
    } catch (e) {
        // 静默失败
    }
}

function getOptionForThumbnail(option) {
    const opt = JSON.parse(JSON.stringify(option))
    // 移除可能遮挡缩略图的组件
    delete opt.title
    delete opt.toolbox
    delete opt.dataZoom
    delete opt.brush
    return opt
}

async function render() {
    if (!thumbRef.value) return
    await loadAndRegisterTheme(props.colorTheme)
    if (!chart) {
        chart = echarts.init(thumbRef.value, props.colorTheme)
    }
    if (chart && props.option) {
        chart.setOption(getOptionForThumbnail(props.option), true)
    }
}

watch(() => [props.option, props.colorTheme], render, { deep: true })
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