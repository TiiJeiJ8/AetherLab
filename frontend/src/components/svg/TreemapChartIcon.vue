<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-treemap-svg">
  <!-- 外层矩形 -->
  <rect x="15" y="15" width="60" height="50" rx="4" fill="#A0C4FF" opacity="0.18" />
  <!-- 层级1 -->
  <rect class="treemap-rect rect1" x="20" y="20" width="20" height="10" rx="2" />
  <rect class="treemap-rect rect2" x="42" y="20" width="28" height="10" rx="2" />
  <!-- 层级2 -->
  <rect class="treemap-rect rect3" x="20" y="32" width="10" height="20" rx="2" />
  <rect class="treemap-rect rect4" x="32" y="32" width="6" height="8" rx="2" />
  <rect class="treemap-rect rect5" x="40" y="32" width="12" height="15" rx="2" />
  <rect class="treemap-rect rect6" x="54" y="32" width="16" height="8" rx="2" />
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-treemap-svg {
  display: block;
  margin: 0 auto;
  animation: floatX 5.2s ease-in-out infinite;
}
.treemap-rect {
  opacity: 0.35;
  fill: #4F8EF7;
  animation: treemap-pop 2.2s cubic-bezier(.4,1.6,.6,1) infinite;
}
.rect1 { animation-delay: 0.1s; fill: #A0C4FF; }
.rect2 { animation-delay: 0.3s; fill: #FFB300; }
.rect3 { animation-delay: 0.5s; fill: #A0C4FF; }
.rect4 { animation-delay: 0.7s; fill: #4F8EF7; }
.rect5 { animation-delay: 0.9s; fill: #FFB300; }
.rect6 { animation-delay: 1.1s; fill: #A0C4FF; }
@keyframes treemap-pop {
  0% { transform: scaleY(0.7); opacity: 0.35; }
  18% { transform: scaleY(1.1); opacity: 1; }
  50% { transform: scaleY(1.15); opacity: 1; }
  82% { transform: scaleY(1.1); opacity: 1; }
  100% { transform: scaleY(0.7); opacity: 0.35; }
}
@keyframes floatX {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-8px) translateX(4px); }
  50% { transform: translateY(-12px) translateX(-4px); }
  75% { transform: translateY(-8px) translateX(4px); }
  100% { transform: translateY(0) translateX(0); }
}
</style>
