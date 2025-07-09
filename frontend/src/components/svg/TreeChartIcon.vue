<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-tree-svg">
    <g>
        <!-- 连线 -->
        <polyline class="tree-link" points="60,20 60,40 40,60" />
        <polyline class="tree-link" points="60,40 80,60" />
        <!-- 节点 -->
        <circle class="tree-node root" cx="60" cy="20" r="6" />
        <circle class="tree-node child1" cx="40" cy="60" r="5" />
        <circle class="tree-node child2" cx="80" cy="60" r="5" />
    </g>
</svg>
</template>
<script setup>
</script>
<style scoped>
.empty-tree-svg { display: block; margin: 0 auto; animation: floatX 4.2s ease-in-out infinite; }
.tree-link {
    stroke: #A0C4FF;
    stroke-width: 2.5;
    fill: none;
    opacity: 0.18;
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: tree-link-grow 4.3s cubic-bezier(.4,1.6,.6,1) infinite;
}
@keyframes tree-link-grow {
    0% { stroke-dashoffset: 40; opacity: 0.12; }
    18% { stroke-dashoffset: 0; opacity: 0.7; }
    80% { stroke-dashoffset: 0; opacity: 0.7; }
    100% { stroke-dashoffset: 40; opacity: 0.12; }
}
.tree-node {
    fill: #4F8EF7;
    opacity: 0.18;
    transform: scale(0.5);
    animation: tree-node-pop 4.3s cubic-bezier(.4,1.6,.6,1) infinite;
}
.root { animation-delay: 0.1s; }
.child1 { animation-delay: 0.4s; }
.child2 { animation-delay: 0.7s; }
@keyframes tree-node-pop {
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
