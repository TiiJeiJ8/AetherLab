<template>
<aside class="table-of-contents" :class="{ 'mobile-open': mobileOpen }">
    <!-- 目录头部 -->
    <div class="toc-header">
        <h2 class="toc-title">📑 Content</h2>
        <button class="toc-close" @click="$emit('close')" v-if="isMobile">✕</button>
    </div>

    <!-- 搜索框 -->
    <div class="toc-search">
        <div class="search-input-wrapper">
        <input
            v-model="localSearchQuery"
            type="text"
            class="search-input"
            placeholder="Search..."
            @input="handleSearch"
        />
        <button
            v-if="localSearchQuery"
            class="search-clear"
            @click="clearSearch"
        >
            ✕
        </button>
        </div>
    </div>

    <!-- 目录树 -->
    <div class="toc-tree" ref="tocTree">
        <div class="toc-tree-content">
        <TocItem
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :active-section="activeSection"
            :expanded-items="expandedItems"
            :level="0"
            @navigate="handleNavigate"
            @toggle="handleToggle"
        />
        </div>

        <!-- 空状态 -->
        <div v-if="filteredItems.length === 0 && localSearchQuery" class="toc-empty">
        <p>🔍 No matching content found</p>
        <button class="clear-search-btn" @click="clearSearch">Clear Search</button>
        </div>
    </div>
</aside>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import TocItem from './TocItem.vue'

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    activeSection: {
        type: String,
        default: ''
    },
    searchQuery: {
        type: String,
        default: ''
    },
    mobileOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['navigate', 'search', 'toggle-expand', 'close'])

const localSearchQuery = ref('')
const expandedItems = ref(new Set())
const tocTree = ref(null)
const isMobile = ref(window.innerWidth <= 768)

// 监听窗口大小变化
const handleResize = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

// 计算属性
const allExpanded = computed(() => {
    const allItemIds = getAllItemIds(props.items)
    return allItemIds.every(id => expandedItems.value.has(id))
})

const filteredItems = computed(() => {
    if (!localSearchQuery.value) {
        return props.items
    }
    return filterItems(props.items, localSearchQuery.value.toLowerCase())
})

// 方法
const handleSearch = () => {
    emit('search', localSearchQuery.value)
}

const clearSearch = () => {
    localSearchQuery.value = ''
    handleSearch()
}

const handleNavigate = (sectionId) => {
    emit('navigate', sectionId)
}

const handleToggle = (itemId) => {
    if (expandedItems.value.has(itemId)) {
        expandedItems.value.delete(itemId)
    } else {
        expandedItems.value.add(itemId)
    }
    emit('toggle-expand', itemId)
}

// 辅助函数
const getAllItemIds = (items) => {
    const ids = []
    const traverse = (items) => {
        items.forEach(item => {
        if (item.children && item.children.length > 0) {
            ids.push(item.id)
            traverse(item.children)
        }
        })
    }
    traverse(items)
    return ids
}

const filterItems = (items, query) => {
    return items.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query)
        const hasMatchingChildren = item.children && 
        filterItems(item.children, query).length > 0
        
        if (titleMatch || hasMatchingChildren) {
        // 如果有匹配，自动展开
        if (item.children && item.children.length > 0) {
            expandedItems.value.add(item.id)
        }
        return true
        }
        return false
    }).map(item => ({
        ...item,
        children: item.children ? filterItems(item.children, query) : []
    }))
}

// 监听器
watch(() => props.searchQuery, (newQuery) => {
    localSearchQuery.value = newQuery
})

// 初始化展开状态
watch(() => props.items, (newItems) => {
    if (newItems.length > 0) {
        // 默认展开第一层
        newItems.forEach(item => {
        if (item.children && item.children.length > 0) {
            expandedItems.value.add(item.id)
        }
        })
    }
}, { immediate: true })
</script>

<style scoped>
@import '../../assets/CSS/TableOfContents_instruction.css';
</style>
