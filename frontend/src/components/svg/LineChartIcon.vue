<template>
    <svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-line-svg">
        <!-- 坐标轴 -->
        <polyline points="10,50 80,50" stroke="#bbb" stroke-width="2" />
        <polyline points="10,50 10,10" stroke="#bbb" stroke-width="2" />
        <!-- 折线 -->
        <polyline class="line-path" points="10,50 30,35 50,45 70,20 80,30" stroke="#4F8EF7" stroke-width="3" fill="none"/>
        <!-- 数据点 -->
        <circle class="dot dot1" cx="10" cy="50" r="4" fill="#A0C4FF" />
        <circle class="dot dot2" cx="30" cy="35" r="4" fill="#4F8EF7" />
        <circle class="dot dot3" cx="50" cy="45" r="4" fill="#A0C4FF" />
        <circle class="dot dot4" cx="70" cy="20" r="4" fill="#4F8EF7" />
        <circle class="dot dot5" cx="80" cy="30" r="4" fill="#FFB300" />
    </svg>
</template>

<script setup>
</script>

<style scoped>
.empty-line-svg {
    display: block;
    margin: 0 auto;
    animation: floatX 5.2s ease-in-out infinite;
    will-change: transform;
}
.line-path {
    stroke-dasharray: 120;
    stroke-dashoffset: 120;
    animation: line-draw 3.85s cubic-bezier(.4,1.6,.6,1) infinite;
}
.dot {
    opacity: 0;
    transform: scale(0.5);
    animation: dot-pop 3.85s cubic-bezier(.4,1.6,.6,1) infinite;
}
.dot1 { animation-delay: 0.7s; }
.dot2 { animation-delay: 0.85s; }
.dot3 { animation-delay: 1.0s; }
.dot4 { animation-delay: 1.15s; }
.dot5 { animation-delay: 1.3s; }
@keyframes line-draw {
    0% { stroke-dashoffset: 120; }
    20% { stroke-dashoffset: 0; }
    80% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 120; }
}
@keyframes dot-pop {
    0% { opacity: 0; transform: scale(0.5); }
    20% { opacity: 1; transform: scale(1.2); }
    60% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5); }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
