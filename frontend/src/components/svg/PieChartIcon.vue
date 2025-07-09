
<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-pie-svg">
    <g>
        <!-- 背景圆 -->
        <circle cx="60" cy="40" r="28" fill="#A0C4FF" opacity="0.18" />
        <!-- 饼图底色圆环 -->
        <circle cx="60" cy="40" r="22" fill="none" stroke="#E0E7EF" stroke-width="10" />
        <!-- 动态主扇区（占比动画） -->
        <circle
            class="pie-arc"
            cx="60" cy="40" r="22"
            fill="none"
            stroke="#4F8EF7"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            :opacity="arcOpacity"
            transform="rotate(-90 60 40)"
        />
        <!-- 剩余扇区（次色） -->
        <circle
            class="pie-arc-rest"
            cx="60" cy="40" r="22"
            fill="none"
            stroke="#FFB300"
            stroke-width="10"
            stroke-linecap="butt"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffsetRest"
            transform="rotate(-90 60 40)"
        />
    </g>
</svg>
</template>

<script setup>
/* eslint-disable */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// 动画参数
const percent = ref(0.68) // 主扇区占比（0~1），可随动画变化
const circumference = 2 * Math.PI * 22
const dashOffset = computed(() => (1 - percent.value) * circumference)
const dashOffsetRest = computed(() => -percent.value * circumference)
const arcOpacity = ref(0.92)

let dir = 1
let animId = null
let pauseTimeout = null

function easeInOut(t) {
  // 三次缓动曲线
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

let t = 0 // 0~1
const min = 0.1, max = 0.85
const duration = 1800 // ms
const pause = 350 // ms

function animatePie(ts) {
    if (!animatePie.last) animatePie.last = ts
    const dt = ts - animatePie.last
    animatePie.last = ts
    t += (dt / duration) * dir
    if (t > 1) t = 1
    if (t < 0) t = 0
    // 缓动
    const eased = easeInOut(t)
    percent.value = min + (max - min) * eased
    // 渐变透明度
    arcOpacity.value = 0.7 + 0.22 * eased
    if ((dir === 1 && t >= 1) || (dir === -1 && t <= 0)) {
        // 到边界，停顿后反向
        pauseTimeout = setTimeout(() => {
        dir *= -1
        animatePie.last = undefined
        animId = requestAnimationFrame(animatePie)
        }, pause)
        return
    }
    animId = requestAnimationFrame(animatePie)
}

onMounted(() => {
    t = 0
    dir = 1
    animId = requestAnimationFrame(animatePie)
})
onBeforeUnmount(() => {
    if (animId) cancelAnimationFrame(animId)
    if (pauseTimeout) clearTimeout(pauseTimeout)
})
</script>

<style scoped>
.empty-pie-svg {
    display: block;
    margin: 0 auto;
    animation: floatX 5.2s ease-in-out infinite;
}
.pie-arc {
    filter: drop-shadow(0 2px 6px #4f8ef72a);
    transition: stroke-dashoffset 0.32s cubic-bezier(.4,1.6,.6,1), opacity 0.32s cubic-bezier(.4,1.6,.6,1);
}
.pie-arc-rest {
    opacity: 0.7;
    transition: stroke-dashoffset 0.32s cubic-bezier(.4,1.6,.6,1);
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
