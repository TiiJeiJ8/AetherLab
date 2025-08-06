<template>
<header class="instruction-top-bar">
    <div class="top-bar-container">
        <!-- Logo区域 -->
        <div style="display: flex; align-items: center; gap: 12px;">
            <span class="app-logo">AetherLab</span>
            <span style="font-size: 2rem; font-weight: bold;">- Instructions</span>
        </div>

        <!-- 操作按钮区域 -->
        <div class="actions-section">
            <!-- 操作按钮 -->
            <template v-for="(action, index) in actions" :key="index">
                <button
                v-if="action.type === 'button'"
                class="action-btn"
                @click="action.onClick"
                :title="action.label"
                >
                <span v-if="action.icon" class="btn-icon">{{ action.icon }}</span>
                <span class="btn-text">{{ action.label }}</span>
                </button>

                <button
                v-else-if="action.type === 'toggle'"
                class="toggle-btn"
                :class="{ 'active': action.active.value }"
                @click="action.onClick"
                :title="action.label"
                >
                <span v-if="action.icon" class="btn-icon">{{ action.icon }}</span>
                <span class="btn-text">{{ action.label }}</span>
                </button>
            </template>
        </div>
    </div>
</header>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue'

const props = defineProps({
    actions: {
        type: Array,
        default: () => []
    }
})
</script>

<style scoped>
@import '../../assets/CSS/InstructionTopBar_instruction.css';
</style>
