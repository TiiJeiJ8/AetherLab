<template>
<svg width="150" height="120" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-scatter-svg">
<polyline points="10,50 80,50" stroke="#bbb" stroke-width="2" />
<polyline points="10,50 10,10" stroke="#bbb" stroke-width="2" />
<circle class="dot dot1" cx="20" cy="40" r="4" fill="#4F8EF7" />
<circle class="dot dot2" cx="35" cy="30" r="3" fill="#A0C4FF" />
<circle class="dot dot3" cx="55" cy="20" r="5" fill="#FFB300" />
<circle class="dot dot4" cx="70" cy="45" r="3.5" fill="#4F8EF7" />
</svg>
</template>

<script setup>
</script>

<style scoped>
.empty-scatter-svg {
    display: block;
    margin: 0 auto;
    animation: floatX 4.2s ease-in-out infinite;
}
.dot {
    opacity: 0;
    transform: scale(0.5);
    animation: dot-pop 3.9s cubic-bezier(.4,1.6,.6,1) infinite;
}
.dot1 { animation-delay: 0.5s; }
.dot2 { animation-delay: 0.7s; }
.dot3 { animation-delay: 0.9s; }
.dot4 { animation-delay: 1.1s; }
@keyframes dot-pop {
    0% { opacity: 0; transform: scale(0.5); }
    20% { opacity: 1; transform: scale(1.2); }
    60% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5); }
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
