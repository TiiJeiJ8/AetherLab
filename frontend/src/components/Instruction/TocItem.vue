<template>
<div class="toc-item-wrapper">
    <div
        :class="tocItemClass"
        @click="handleClick"
    >
        <!-- 展开/折叠按钮 -->
        <button
        v-if="hasChildren"
        class="toc-toggle"
        @click.stop="handleToggle"
        >
        <span class="toggle-icon">
            {{ isExpanded ? '▂' : '▄' }}
        </span>
        </button>

        <!-- 缩进指示器 -->
        <div class="indent-indicator" :style="{ width: `${level * 16}px` }"></div>

        <!-- 内容区域 -->
        <div class="toc-content">
        <span v-if="item.icon" class="toc-icon">{{ item.icon }}</span>
        <span class="toc-title">{{ item.title }}</span>

        <!-- 状态指示器 -->
        <div class="toc-indicators">
            <span v-if="item.isNew" class="indicator new-indicator" title="新内容">NEW</span>
            <span v-if="item.isUpdated" class="indicator updated-indicator" title="已更新">UPD</span>
            <span v-if="item.status === 'completed'" class="indicator completed-indicator" title="已完成">✓</span>
            <span v-if="item.status === 'in-progress'" class="indicator progress-indicator" title="进行中">⏳</span>
            <span v-if="item.count" class="count-indicator">{{ item.count }}</span>
        </div>
        </div>
    </div>

    <!-- 子项目 -->
    <transition name="toc-expand">
        <div v-if="hasChildren && isExpanded" class="toc-children">
        <TocItem
            v-for="child in item.children"
            :key="child.id"
            :item="child"
            :active-section="activeSection"
            :expanded-items="expandedItems"
            :level="level + 1"
            @navigate="$emit('navigate', $event)"
            @toggle="$emit('toggle', $event)"
        />
        </div>
    </transition>
</div>
</template>

<script setup>
/* eslint-disable */
import { computed } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    activeSection: {
        type: String,
        default: ''
    },
    expandedItems: {
        type: Set,
        required: true
    },
    level: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['navigate', 'toggle'])

const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0
})

const isExpanded = computed(() => {
    return props.expandedItems.has(props.item.id)
})

const isActive = computed(() => {
    return props.activeSection === props.item.id
})

const tocItemClass = computed(() => {
    return [
        'toc-item',
        `toc-level-${props.level}`,
        {
        'active': isActive.value,
        'has-children': hasChildren.value,
        'expanded': isExpanded.value,
        'completed': props.item.status === 'completed',
        'in-progress': props.item.status === 'in-progress',
        'clickable': !hasChildren.value || props.item.clickable !== false
        }
    ]
})

const handleClick = () => {
    if (!hasChildren.value || props.item.clickable !== false) {
        emit('navigate', props.item.id)
    } else if (hasChildren.value) {
        handleToggle()
    }
}

const handleToggle = () => {
    emit('toggle', props.item.id)
}
</script>

<style scoped>
@import '../../assets/CSS/TocItem_instruction.css';
</style>
