<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-boxplot-svg">
    <!-- 坐标轴 -->
    <polyline points="15,70 105,70" stroke="#bbb" stroke-width="2" />
    <polyline points="15,70 15,20" stroke="#bbb" stroke-width="2" />
    <!-- 箱线图（3组）-->
    <g class="boxplot-group">
        <!-- 第一组：左侧，1/4位置 -->
        <g class="box box1">
            <line x1="35" y1="60" x2="35" y2="30" class="whisker" />
            <rect x="27" y="45" width="16" height="15" rx="3" class="box-rect" />
            <line x1="27" y1="52.5" x2="43" y2="52.5" class="median" />
            <circle cx="35" cy="25" r="2.2" class="outlier" />
        </g>
        <!-- 第二组：中间，2/4位置 -->
        <g class="box box2">
            <line x1="60" y1="65" x2="60" y2="35" class="whisker" />
            <rect x="52" y="40" width="16" height="25" rx="3" class="box-rect" />
            <line x1="52" y1="52.5" x2="68" y2="52.5" class="median" />
        </g>
        <!-- 第三组：右侧，3/4位置 -->
        <g class="box box3">
            <line x1="85" y1="60" x2="85" y2="45" class="whisker" />
            <rect x="77" y="50" width="16" height="10" rx="3" class="box-rect" />
            <line x1="77" y1="55" x2="93" y2="55" class="median" />
        </g>
    </g>
</svg>
</template>

<script setup>
</script>

<style scoped>
/* 动画风格参考K线图，统一动画节奏与透明度渐变 */
.empty-boxplot-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.boxplot-group .whisker {
    stroke: #4F8EF7;
    stroke-width: 2;
    opacity: 0.18;
    transform: scaleY(0.2);
    transform-origin: bottom center;
    animation: kbar-grow 3.9s cubic-bezier(.4,1.6,.6,1) infinite;
}
.boxplot-group .box-rect {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scaleY(0.2);
    transform-origin: bottom center;
    animation: kbar-grow 3.9s cubic-bezier(.4,1.6,.6,1) infinite;
}
.boxplot-group .median {
    stroke: #4F8EF7;
    stroke-width: 2.2;
    opacity: 0.7;
    stroke-dasharray: 0 16;
    animation: median-grow 3.9s cubic-bezier(.4,1.6,.6,1) infinite;
}
.boxplot-group .outlier {
    fill: #4F8EF7;
    opacity: 0.5;
    animation: outlier-fade 3.9s ease-in-out infinite;
}
.box1 .box-rect, .box1 .whisker, .box1 .median, .box1 .outlier { animation-delay: 0.1s; }
.box2 .box-rect, .box2 .whisker, .box2 .median, .box2 .outlier { animation-delay: 0.4s; }
.box3 .box-rect, .box3 .whisker, .box3 .median, .box3 .outlier { animation-delay: 0.7s; }
@keyframes kbar-grow {
    0% { transform: scaleY(0.2); opacity: 0.12; }
    18% { transform: scaleY(1); opacity: 0.7; }
    80% { transform: scaleY(1); opacity: 0.7; }
    100% { transform: scaleY(0.2); opacity: 0.12; }
}
@keyframes median-grow {
    0% { stroke-dasharray: 0 16; opacity: 0.12; }
    18% { stroke-dasharray: 16 0; opacity: 0.7; }
    80% { stroke-dasharray: 16 0; opacity: 0.7; }
    100% { stroke-dasharray: 0 16; opacity: 0.12; }
}
@keyframes outlier-fade {
    0% { opacity: 0.1; }
    30% { opacity: 0.5; }
    80% { opacity: 0.5; }
    100% { opacity: 0.1; }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
