<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-sankey-svg">
  <!-- 多节点 -->
  <rect class="node" x="10" y="25" width="12" height="10" rx="3" />
  <rect class="node" x="10" y="45" width="12" height="10" rx="3" />
  <rect class="node" x="68" y="15" width="12" height="10" rx="3" />
  <rect class="node" x="68" y="35" width="12" height="10" rx="3" />
  <rect class="node" x="68" y="50" width="12" height="10" rx="3" />
  <!-- 多条流向 -->
  <path class="sankey-flow flow1" d="M22,30 Q45,10 68,20" />
  <path class="sankey-flow flow2" d="M22,30 Q45,30 68,40" />
  <path class="sankey-flow flow3" d="M22,50 Q45,55 68,55" />
  <path class="sankey-flow flow4" d="M22,50 Q45,40 68,25" />
</svg>
</template>
<script setup>

</script>
<style scoped>
.empty-sankey-svg {
  display: block;
  margin: 0 auto;
  animation: floatX 5.2s ease-in-out infinite;
}
.node {
  fill: #A0C4FF;
  opacity: 0.85;
  animation: node-pop 2.2s cubic-bezier(.4,1.6,.6,1) infinite;
}
.sankey-flow {
  fill: none;
  stroke: #FFB300;
  stroke-width: 5;
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  opacity: 0.7;
  animation: sankey-draw 2.2s cubic-bezier(.4,1.6,.6,1) infinite;
}
.flow1 { stroke: #4F8EF7; animation-delay: 0.1s; }
.flow2 { stroke: #A0C4FF; animation-delay: 0.5s; }
.flow3 { stroke: #FFB300; animation-delay: 0.9s; }
.flow4 { stroke: #4F8EF7; animation-delay: 1.3s; }
@keyframes sankey-draw {
  0% { stroke-dashoffset: 60; opacity: 0.2; }
  30% { stroke-dashoffset: 0; opacity: 1; }
  70% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 60; opacity: 0.2; }
}
@keyframes node-pop {
  0% { transform: scale(0.8); opacity: 0.7; }
  20% { transform: scale(1.1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 1; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
}
@keyframes floatX {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-8px) translateX(4px); }
  50% { transform: translateY(-12px) translateX(-4px); }
  75% { transform: translateY(-8px) translateX(4px); }
  100% { transform: translateY(0) translateX(0); }
}
</style>
