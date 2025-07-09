<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-theme-river-svg">
  <path class="river river1" d="M10,40 Q30,20 50,40 Q70,60 90,40" />
  <path class="river river2" d="M10,50 Q30,30 50,50 Q70,70 90,50" />
  <path class="river river3" d="M10,60 Q30,40 50,60 Q70,80 90,60" />
</svg>
</template>
<script setup>

</script>
<style scoped>
.empty-theme-river-svg {
  display: block;
  margin: 0 auto;
  animation: floatX 5.2s ease-in-out infinite;
}
.river {
  fill: none;
  stroke-width: 8;
  stroke: #4F8EF7;
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
  opacity: 0.7;
  animation: river-flow 3.6s cubic-bezier(.4,1.6,.6,1) infinite;
}
.river2 {
  stroke-width: 6;
  stroke: #A0C4FF;
  animation-delay: 0.4s;
}
.river3 {
  stroke-width: 4;
  stroke: #FFB300;
  animation-delay: 0.8s;
}
@keyframes river-flow {
  0% { stroke-dashoffset: 120; opacity: 0.2; }
  30% { stroke-dashoffset: 0; opacity: 1; }
  70% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 120; opacity: 0.2; }
}
@keyframes floatX {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-8px) translateX(4px); }
  50% { transform: translateY(-12px) translateX(-4px); }
  75% { transform: translateY(-8px) translateX(4px); }
  100% { transform: translateY(0) translateX(0); }
}
</style>
