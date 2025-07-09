<!-- 图标轮播动画 -->
<template>
<component
v-if="currentIcon"
:is="currentIcon"
class="animate-icon-svg"
:style="{ opacity: iconOpacity, transition: `opacity ${fadeDuration}ms cubic-bezier(.4,1.6,.6,1)` }"
/>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, defineProps, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
    iconList: { type: Array, required: true },
    interval: { type: Number, default: 3500 }, // 每个图标显示时长ms
    fade: { type: Number, default: 600 } // 淡入淡出时长ms
})

const iconIndex = ref(0)
const iconOpacity = ref(1)
let iconTimer = null
let fadeTimer = null

const fadeDuration = computed(() => props.fade)
const currentIcon = computed(() => {
    const icon = props.iconList[iconIndex.value]
    return icon && typeof icon === 'object' ? icon : null
})

function startIconLoop () {
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
    iconOpacity.value = 1
    iconTimer = setInterval(() => {
        iconOpacity.value = 0
        fadeTimer = setTimeout(() => {
        iconIndex.value = (iconIndex.value + 1) % props.iconList.length
        iconOpacity.value = 1
        }, props.fade)
    }, props.interval)
}

onMounted(() => {
    startIconLoop()
})
onBeforeUnmount(() => {
    clearInterval(iconTimer)
    clearTimeout(fadeTimer)
})

// 支持外部 iconList 变更时重置轮播
watch(() => props.iconList, () => {
    iconIndex.value = 0
    startIconLoop()
})
</script>

<style scoped>
.animate-icon-svg {
    margin-bottom: 15px;
    opacity: 0.92;
    animation: floatX 3.2s ease-in-out infinite;
    will-change: transform;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
@keyframes floatX {
    0% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-12px) translateX(-4px); }
    75% { transform: translateY(-8px) translateX(4px); }
    100% { transform: translateY(0) translateX(0); }
}
</style>
