<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-graph-svg">
    <g>
        <!-- 节点 -->
        <circle class="graph-node node1" cx="40" cy="40" r="8" />
        <circle class="graph-node node2" cx="80" cy="30" r="6" />
        <circle class="graph-node node3" cx="70" cy="65" r="5" />
        <circle class="graph-node node4" cx="55" cy="60" r="4" />
        <!-- 连线 -->
        <line class="graph-link" x1="40" y1="40" x2="80" y2="30" />
        <line class="graph-link" x1="40" y1="40" x2="70" y2="65" />
        <line class="graph-link" x1="40" y1="40" x2="55" y2="60" />
        <line class="graph-link" x1="80" y1="30" x2="70" y2="65" />
        <line class="graph-link" x1="70" y1="65" x2="55" y2="60" />
    </g>
</svg>
</template>
<script setup>
</script>
<style scoped>
.empty-graph-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.graph-link {
    stroke: #A0C4FF;
    stroke-width: 2.5;
    opacity: 0.18;
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: link-grow 2.8s cubic-bezier(.4,1.6,.6,1) infinite;
}
@keyframes link-grow {
    0% { stroke-dashoffset: 40; opacity: 0.12; }
    18% { stroke-dashoffset: 0; opacity: 0.7; }
    80% { stroke-dashoffset: 0; opacity: 0.7; }
    100% { stroke-dashoffset: 40; opacity: 0.12; }
}
.graph-node {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scale(0.5);
    animation: node-pop 2.8s cubic-bezier(.4,1.6,.6,1) infinite;
}
.node1 { animation-delay: 0.1s; }
.node2 { animation-delay: 0.3s; }
.node3 { animation-delay: 0.5s; }
.node4 { animation-delay: 0.7s; }
@keyframes node-pop {
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
