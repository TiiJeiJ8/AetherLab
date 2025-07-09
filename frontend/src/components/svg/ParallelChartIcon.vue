<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-parallel-svg">
    <g>
        <!-- 轴线 -->
        <line v-for="i in 5" :key="i" :x1="20 + (i-1)*25" y1="20" :x2="20 + (i-1)*25" y2="70" class="parallel-axis" />
        <!-- 动态折线 -->
        <polyline class="parallel-line" points="20,60 45,30 70,50 95,25 120,65" />
    </g>
</svg>
</template>
<script setup>
</script>
<style scoped>
.empty-parallel-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.parallel-axis {
    stroke: #A0C4FF;
    stroke-width: 2;
    opacity: 0.18;
    animation: axis-fade 3.7s cubic-bezier(.4,1.6,.6,1) infinite;
}
@keyframes axis-fade {
    0% { opacity: 0.18; }
    18% { opacity: 0.7; }
    80% { opacity: 0.7; }
    100% { opacity: 0.18; }
}
.parallel-line {
    stroke: #4F8EF7;
    stroke-width: 3;
    fill: none;
    stroke-dasharray: 120;
    stroke-dashoffset: 120;
    opacity: 0.18;
    animation: parallel-line-grow 3.7s cubic-bezier(.4,1.6,.6,1) infinite;
}
@keyframes parallel-line-grow {
    0% { stroke-dashoffset: 120; opacity: 0.18; }
    18% { stroke-dashoffset: 0; opacity: 0.7; }
    80% { stroke-dashoffset: 0; opacity: 0.7; }
    100% { stroke-dashoffset: 120; opacity: 0.18; }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
