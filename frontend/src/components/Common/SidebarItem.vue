<template>
<div :class="['sidebar-tree-item', { active: isActive }]">
    <div class="sidebar-tree-label" @click="handleToggle">
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
</div>
</template>

<script setup>
/* eslint-disable */
/* 递归侧边栏树形菜单组件，支持多级嵌套、展开/收起、选中高亮。注释为中文 */
import { computed } from 'vue'
const props = defineProps({
    item: Object,
    level: { type: Number, default: 0 },
    expandedItems: { type: Object, default: () => new Set() },
    activeId: String
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
</script>

<style scoped>
.sidebar-tree-item {
    margin-bottom: 2px;
}
.sidebar-tree-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 8px 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;
}
.sidebar-tree-label:hover {
    background: var(--hover-bg, #f0f0f0);
}
.sidebar-tree-title {
    flex: 1;
    font-size: 1em;
    color: var(--text-color, #333);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
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
    background: var(--primary-color, #93bae8);
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
}
</style>
