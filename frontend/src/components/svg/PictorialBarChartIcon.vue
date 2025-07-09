<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-pictorialbar-svg">
    <g>
        <!-- 象形柱（圆形叠加） -->
        <g class="pict-bar bar1">
        <circle cx="35" cy="65" r="10" />
        <circle cx="35" cy="50" r="8" />
        <circle cx="35" cy="38" r="6" />
        </g>
        <g class="pict-bar bar2">
        <rect x="60" y="45" width="20" height="30" rx="8" />
        <rect x="65" y="35" width="10" height="10" rx="5" />
        </g>
    </g>
</svg>
</template>
<script setup>
</script>
<style scoped>
.empty-pictorialbar-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.pict-bar circle, .pict-bar rect {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scaleY(0.2);
    transform-origin: bottom center;
    animation: pict-bar-grow 3.56s cubic-bezier(.4,1.6,.6,1) infinite;
}
.bar1 circle { animation-delay: 0.1s; }
.bar2 rect { animation-delay: 0.4s; }
@keyframes pict-bar-grow {
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
