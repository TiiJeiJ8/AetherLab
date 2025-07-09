<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-funnel-svg">
    <g>
        <!-- 漏斗层级 -->
        <polygon class="funnel-part part1" points="40,20 80,20 75,32 45,32" />
        <polygon class="funnel-part part2" points="45,32 75,32 70,48 50,48" />
        <polygon class="funnel-part part3" points="50,48 70,48 65,65 55,65" />
    </g>
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-funnel-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.funnel-part {
    opacity: 0.18;
    transform: scaleY(0.2);
    transform-origin: 60px 20px;
    animation: funnel-grow 2.8s cubic-bezier(.4,1.6,.6,1) infinite;
}
.part1 { fill: #4F8EF7; animation-delay: 0.1s; }
.part2 { fill: #A0C4FF; animation-delay: 0.4s; }
.part3 { fill: #FFB300; animation-delay: 0.7s; }
@keyframes funnel-grow {
    0% { transform: scaleY(0.2); opacity: 0.12; }
    18% { transform: scaleY(1); opacity: 0.7; }
    80% { transform: scaleY(1); opacity: 0.7; }
    100% { transform: scaleY(0.2); opacity: 0.12; }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
