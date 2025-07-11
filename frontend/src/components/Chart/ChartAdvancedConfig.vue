<template>
<div class="advanced-section">
    <div class="section-header adv-header" @click="toggleCollapse">
        <h4>Advanced Settings</h4>
        <span class="collapse-icon" :class="{ collapsed: isCollapsed }">&#9660;</span>
    </div>
    <transition name="collapse">
        <div v-show="!isCollapsed" class="adv-content">
            <div v-for="item in advancedConfig" :key="item.key" class="config-item">
                <!-- 组件标题 -->
                <label>{{ item.label }}</label>

                <!-- 输入number,显示数字输入框 -->
                <input v-if="item.type === 'number'" type="number"
                :min="item.min" :max="item.max"
                :value="localConfig[item.key]"
                @input="updateField(item.key, $event.target.valueAsNumber)" />

                <!-- 输入checkbox,显示复选框 -->
                <input v-if="item.type === 'checkbox'" type="checkbox"
                :checked="localConfig[item.key]"
                @change="updateField(item.key, $event.target.checked)" />
                <!-- 其他类型可扩展 -->
            </div>
        </div>
    </transition>
</div>
</template>

<script setup>
/* no-undef */
/* eslint-disable */
import { ref, watch } from 'vue'
const props = defineProps({
    advancedConfig: Array,
    modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const localConfig = ref({ ...props.modelValue })
const isCollapsed = ref(true)

watch(() => props.modelValue, (val) => {
    localConfig.value = { ...val }
})

function updateField(key, value) {
    localConfig.value[key] = value
    emit('update:modelValue', { ...localConfig.value })
}

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.advanced-section {
    margin-bottom: 16px;
    border-radius: 8px;
    background: var(--bg-secondary);
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.adv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 8px 12px;
    user-select: none;
}
.collapse-icon {
    font-size: 16px;
    margin-left: 8px;
    transition: transform 0.2s;
}
.collapse-icon.collapsed {
    transform: rotate(-90deg);
}
.adv-content {
    padding: 8px 16px 12px 16px;
}
.config-item {
    margin-bottom: 12px;
}
.collapse-enter-active, .collapse-leave-active {
    transition: max-height 0.25s cubic-bezier(.4,0,.2,1), opacity 0.2s;
}
.collapse-enter-from, .collapse-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
}
.collapse-enter-to, .collapse-leave-from {
    max-height: 300px;
    opacity: 1;
}
input[type="number"], input[type="text"] {
    background: var(--bg-secondary);
    color: var(--text-main);
    border: 1px solid var(--text-secondary);
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}
input[type="checkbox"] {
    accent-color: #3b82f6;
}
</style>
