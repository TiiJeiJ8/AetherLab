<template>
    <aside
        :class="[
        'sidebar',
        positionClass,
        { collapsed: isCollapsed, expanded: isExpanded }
        ]"
        @click="toggleCollapse"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <!-- 切换按钮图标（仍保留，但点击全区域都有效） -->
        <span class="SidebarToggleBtn" style="font-size: auto;">
            {{ isCollapsed ? 'III' : '☰' }}
        </span>

        <!-- 内容区域过渡动画 -->
        <transition name="fade-slide">
        <div
            v-show="isExpanded || !isCollapsed"
            class="sidebar-content"
            @click.stop
        >
            <slot />
        </div>
        </transition>
    </aside>
</template>

<script setup>
/* eslint-disable */
    import { ref, watch, computed, onUnmounted } from 'vue'

    const props = defineProps({
    position: {
        type: String,
        default: 'left',
        validator: v => ['left', 'right'].includes(v),
    },
    collapsedWidth: {
        type: Number,
        default: 40,
    },
    expandedWidth: {
        type: Number,
        default: 250,
    },
    autoCollapseOnMobile: {
        type: Boolean,
        default: true,
    },
    })

    const isCollapsed = ref(true)
    const isHovered = ref(false)
    const isFixed = ref(false)

    const isMobile = ref(window.innerWidth < 768)
    function onResize() {
    isMobile.value = window.innerWidth < 768
    if (props.autoCollapseOnMobile && isMobile.value) {
        isCollapsed.value = true
    }
    }
    window.addEventListener('resize', onResize)

    function handleMouseEnter() {
        if (!isFixed.value) {
            isHovered.value = true
        }
    }
    function handleMouseLeave() {
    isHovered.value = false
    }

    const isExpanded = computed(() => !isCollapsed.value || isHovered.value)

    const sidebarWidth = computed(() =>
        isExpanded.value ? props.expandedWidth : props.collapsedWidth
    )

    function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
    }

    const positionClass = computed(() => {
    return props.position === 'left' ? 'sidebar-left' : 'sidebar-right'
    })

    onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    })
</script>
    
<style scoped>
    .sidebar {
        position: fixed;
        top: 100px;
        bottom: 30px;
        background-color: var(--bg-color);
        box-shadow: 0 0 15px rgb(0 0 0 / 0.12);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 9998;
        user-select: none;
        cursor: pointer;
    }

    .sidebar-left {
        left: 0;
        border-radius: 0 10px 10px 0;
    }

    .sidebar-right {
        right: 0;
        border-radius: 10px 0 0 10px;
    }
    
    /* 图标按钮 */
    .SidebarToggleBtn {
        font-size: 1.2rem;
        padding: 8px;
        margin: 6px;
        align-self: flex-end;
        pointer-events: none;
        user-select: none;
        color: var(--text-color);
    }
    
    /* 内容区域 */
    .sidebar-content {
        flex: 1;
        overflow-y: auto;
        padding: 12px 16px;
        color: var(--text-color);
        pointer-events: auto;
        cursor: default;
    }
    
    /* 进入/离开动画 */
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.3s ease;
    }
    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }
    
    /* 小屏自动折叠 */
    @media (max-width: 767px) {
        .sidebar {
        top: 80px;
        width: var(--collapsed-width) !important;
        height: 30%;
        }
    }
</style>
