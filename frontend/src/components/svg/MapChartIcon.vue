<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-map-svg">
    <g>
        <!-- 岛屿风格地图轮廓 -->
        <path class="map-outline" d="M35,65 Q30,45 50,35 Q55,25 70,30 Q90,35 95,55 Q90,70 70,75 Q55,70 45,75 Q38,70 35,65 Z" />
        <!-- 动态区域填充（岛屿内部） -->
        <path class="map-fill" d="M45,65 Q42,50 58,42 Q62,35 72,38 Q85,42 88,56 Q85,68 70,70 Q60,68 52,70 Q47,68 45,65 Z" />
        <!-- 标记点 -->
        <circle class="map-dot" cx="65" cy="55" r="2.5" />
        <circle class="map-dot" cx="68" cy="45" r="4" />
        <circle class="map-dot" cx="75" cy="50" r="2.5" />
    </g>
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-map-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.map-outline {
    fill: none;
    stroke: #A0C4FF;
    stroke-width: 2.5;
    opacity: 0.6;
}
.map-fill {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scaleY(0.2);
    transform-origin: 60px 60px;
    animation: map-fill-grow 3s cubic-bezier(.4,1.6,.6,1) infinite;
}
@keyframes map-fill-grow {
    0% { transform: scaleY(0.2); opacity: 0.12; }
    18% { transform: scaleY(1); opacity: 0.7; }
    80% { transform: scaleY(1); opacity: 0.7; }
    100% { transform: scaleY(0.2); opacity: 0.12; }
}
.map-dot {
    fill: #FFB300;
    opacity: 0.7;
    animation: map-dot-pop 3s cubic-bezier(.4,1.6,.6,1) infinite;
}
@keyframes map-dot-pop {
    0% { opacity: 0.2; transform: scale(0.5); }
    20% { opacity: 1; transform: scale(1.2); }
    60% { opacity: 1; transform: scale(1); }
    100% { opacity: 0.2; transform: scale(0.5); }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
