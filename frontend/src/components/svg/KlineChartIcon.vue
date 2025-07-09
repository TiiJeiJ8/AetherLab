<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-kline-svg">
    <g>
        <!-- 坐标轴 -->
        <polyline points="10,50 80,50" stroke="#bbb" stroke-width="2" />
        <polyline points="10,50 10,10" stroke="#bbb" stroke-width="2" />
        <!-- K线 -->
        <g class="kline-group">
            <!-- 涨（中幅）-->
            <g class="kbar kbar1">
                <rect x="18" y="28" width="8" height="22" rx="2" />
                <rect x="21.5" y="18" width="2" height="32" rx="1" />
            </g>
            <!-- 跌（大幅）-->
            <g class="kbar kbar2">
                <rect x="30" y="44" width="8" height="6" rx="2" />
                <rect x="33.5" y="38" width="2" height="12" rx="1" />
            </g>
            <!-- 涨（小幅）-->
            <g class="kbar kbar3">
                <rect x="45" y="36" width="8" height="14" rx="2" />
                <rect x="48.5" y="30" width="2" height="20" rx="1" />
            </g>
            <!-- 涨（大幅）-->
            <g class="kbar kbar4">
                <rect x="60" y="16" width="8" height="34" rx="2" />
                <rect x="63.5" y="8" width="2" height="42" rx="1" />
            </g>
            <!-- 跌（中幅）-->
            <g class="kbar kbar5">
                <rect x="75" y="40" width="8" height="10" rx="2" />
                <rect x="78.5" y="34" width="2" height="16" rx="1" />
            </g>
        </g>
    </g>
</svg>
</template>
<script setup>
</script>
<style scoped>
.empty-kline-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.kbar rect {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scaleY(0.2);
    transform-origin: bottom center;
    animation: kbar-grow 3.9s cubic-bezier(.4,1.6,.6,1) infinite;
}
.kbar1 rect { animation-delay: 0.1s; }
.kbar2 rect { animation-delay: 0.3s; }
.kbar3 rect { animation-delay: 0.5s; }
.kbar4 rect { animation-delay: 0.7s; }
.kbar5 rect { animation-delay: 0.9s; }
@keyframes kbar-grow {
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
