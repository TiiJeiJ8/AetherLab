<template>
<div>
<transition name="fade-slide">
    <div v-if="show" class="history-modal" @click.self="onClose">
    <div class="history-content">
        <div class="history-header">
        <span>Charts Storage</span>
        <button class="close-btn" @click="onClose">×</button>
        </div>
        <div v-if="!chartHistory?.length" class="empty-tip">
        No saved charts available.
        </div>
        <div class="history-list">
        <div
            v-for="(item, idx) in chartHistory"
            :key="idx"
            class="chart-history-item"
        >
            <div class="thumb-title-row">
            <ChartThumbnail :option="item.option" @click="onPreview(item)" />
            <div class="chart-history-title">{{ item.title }}</div>
            <button class="delete-btn" @click.stop="confirmDelete(idx)" title="Delete">❌</button>
            </div>
        </div>
        </div>
    </div>
    </div>
</transition>
<transition name="fade">
    <div v-if="showDeleteConfirm" class="confirm-modal" @click.self="cancelDelete">
    <div class="confirm-content">
        <h3>Confirmation</h3>
        <p>Are you sure you want to delete this chart? This operation is irreversible.</p>
        <div name="confirm-buttons">
        <button class="cancel-btn" @click="cancelDelete">Cancel</button>
        <button class="confirm-btn" @click="handleDelete">Confirm</button>
        </div>
    </div>
    </div>
</transition>
</div>
</template>

<script setup>
/* eslint-disable */
import ChartThumbnail from './ChartThumbnail.vue'
import { ref } from 'vue'

// 删除确认
const showDeleteConfirm = ref(false)
let deleteIndex = ref(null)

function confirmDelete(idx) {
    deleteIndex.value = idx
    showDeleteConfirm.value = true
}

function cancelDelete() {
    showDeleteConfirm.value = false
    deleteIndex.value = null
}

function handleDelete() {
    if (deleteIndex.value !== null) {
        emit('delete', deleteIndex.value)
        showDeleteConfirm.value = false
        deleteIndex.value = null
    }
}

// props
const props = defineProps({
    show: Boolean,
    chartHistory: Array
})
const emit = defineEmits(['close', 'preview', 'delete'])
function onClose() { emit('close') }
function onPreview(item) { emit('preview', item) }
function onDelete(idx) { emit('delete', idx) }
</script>

<style scoped>
.history-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
.history-content {
    width: min(90vw, 480px);
    max-height: min(90vh, 600px);
    background: var(--bg-color, #fff);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    padding: clamp(12px, 2vw, 18px);
    overflow-y: auto;
    animation: pop-in 0.4s;
}
.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 10px;
}
.close-btn {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: var(--text-color, #333);
    line-height: 1;
}
.history-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: clamp(8px, 1.5vw, 16px);
    padding: 4px;
}
.chart-history-item {
    background: var(--bg-color);
    border-radius: 8px;
    padding: clamp(6px, 1vw, 10px);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
}
.chart-history-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 1px 1px rgba(58, 57, 57, 0.88);
}
.thumb-title-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
}
.chart-history-title {
    font-size: clamp(0.8em, 1.5vw, 1em);
    font-weight: 500;
    color: var(--text-color);
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: var(--text-color);
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
}
.chart-history-item:hover .delete-btn {
    opacity: 1;
}
@media (max-width: 480px) {
    .history-header {
        font-size: 1em;
        padding: 8px 0;
    }

    .delete-btn {
        opacity: 1; /* 在移动端始终显示删除按钮 */
    }
}

.fade-slide-enter-active, .fade-slide-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
@keyframes pop-in {
    from { opacity: 0; transform: scale(0.95);}
    to { opacity: 1; transform: scale(1);}
}

/* 确认弹窗样式 */
.confirm-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-content {
    background: var(--bg-color, #fff);
    border-radius: 8px;
    padding: 20px;
    width: min(90vw, 300px);
    text-align: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.confirm-content h3 {
    margin: 0 0 12px;
    color: #333;
    font-size: 1.2em;
}

.confirm-content p {
    margin: 0 0 20px;
    color: #666;
    font-size: 0.95em;
}

.confirm-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.confirm-btn, .cancel-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: opacity 0.2s;
}

.cancel-btn {
    background: #f0f0f0;
    color: #666;
}

.confirm-btn {
    background: #dc3545;
    color: white;
}

.confirm-btn:hover, .cancel-btn:hover {
    opacity: 0.8;
}

/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.empty-tip {
    text-align: center;
    color: #999;
    padding: 40px 20px;
    font-size: 1.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 10px 0;
    user-select: none;
}

@media (max-width: 480px) {
    .empty-tip {
        min-height: 150px;
        padding: 20px;
        font-size: 1em;
    }
}
</style>