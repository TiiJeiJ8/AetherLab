<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-gauge-svg">
    <g>
        <!-- 仪表盘弧形 -->
        <path class="gauge-arc" d="M30,60 A30,30 0 0,1 90,60" />
        <!-- 动态指针 -->
        <line class="gauge-pointer" :x1="60" :y1="60" :x2="pointerX" :y2="pointerY" />
        <!-- 圆心 -->
        <circle cx="60" cy="60" r="4" fill="#FFB300" />
    </g>
</svg>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const t = ref(0)
let dir = 1, animId = null
const duration = 1800
const min = Math.PI, max = 0
const pointerAngle = computed(() => min + (max-min)*t.value)
const pointerX = computed(() => 60 + 28*Math.cos(pointerAngle.value))
const pointerY = computed(() => 60 - 28*Math.sin(pointerAngle.value))
function animateGauge(ts) {
    if (!animateGauge.last) animateGauge.last = ts
    const dt = ts - animateGauge.last
    animateGauge.last = ts
    t.value += dir * dt / duration
    if (t.value > 1) t.value = 1
    if (t.value < 0) t.value = 0
    if ((dir === 1 && t.value >= 1) || (dir === -1 && t.value <= 0)) {
        setTimeout(() => {
        dir *= -1
        animateGauge.last = undefined
        animId = requestAnimationFrame(animateGauge)
        }, 320)
        return
    }
    animId = requestAnimationFrame(animateGauge)
}
onMounted(() => { t.value = 0; dir = 1; animId = requestAnimationFrame(animateGauge) })
onBeforeUnmount(() => { if (animId) cancelAnimationFrame(animId) })
</script>
<style scoped>
.empty-gauge-svg { display: block; margin: 0 auto; animation: floatX 3.5s ease-in-out infinite; }
.gauge-arc {
    fill: none;
    stroke: #A0C4FF;
    stroke-width: 7;
    opacity: 0.18;
}
.gauge-pointer {
    stroke: #4F8EF7;
    stroke-width: 5;
    stroke-linecap: round;
    opacity: 0.7;
    transition: x2 0.32s, y2 0.32s, opacity 0.32s;
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
