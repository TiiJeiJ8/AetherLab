<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-radar-svg">
    <g>
        <!-- 多层不规则蛛网环 -->
        <polygon :points="getPolygonPoints(base)" class="radar-web" style="opacity:0.18" />
        <polygon :points="getPolygonPoints(web1)" class="radar-web" style="opacity:0.13" />
        <polygon :points="getPolygonPoints(web2)" class="radar-web" style="opacity:0.09" />
        <polygon :points="getPolygonPoints(web3)" class="radar-web" style="opacity:0.06" />
        <!-- 蛛丝径向线动画（不规则） -->
        <line v-for="(p,i) in base" :key="'line'+i" x1="60" y1="48" :x2="p[0]" :y2="p[1]" class="radar-silk" :style="{animationDelay: (i*0.22)+'s'}" />
        <!-- 区域和端点淡入 -->
        <polygon class="radar-area" :points="animatedPoints" />
        <circle v-for="(p,i) in areaPoints" :key="'dot'+i" :cx="p[0]" :cy="p[1]" r="3" class="radar-dot" />
    </g>
</svg>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// 不规则蛛网顶点生成
function genWebPoints(center, rBase, rVar, count, seed=0) {
    const arr = []
    for (let i = 0; i < count; i++) {
        const angle = -Math.PI/2 + i * 2 * Math.PI / count
        // 伪随机扰动
        const rand = Math.sin(i*seed + seed*1.7) * rVar + Math.cos(i*seed + seed*2.3) * rVar * 0.5
        const r = rBase + rand
        arr.push([
        center[0] + r * Math.cos(angle),
        center[1] + r * Math.sin(angle)
        ])
    }
    return arr
}
const center = [60, 48]
const count = 6 // 6根蛛丝
const base = genWebPoints(center, 38, 7, count, 2.3)
const web1 = genWebPoints(center, 28, 5, count, 1.2)
const web2 = genWebPoints(center, 18, 3, count, 2.7)
const web3 = genWebPoints(center, 9, 2, count, 3.1)
const t = ref(0)
let dir = 1, animId = null
const duration = 1800
const min = 0.18, max = 1
const areaPoints = computed(() => base.map(([x, y]) => [
    center[0] + (x - center[0]) * (min + (max - min) * t.value),
    center[1] + (y - center[1]) * (min + (max - min) * t.value)
]))
const animatedPoints = computed(() => areaPoints.value.map(p => p.join(",")).join(" "))
function getPolygonPoints(arr) {
    return arr.map(p => p.join(",")).join(" ")
}
function animateRadar(ts) {
    if (!animateRadar.last) animateRadar.last = ts
    const dt = ts - animateRadar.last
    animateRadar.last = ts
    t.value += dir * dt / duration
    if (t.value > 1) t.value = 1
    if (t.value < 0) t.value = 0
    if ((dir === 1 && t.value >= 1) || (dir === -1 && t.value <= 0)) {
        setTimeout(() => {
        dir *= -1
        animateRadar.last = undefined
        animId = requestAnimationFrame(animateRadar)
        }, 320)
        return
    }
    animId = requestAnimationFrame(animateRadar)
}
onMounted(() => { t.value = 0; dir = 1; animId = requestAnimationFrame(animateRadar) })
onBeforeUnmount(() => { if (animId) cancelAnimationFrame(animId) })
</script>

<style scoped>
.empty-radar-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.radar-web {
    fill: none;
    stroke: #A0C4FF;
    stroke-width: 1.1;
    transition: opacity 0.3s;
}
.radar-silk {
    stroke: #4F8EF7;
    stroke-width: 2.2;
    stroke-dasharray: 36;
    stroke-dashoffset: 36;
    opacity: 0.85;
    animation: silk-grow 3.95s cubic-bezier(.4,1.6,.6,1) forwards;
}
@keyframes silk-grow {
    0% { stroke-dashoffset: 36; opacity: 0.18; }
    18% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
}
.radar-area {
    fill: #4F8EF7;
    opacity: 0;
    filter: drop-shadow(0 2px 6px #4f8ef72a);
    animation: area-fadein 0.7s 1.2s cubic-bezier(.4,1.6,.6,1) forwards;
}
.radar-dot {
    fill: #FFB300;
    opacity: 0;
    transition: opacity 0.4s;
    animation: dot-fadein 0.7s 1.2s cubic-bezier(.4,1.6,.6,1) forwards;
}
@keyframes area-fadein {
    0% { opacity: 0; }
    100% { opacity: 0.3; }
}
@keyframes dot-fadein {
    0% { opacity: 0; }
    100% { opacity: 0.7; }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
