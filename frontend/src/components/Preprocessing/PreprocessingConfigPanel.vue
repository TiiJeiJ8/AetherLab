<template>
<div class="data-preprocessing-config-panel">
    <!-- 右侧边栏总标题 -->
    <div class="panel-header-DCP" style="position:relative; display:flex; align-items: center; justify-content: space-between">
        <h3 style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;">
            Preprocessing Configuration
        </h3>
        <!-- 预处理功能模块及相关提示 -->
        <div
            class="preprocessing-func-tag"
            @mouseenter="showTooltip($event, props.activeSidebarId)"
            @mouseleave="hideTooltip"
            style="position: relative; max-width: 50%; white-space: normal; word-break: break-all; text-align: right; right: 0; margin-right: 3%;"
        >
            <span class="preprocessing-func-name">{{ preprocessingTooltipConfig[props.activeSidebarId].label }}</span>
        </div>
    </div>

    <!-- 基本配置项区域 -->
    <preprocessingBasicConfig
        :files="props.files"
        @file-selected="handleFileSelected"
        v-model:autoRender="autoRender"
        v-model:useCustomDataColumns="useCustomDataColumns"
        class="preprocessing-basic-config"
    />

    <!-- 数据列拖拽放置区 -->
    <transition name="slide-fade">
        <preprocessingMappingPanel
            v-if="useCustomDataColumns"
            :activeSidebarId="props.activeSidebarId"
            v-model:mappedColumns="mappedColumns"
            class="preprocessing-mapping-panel"
        />
    </transition>

    <!--todo 模块功能配置区 -->

    <!-- 操作按钮 -->
    <div class="action-section">
        <!-- 应用配置按钮 -->
        <button
            class="apply-btn"
            :disabled="autoRender"
            @click="applyConfiguration"
        >
            Apply Configuration
        </button>
        <!-- 重置配置按钮 -->
        <button
            class="reset-btn"
            @click="resetConfiguration"
        >
            Reset Configuration
        </button>
    </div>

    <!-- Tooltip DOM -->
    <transition name="fade">
        <div
            v-if="tooltip.visible"
            class="preprocessing-tooltip"
            :style="tooltip.style"
            ref="tooltipRef"
        >
            <div class="tooltip-header">
                <span class="tooltip-title">{{ tooltip.label }}</span>
                <span class="tooltip-description">{{ tooltip.description }}</span>
            </div>
            <div class="tooltip-section">
                <h4>Data Requirements</h4>
                <div class="tooltip-tags">
                    <span
                        v-for="requirement in tooltip.dataRequirements"
                        :key="requirement"
                        class="tooltip-tag data-tag"
                    >
                        {{ requirement }}
                    </span>
                </div>
            </div>
            <div class="tooltip-section">
                <h4>Use Cases</h4>
                <div class="tooltip-tags">
                    <span
                        v-for="useCase in tooltip.useCases"
                        :key="useCase"
                        class="tooltip-tag use-case-tag"
                    >
                        {{ useCase }}
                    </span>
                </div>
            </div>
        </div>
    </transition>
</div>
</template>

<script setup>
/* eslint-disable */
import { defineProps, nextTick, reactive, ref, onUnmounted, defineEmits, watch } from 'vue';
import { preprocessingTooltipConfig } from '@/assets/JS/Config/preprocessingTooltipConfig.js';
import { mergePreprocessedData } from '@/assets/JS/utils/preprocessingDataMergeUtils.js'
import { workspaceFiles, fileDataMap } from '../../assets/JS/utils/dataStructureOptimize';

import preprocessingBasicConfig from '../Preprocessing/panel/preprocessingBasicConfig.vue'
import preprocessingMappingPanel from '../Preprocessing/panel/preprocessingMappingPanel.vue'

const emit = defineEmits(['file-selected', 'update:mappedColumns', 'merged-data'])

const useCustomDataColumns = ref(false)
const autoRender = ref(false)
// 当 autoRender 为 true 时自动合并数据
watch(autoRender, (val) => {
    if (val) applyConfiguration()
})

// 接收来自父组件的 activeSidebarId prop
const props = defineProps({
    activeSidebarId: {
        type: String,
        default: ''
    },
    files: {
        type: Array,
        default: () => []
    }
    ,
    selectedFileName: {
        type: String,
        default: ''
    },
})

// 点击按钮时手动合并
function applyConfiguration() {
    const data = mergePreprocessedData(
        props.activeSidebarId,
        props.selectedFileName,
        fileDataMap.value,
        mappedColumns.value,
        useCustomDataColumns.value // 是否使用自定义列
    )
    emit('merged-data', data)
}

function handleFileSelected(file) {
    emit('file-selected', file)
}

// 获取拖拽放置区的数据列索引数据
const mappedColumns = ref([])
// mappedColumns 通过 v-model 在子组件中自动更新
// 当 mappedColumns 变化且开启自动渲染时，自动应用配置
watch(mappedColumns, (newCols) => {
    if (autoRender.value) {
        applyConfiguration()
    }
})

// 重置拖拽放置区
function resetConfiguration() {
    mappedColumns.value = [];
    console.log('[PreprocessingConfigPanel] Mapped Columns Reset');
    emit('update:mappedColumns', mappedColumns.value);
}

// Tooltip state and ref
const tooltip = reactive({
    visible: false,
    id: '',
    label: '',
    description: '',
    dataRequirements: [],
    useCases: [],
    style: {},
})
const tooltipRef = ref(null)

// 计算提示框位置，确保不超出屏幕
function positionTooltip(event) {
    if (!tooltipRef.value) return;

    const tooltipEl = tooltipRef.value;
    const rect = tooltipEl.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = event.pageX + 10
    let top = event.pageY + 10
    
    // 防止右边超出屏幕
    if (left + rect.width > viewportWidth) {
        left = event.pageX - rect.width - 10
    }
    
    // 防止底部超出屏幕
    if (top + rect.height > viewportHeight) {
        top = event.pageY - rect.height - 10
    }
    
    // 防止左边超出屏幕
    if (left < 0) {
        left = 10
    }
    
    // 防止顶部超出屏幕
    if (top < 0) {
        top = 10
    }
    
    tooltip.style = {
        left: `${left}px`,
        top: `${top}px`,
        position: 'fixed',
        zIndex: 1000
    }
}

let tooltipTimeout = null
function showTooltip(event, id) {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
    }
    tooltipTimeout = setTimeout(() => {
        const tooltipConfig = preprocessingTooltipConfig[id]
        if (tooltipConfig) {
            tooltip.id = id
            tooltip.label = tooltipConfig.label || ''
            tooltip.description = tooltipConfig.description || ''
            tooltip.dataRequirements = tooltipConfig.dataRequirements || []
            tooltip.useCases = tooltipConfig.useCases || []
            tooltip.visible = true
            nextTick(() => {
                positionTooltip(event)
            })
        }
    }, 1200)
}
function hideTooltip() {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
        tooltipTimeout = null
    }
    tooltip.visible = false
}

onUnmounted(() => {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
        tooltipTimeout = null
    }
})

</script>

<style scoped>
@import '../../assets/CSS/PreprocessingConfigPanel.css';
</style>