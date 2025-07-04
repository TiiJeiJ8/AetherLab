<template>
<transition name="topbar-fade-slide">
    <header
        v-if="isMounted"
        class="top-bar"
        :class="{ 'top-bar--hidden': isHidden }"
    >
        <nav class="nav-container">
        <!-- LOGO -->
        <div class="logo dynamic-gradient-text">Fuck Charts</div>

        <!-- 汉堡菜单图标 -->
        <div class="burger-container" @click="toggleMenu">
            <span class="burger-icon">☰</span>
        </div>

        <!-- 菜单项 -->
        <transition name="menu-fade">
            <div class="nav-actions" v-show="isMenuOpen || isDesktop">
            <template v-for="(item, idx) in actions" :key="idx">
                <!-- 普通按钮 -->
                <button
                v-if="item.type === 'button' && !item.to"
                class="nav-btn"
                @click="item.onClick"
                >
                {{ item.label }}
                </button>

                <!-- 内部路由跳转 -->
                <RouterLink
                v-else-if="item.type === 'button' && item.to && !item.external"
                :to="item.to"
                class="nav-btn"
                @click="isMenuOpen = false"
                >
                {{ item.label }}
                </RouterLink>

                <!-- 外部链接 -->
                <a
                v-else-if="item.type === 'button' && item.to && item.external"
                :href="item.to"
                class="nav-btn"
                target="_blank"
                rel="noopener noreferrer"
                >
                {{ item.label }}
                </a>
            </template>
            </div>
        </transition>
        </nav>
    </header>
</transition>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
actions: {
    type: Array,
    default: () => [
    { type: 'button', label: 'Home', to: '/', external: false }
    ]
}
})

// 滚动隐藏逻辑
const isHidden = ref(false)
let lastScrollY = window.scrollY
let ticking = false
function handleScroll() {
if (!ticking) {
    window.requestAnimationFrame(() => {
    const currentY = window.scrollY
    isHidden.value = currentY > lastScrollY && currentY > 30
    lastScrollY = currentY
    ticking = false
    })
    ticking = true
}
}

// TopBar 入场
const isMounted = ref(false)
onMounted(() => {
    isMounted.value = true
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
})

// 菜单状态
const isMenuOpen = ref(false)
const toggleMenu = () => {
isMenuOpen.value = !isMenuOpen.value
}

const isDesktop = computed(() => window.innerWidth >= 990)

// 点击空白处关闭菜单
function handleClickOutside(event) {
const nav = document.querySelector('.top-bar')
if (nav && !nav.contains(event.target)) {
    isMenuOpen.value = false
}
}

onMounted(() => {
window.addEventListener('scroll', handleScroll)
document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
window.removeEventListener('scroll', handleScroll)
document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-bar {
    position: fixed;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--bg-color);
    backdrop-filter: saturate(180%) blur(10px);
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    padding: 0 20px;
    z-index: 9999;
    width: 90%;
    max-width: 1100px;
    height: auto;
    transition: top 0.35s ease, opacity 0.25s;
}

/* TopBar 出场动画 */
.topbar-fade-slide-enter-active {
    transition: opacity 0.5s, transform 0.6s;
}
.topbar-fade-slide-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
/* 开始 */
.topbar-fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-40px) translateX(-50%);
}
/* 结束 */
.topbar-fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-40px) translateX(-50%);
}

.top-bar--hidden {
    top: -100px;
    opacity: 0;
    pointer-events: none;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.logo {
    font-weight: 900;
    font-size: 2.27rem;
    background: linear-gradient(270deg, #ff416c, #fa83bf, #1f97ff, #12d8fa, #50f6a0, #ff416c);
    background-size: 1200% 1200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientMove 20s ease infinite;
    user-select: none;
    margin-right: auto;
}

@keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.burger-container {
    display: none;
    font-size: 1.8rem;
    cursor: pointer;
    user-select: none;
    color: var(--text-color);
}

.nav-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    transition: all 0.3s ease;
}

/* 动画 */
.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: all 0.3s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* 按钮 */
.nav-btn {
    background: transparent;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-color);
    padding: 6px 14px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    text-align: center;
    text-decoration: none;
}

.nav-btn:hover {
    background-color: rgba(136, 133, 133, 0.1);
}

/* 响应式：小屏幕 */
@media (max-width: 990px) {
    .burger-container {
    display: block;
    }

    .nav-actions {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-top: 12px;
    }

    .nav-btn {
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    }

    .logo {
    font-size: 1.5rem;
    }
}
</style>
