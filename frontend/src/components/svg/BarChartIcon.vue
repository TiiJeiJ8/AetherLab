<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-bar-svg">
<!-- 坐标轴 -->
<polyline points="10,50 80,50" stroke="#bbb" stroke-width="2" />
<polyline points="10,50 10,10" stroke="#bbb" stroke-width="2" />
<!-- 柱状条 -->
<rect class="bar bar1" x="18" y="38" width="8" height="12" rx="2" />
<rect class="bar bar2" x="34" y="28" width="8" height="22" rx="2" />
<rect class="bar bar3" x="50" y="18" width="8" height="32" rx="2" />
<rect class="bar bar4" x="66" y="10" width="8" height="40" rx="2" />
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-bar-svg {
    display: block;
    margin: 0 auto;
    animation: floatX 3.5s ease-in-out infinite;
    will-change: transform;
}
.bar {
    transform-origin: bottom center;
    opacity: 0;
    fill: #4F8EF7;
    animation: bar-bounce 3.8s cubic-bezier(.4,1.6,.6,1) infinite;
}
.bar1 { animation-delay: 0.3s; fill: #A0C4FF; }
.bar2 { animation-delay: 0.5s; fill: #4F8EF7; }
.bar3 { animation-delay: 0.7s; fill: #A0C4FF; }
.bar4 { animation-delay: 0.9s; fill: #FFB300; }
@keyframes bar-bounce {
    0% { transform: scaleY(0.3); opacity: 0.5; }
    20% { transform: scaleY(1.15); opacity: 1; }
    50% { transform: scaleY(1.05); opacity: 1; }
    80% { transform: scaleY(0.95); opacity: 1; }
    100% { transform: scaleY(0.3); opacity: 0.5; }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
