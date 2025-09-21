<template>
<div :class="['sidebar-tree-item', { active: isActive }]">
    <div
        class="sidebar-tree-label"
        @click="handleToggle"
        @mouseenter="showTooltip($event, item.id)"
        @mouseleave="hideTooltip"
    >
        <span v-if="item.icon" class="sidebar-tree-icon">{{ item.icon }}</span>
        <span class="sidebar-tree-title">{{ item.label }}</span>
        <span v-if="hasChildren" class="sidebar-tree-arrow" :class="{ expanded: expanded }">&#9662;</span>
    </div>
    <transition name="fade">
        <div v-if="expanded && hasChildren" class="sidebar-tree-children">
            <SidebarItem
                v-for="child in item.children"
                :key="child.id"
                :item="child"
                :level="level + 1"
                :expanded-items="expandedItems"
                :active-id="activeId"
                @toggle="emitToggle"
                @select="emitSelect"
            />
        </div>
    </transition>

    <!-- 提示框 -->
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
</div>
</template>

<script setup>
/* eslint-disable */
/* 递归侧边栏树形菜单组件，支持多级嵌套、展开/收起、选中高亮。注释为中文 */
import { computed, onUnmounted, reactive, ref, nextTick, defineProps } from 'vue'
import { preprocessingTooltipConfig } from '@/assets/JS/Config/preprocessingTooltipConfig.js';

const props = defineProps({
    item: Object,
    level: { type: Number, default: 0 },
    expandedItems: { type: Object, default: () => new Set() },
    activeId: String,
})

const emit = defineEmits(['toggle', 'select'])
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const expanded = computed(() => props.expandedItems.has(props.item.id))
const isActive = computed(() => props.activeId === props.item.id)
function handleToggle() {
    if (hasChildren.value) {
        emit('toggle', props.item.id)
    } else {
        emit('select', props.item.id)
    }
}
function emitToggle(id) { emit('toggle', id) }
function emitSelect(id) { emit('select', id) }

const tooltipRef = ref(null)

// 提示框状态
const tooltip = reactive({
    visible: false,
    id: '',
    description: '',
    dataRequirements: [],
    useCases: [],
    style: {},
})

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
// 显示提示框
function showTooltip(event, id) {
    if (tooltipTimeout) clearTimeout(tooltipTimeout)

    console.log('Preparing to show tooltip for id:', id)

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
.sidebar-tree-item {
    margin-bottom: 2px;
}
/* 按钮风格迁移自 .sideBar-btn */
.sidebar-tree-label {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-color, #333);
    padding: 8px 8px 8px 16px;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    user-select: none;
}
.sidebar-tree-label::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s;
    pointer-events: none;
}
.sidebar-tree-label:hover {
    background-color: rgba(136, 133, 133, 0.1);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.sidebar-tree-label:hover::before {
    left: 100%;
}
.sidebar-tree-label:active {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease;
}

/* 选中状态 */
.active > .sidebar-tree-label {
    background: linear-gradient(135deg, #4d4d4d, #4f4f4f);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(158,159,159,0.112);
    border: 1px solid rgba(110,110,110,0.2);
}
.active > .sidebar-tree-label::before {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
}
.active > .sidebar-tree-label:hover {
    background: linear-gradient(135deg, #686868, #4d4d4e);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 16px rgba(159,159,159,0.18);
}
.active > .sidebar-tree-label:hover::before {
    left: 100%;
}
.active > .sidebar-tree-label:active {
    transform: translateY(-1px) scale(0.98);
}
.sidebar-tree-title {
    flex: 1;
    font-size: 1em;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    transition: all 0.3s ease;
}
.active > .sidebar-tree-label .sidebar-tree-title {
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.active > .sidebar-tree-label:hover .sidebar-tree-title {
    transform: translateX(2px);
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.sidebar-tree-arrow {
    margin-left: auto;
    transition: transform 0.2s;
    flex-shrink: 0;
}
.sidebar-tree-arrow.expanded {
    transform: rotate(180deg);
}
.sidebar-tree-children {
    margin-left: 16px;
    border-left: 2px solid var(--border-color, #e5e5e5);
    padding-left: 4px;
}
.active > .sidebar-tree-label {
    background: linear-gradient(135deg, #4d4d4d, #4f4f4f);
    color: #fff;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.sidebar-tree-icon {
    flex-shrink: 0;
    fill: currentColor;
    transition: all 0.3s ease;
}
.active > .sidebar-tree-label .sidebar-tree-icon {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.active > .sidebar-tree-label:hover .sidebar-tree-icon {
    transform: scale(1.1);
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
}
</style>
