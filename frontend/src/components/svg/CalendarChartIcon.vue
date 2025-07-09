<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-calendar-svg">
    <g>
        <!-- 日历外框 -->
        <rect x="25" y="20" width="70" height="50" rx="8" class="calendar-frame" />
        <!-- 日期格子 -->
        <rect v-for="i in 7" :key="i" :x="32 + (i-1)*9" y="32" width="7" height="7" rx="2" class="calendar-cell cell1" />
        <rect v-for="i in 7" :key="i+7" :x="32 + (i-1)*9" y="43" width="7" height="7" rx="2" class="calendar-cell cell2" />
        <rect v-for="i in 7" :key="i+14" :x="32 + (i-1)*9" y="54" width="7" height="7" rx="2" class="calendar-cell cell3" />
    </g>
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-calendar-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.calendar-frame {
    fill: #A0C4FF;
    opacity: 0.18;
}
.calendar-cell {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scale(0.5);
    animation: cell-pop 2.75s cubic-bezier(.4,1.6,.6,1) infinite;
}
.cell1 { animation-delay: 0.1s; }
.cell2 { animation-delay: 0.4s; }
.cell3 { animation-delay: 0.7s; }
@keyframes cell-pop {
    0% { opacity: 0.18; transform: scale(0.5); }
    18% { opacity: 1; transform: scale(1.1); }
    60% { opacity: 1; transform: scale(1); }
    100% { opacity: 0.18; transform: scale(0.5); }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
