<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-heatmap-svg">
<g>
    <rect class="cell cell1" x="20" y="20" width="12" height="12" rx="2" />
    <rect class="cell cell2" x="36" y="20" width="12" height="12" rx="2" />
    <rect class="cell cell3" x="52" y="20" width="12" height="12" rx="2" />
    <rect class="cell cell4" x="20" y="36" width="12" height="12" rx="2" />
    <rect class="cell cell5" x="36" y="36" width="12" height="12" rx="2" />
    <rect class="cell cell6" x="52" y="36" width="12" height="12" rx="2" />
</g>
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-heatmap-svg {
    display: block;
    margin: 0 auto;
    animation: floatX 5.2s ease-in-out infinite;
}
.cell {
    opacity: 0.18;
    fill: #A0C4FF;
    animation: cell-fade 2.65s cubic-bezier(.4,1.6,.6,1) infinite;
}
.cell1 { animation-delay: 0.1s; fill: #4F8EF7; }
.cell2 { animation-delay: 0.3s; fill: #A0C4FF; }
.cell3 { animation-delay: 0.5s; fill: #FFB300; }
.cell4 { animation-delay: 0.7s; fill: #A0C4FF; }
.cell5 { animation-delay: 0.9s; fill: #4F8EF7; }
.cell6 { animation-delay: 1.1s; fill: #FFB300; }
@keyframes cell-fade {
    0% { opacity: 0.18; }
    18% { opacity: 1; }
    60% { opacity: 1; }
    100% { opacity: 0.18; }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
