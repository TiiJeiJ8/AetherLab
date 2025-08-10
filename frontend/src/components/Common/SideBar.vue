<template>
    <aside
        :class="[
            'sidebar',
            positionClass,
            { collapsed: isCollapsed, expanded: isExpanded }
        ]"
        :style="{ width: sidebarWidth + 'px' }"
        @click="toggleCollapse"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <!-- 切换按钮图标 -->
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
import { ref, computed, onUnmounted } from 'vue'

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
        default: 200,
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

// 动态宽度，配合动画

// 折叠宽度自适应：随分辨率变化，最小40，最大120，2%屏宽
const adaptiveCollapsedWidth = computed(() => {
    const min = 40;
    const max = 120;
    const percent = 0.02; // 4% 屏幕宽度
    return Math.round(Math.max(min, Math.min(window.innerWidth * percent, max)));
});

const sidebarWidth = computed(() =>
    isExpanded.value ? props.expandedWidth : adaptiveCollapsedWidth.value
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
    box-shadow: 0 0 1px var(--text-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: 9997;
    user-select: none;
    cursor: pointer;
    transition: width 0.4s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, background-color 0.3s;
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
    overflow-x: hidden;
    padding: 12px 16px;
    color: var(--text-color);
    pointer-events: auto;
    cursor: default;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.sidebar-content::-webkit-scrollbar {
    width: 8px;
    background: transparent;
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
