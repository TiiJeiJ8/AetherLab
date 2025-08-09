<template>
<div>
    <section
        v-for="group in chartDetails.children"
        :key="group.id"
        :id="group.id"
        class="content-section"
    >
        <h2>{{ group.title }}</h2>
        <div v-for="chart in group.children" :key="chart.id" class="chart-block">
            <h3>{{ chart.title }}</h3>
            <section :id="chart.id"></section>

            <!-- 基于 ECharts 的配置树 -->
            <div class="echarts-tree-block">
                <div class="tree-toolbar">
                    <span class="hint">Configuration Tree (auto from ChartTypeConfig)</span>
                </div>
                <div
                    class="echarts-tree-container"
                    :ref="el => setTreeRefWithTitle(chart.id, chart.title, el)"
                ></div>
            </div>
            <!-- /基于 ECharts 的配置树 -->

            <!-- 更多内容，后续追加 -->
        </div>
    </section>
</div>
</template>

<script setup>
/* eslint-disable */
import { onBeforeUnmount, reactive, nextTick } from 'vue'
import * as echarts from 'echarts'
import { instructionConfig } from '@/assets/instructions/config.js'
import { generateConfigTreeOption } from '@/assets/instructions/instruction_chart_gen.js'

const chartDetails = instructionConfig.modules
    .find(m => m.id === 'data-visualization')
    ?.tocItems.find(t => t.id === 'chart-details')

// --- ECharts Tree 实例管理 ---
const treeRefs = reactive({})           // { [chartId]: HTMLElement }
const treeInstances = reactive({})      // { [chartId]: echarts.ECharts }
const resizeHandlers = reactive({})     // { [chartId]: Function }

function setTreeRefWithTitle(id, title, el) {
    if (el) {
        treeRefs[id] = el
        if (!treeInstances[id]) initTree(id, title)
    } else {
        disposeTree(id)
        delete treeRefs[id]
    }
}

function waitForSize(el, tries = 30) {
    return new Promise(resolve => {
        const check = () => {
            if (!el) return resolve(false)
            const w = el.clientWidth
            const h = el.clientHeight
            if (w > 0 && h > 0) return resolve(true)
            if (tries <= 0) return resolve(false)
            requestAnimationFrame(() => {
                tries -= 1
                check()
            })
        }
        check()
    })
}

// 让树图根据Geo_Map等类型的seriesType动态过滤参数
async function initTree(id, title) {
    const el = treeRefs[id]
    if (!el) return
    await nextTick()
    const ok = await waitForSize(el)
    if (!ok) {
        el.style.minHeight = el.style.minHeight || '300px'
    }
    const inst = echarts.init(el)
    treeInstances[id] = inst
    // 处理Geo_Map及其分支类型的seriesType过滤
    let filter = {}
    // 统一小写判断
    const norm = (title || '').replace(/\s|_/g, '').toLowerCase()
    if ([
        'geomap', 'geoofmap', 'geoofheatmap', 'geoofscatter', 'geoofpie'
    ].includes(norm)) {
        // 默认seriesType与分支名对应
        if (norm === 'geoofmap' || norm === 'geomap') filter.seriesType = 'map'
        if (norm === 'geoofheatmap') filter.seriesType = 'heatmap'
        if (norm === 'geoofscatter') filter.seriesType = 'scatter'
        if (norm === 'geoofpie') filter.seriesType = 'pie'
    }
    const option = generateConfigTreeOption(title, filter)
    inst.setOption(option)
    inst.resize()
    const handler = () => inst.resize()
    resizeHandlers[id] = handler
    window.addEventListener('resize', handler)
}

function disposeTree(id) {
    const inst = treeInstances[id]
    if (inst) {
        try { inst.dispose() } catch (_) {}
        delete treeInstances[id]
    }
    const handler = resizeHandlers[id]
    if (handler) {
        window.removeEventListener('resize', handler)
        delete resizeHandlers[id]
    }
}

onBeforeUnmount(() => {
    Object.keys(treeInstances).forEach(id => disposeTree(id))
})
</script>

<style scoped>
.chart-block {
    margin: 16px 0 24px 0;
    padding: 12px 12px 16px 12px;
    border-radius: 8px;
    background: var(--bg-secondary);
}
.echarts-tree-block {
    margin-top: 10px;
}
.tree-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    -webkit-user-select: none;
    user-select: none;
}
.hint {
    color: var(--text-secondary);
    font-size: 12px;
}
.echarts-tree-container {
    width: 100%;
    height: 700px;
    min-height: 500px;
    border: 1px solid var(--border-color, rgba(0,0,0,0.08));
    border-radius: 8px;
    background: var(--bg-main);
}
</style>