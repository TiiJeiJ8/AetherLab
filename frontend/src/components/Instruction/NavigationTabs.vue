<template>
<div class="navigation-tabs">
    <div class="nav-tabs-container">
        <!-- 主导航标签 -->
        <div class="nav-tabs">
        <button
            v-for="module in modules"
            :key="module.id"
            :class="['nav-tab', {
            'active': activeModule === module.id,
            'has-badge': module.badge
            }]"
            @click="switchModule(module.id)"
        >
            <span class="tab-icon">{{ module.icon }}</span>
            <span class="tab-text">{{ module.title }}</span>
            <span v-if="module.badge" class="tab-badge">{{ module.badge }}</span>
        </button>
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */

const props = defineProps({
    modules: {
        type: Array,
        required: true
    },
    activeModule: {
        type: String,
        required: true
    },
    activeSubModule: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['switch-module', 'switch-sub-module'])

const switchModule = (moduleId) => {
    emit('switch-module', moduleId)
}

const switchSubModule = (subModuleId) => {
    emit('switch-sub-module', subModuleId)
}
</script>

<style scoped>
@import '../../assets/CSS/NavigationTabs_instruction.css';
</style>
