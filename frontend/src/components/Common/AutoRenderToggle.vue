<template>
<div class="block-toggle-group" style="position: relative;">
    <div class="block-toggle" :class="{ 'checked': modelValue }">
        <div class="block-toggle-slider" :class="{ 'right': !modelValue }"></div>
        <div class="block-toggle-option left" :class="{ active: modelValue }"
            @mouseover="showToggleTooltip($event, 'Auto')" @mouseout="hideToggleTooltip"
            @focus="showToggleTooltip($event, 'Auto')" @blur="hideToggleTooltip"
            @click="() => emit('update:modelValue', true)"
            tabindex="0"
        >
            <span v-html="getThemeIcon('lightning')"></span>
        </div>
        <div class="block-toggle-option right" :class="{ active: !modelValue }"
            @mouseover="showToggleTooltip($event, 'Manual')" @mouseout="hideToggleTooltip"
            @focus="showToggleTooltip($event, 'Manual')" @blur="hideToggleTooltip"
            @click="() => emit('update:modelValue', false)"
            tabindex="0"
        >
            <span v-html="getThemeIcon('pointer')"></span>
        </div>
    </div>
    <teleport to="body">
        <div v-if="toggleTooltip.visible" class="toggle-tooltip" :style="toggleTooltip.style">
            {{ toggleTooltip.text }}
        </div>
    </teleport>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, nextTick, defineProps } from 'vue'
import { getThemeIcon } from '@/assets/JS/SVG/icons.js'

const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const toggleTooltip = ref({ visible: false, text: '', style: {} })
let tooltipPositioned = false
function showToggleTooltip (event, type) {
    toggleTooltip.value.text = type === 'Auto' ? 'Real-time Render' : 'Manual Render'
    if (!tooltipPositioned) {
        toggleTooltip.value.visible = true
        nextTick(() => {
            let el = event.currentTarget || event.target
            if (el && el.classList && !el.classList.contains('block-toggle-option')) {
                el = el.closest('.block-toggle-option')
            }
            if (el) {
                const rect = el.getBoundingClientRect()
                toggleTooltip.value.style = {
                    left: `${rect.left + rect.width / 2 - 50 + window.scrollX}px`,
                    top: `${rect.bottom + 6 + window.scrollY}px`,
                    position: 'absolute',
                    zIndex: 2000,
                    minWidth: '100px',
                    textAlign: 'center'
                }
                tooltipPositioned = true
            }
        })
    } else {
        toggleTooltip.value.visible = true
    }
}
// 只保留一份 hideToggleTooltip，防止重复声明
function hideToggleTooltip () {
    toggleTooltip.value.visible = false
    tooltipPositioned = false
}
</script>

<style scoped>

.block-toggle-group {
    display: flex;
    align-items: center;
    margin-right: 18px;
    position: relative;
}
.block-toggle {
    position: relative;
    width: 74px;
    height: 26px;
    background: #f5f5f5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: background 0.2s;
    user-select: none;
    border: 1px solid #e0e0e0;
}
.block-toggle-option {
    flex: 1;
    text-align: center;
    z-index: 2;
    font-size: 0.93em;
    font-weight: 500;
    color: #888;
    transition: color 0.2s, font-weight 0.2s;
    padding: 0 1px;
    line-height: 26px;
    border-radius: 6px;
    position: relative;
    letter-spacing: 0.01em;
}
.block-toggle-option.active {
    color: #222;
    font-weight: 700;
    background: #e0e0e0;
}
.block-toggle-slider {
    position: absolute;
    top: 1.5px;
    left: 2px;
    width: 32px;
    height: 21px;
    background: #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: left 0.18s cubic-bezier(.4,2,.6,1), background 0.2s;
    z-index: 1;
}
.block-toggle-slider.right {
    left: 40px;
    background: #e0e0e0;
}
.toggle-tooltip {
    position: fixed;
    background: #222;
    color: #fff;
    border-radius: 5px;
    padding: 3px 6px;
    font-size: 12px;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.13);
    white-space: nowrap;
    opacity: 0.97;
    transition: opacity 0.18s;
}

/* 深色模式适配 */
[data-theme="dark"] .block-toggle {
    background: #23272e;
    border-color: #444c5a;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
[data-theme="dark"] .block-toggle-option {
    color: #aaa;
}
[data-theme="dark"] .block-toggle-option.active {
    color: #fff;
    background: #3a4251;
}
[data-theme="dark"] .block-toggle-slider,
[data-theme="dark"] .block-toggle-slider.right {
    background: #3a4251;
}
[data-theme="dark"] .toggle-tooltip {
    background: #222b3a;
    color: #e0e6f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.33);
    font-size: 12px;
}
</style>
