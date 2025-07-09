<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-sunburst-svg">
  <!-- 多层旭日环 -->
  <circle cx="45" cy="35" r="10" fill="#A0C4FF" opacity="0.18" />
  <circle cx="45" cy="35" r="18" fill="#A0C4FF" opacity="0.12" />
  <circle cx="45" cy="35" r="24" fill="#A0C4FF" opacity="0.08" />
  <!-- 多层弧段 -->
  <path class="arc arc1" d="M45,35 L45,11 A24,24 0 0,1 67,23 Z" fill="#4F8EF7" />
  <path class="arc arc2" d="M45,35 L67,23 A24,24 0 0,1 67,47 Z" fill="#FFB300" />
  <path class="arc arc3" d="M45,35 L67,47 A24,24 0 0,1 45,59 Z" fill="#A0C4FF" />
  <path class="arc arc4" d="M45,35 L45,59 A24,24 0 0,1 23,47 Z" fill="#4F8EF7" />
  <path class="arc arc5" d="M45,35 L23,47 A24,24 0 0,1 23,23 Z" fill="#FFB300" />
  <path class="arc arc6" d="M45,35 L23,23 A24,24 0 0,1 45,11 Z" fill="#A0C4FF" />
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-sunburst-svg {
  display: block;
  margin: 0 auto;
  animation: floatX 5.2s ease-in-out infinite;
}
.arc {
  opacity: 0.85;
  transform-origin: 45px 35px;
  animation: arc-pop 2.7s cubic-bezier(.4,1.6,.6,1) infinite;
}
.arc1 { animation-delay: 0.0s; }
.arc2 { animation-delay: 0.2s; }
.arc3 { animation-delay: 0.4s; }
.arc4 { animation-delay: 0.6s; }
.arc5 { animation-delay: 0.8s; }
.arc6 { animation-delay: 1.0s; }
@keyframes arc-pop {
  0% { transform: scale(0.7); opacity: 0.35; }
  18% { transform: scale(1.1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 1; }
  82% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.7); opacity: 0.35; }
}
@keyframes floatX {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-8px) translateX(4px); }
  50% { transform: translateY(-12px) translateX(-4px); }
  75% { transform: translateY(-8px) translateX(4px); }
  100% { transform: translateY(0) translateX(0); }
}
</style>
