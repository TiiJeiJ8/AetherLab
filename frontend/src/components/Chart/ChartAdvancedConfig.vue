<template>
<div class="advanced-section">
    <div class="section-header adv-header" @click="toggleCollapse">
        <h4>Advanced Settings</h4>
        <span class="collapse-icon" :class="{ collapsed: isCollapsed }">&#9660;</span>
    </div>
    <transition name="collapse">
        <div v-show="!isCollapsed" class="adv-content">
            <div v-for="item in filteredAdvancedConfig" :key="item.key" class="config-item">
                <!-- 组件标题 -->
                <label>{{ item.label }}</label>

                <!-- 输入number,显示数字输入框 -->
                <input v-if="item.type === 'number'" type="number"
                :min="item.min" :max="item.max"
                :placeholder="item.placeholder"
                :value="localConfig[item.key]"
                @input="updateField(item.key, $event.target.valueAsNumber)" />

                <!-- 输入checkbox,显示复选框 -->
                <input v-if="item.type === 'checkbox'" type="checkbox"
                :checked="localConfig[item.key]"
                @change="updateField(item.key, $event.target.checked)" />

                <!-- 输入text，显示文本输入框 -->
                <input v-if="item.type === 'text'" type="text"
                :placeholder="item.placeholder"
                :value="localConfig[item.key]"
                @input="updateField(item.key, $event.target.value)" />

                <!-- 输入select，显示下拉选择框 -->
                <select v-if="item.type === 'select'" :value="localConfig[item.key]" @change="updateField(item.key, $event.target.value)">
                    <option v-for="option in item.options" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
            </div>
        </div>
    </transition>
</div>
</template>

<script setup>
/* no-undef */
/* eslint-disable */
import { ref, watch, computed } from 'vue'
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

// 检查条件是否满足
function checkCondition(condition, config) {
    for (const [key, expectedValue] of Object.entries(condition)) {
        const actualValue = config[key]
        
        if (Array.isArray(expectedValue)) {
            // 如果期望值是数组，检查实际值是否在数组中
            if (!expectedValue.includes(actualValue)) {
                return false
            }
        } else if (typeof expectedValue === 'boolean') {
            // 布尔值直接比较
            if (actualValue !== expectedValue) {
                return false
            }
        } else {
            // 字符串或其他类型的值
            if (actualValue !== expectedValue) {
                return false
            }
        }
    }
    return true
}

// 过滤配置项，只显示满足条件的项目
const filteredAdvancedConfig = computed(() => {
    if (!props.advancedConfig) return []
    
    return props.advancedConfig.filter(item => {
        if (!item.condition) return true // 没有条件限制，总是显示
        
        // 使用 props.modelValue 而不是 localConfig.value 来确保实时响应
        return checkCondition(item.condition, props.modelValue)
    })
})

function updateField(key, value) {
    localConfig.value[key] = value
    
    //bugFix 只更新当前字段，不覆盖其他字段
    const updatedConfig = { ...props.modelValue }
    updatedConfig[key] = value
    
    emit('update:modelValue', updatedConfig)
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
.config-description {
    display: block;
    color: var(--text-secondary);
    font-size: 12px;
    margin-top: 4px;
    opacity: 0.8;
}
.config-item {
    margin-bottom: 12px;
}
.config-item label {
    display: block;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--text-main);
}
</style>
