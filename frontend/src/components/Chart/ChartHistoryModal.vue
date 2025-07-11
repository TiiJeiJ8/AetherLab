<template>
<div>
<transition name="fade-slide">
    <div v-if="show" class="history-modal-draggable" :style="modalStyle" @mousedown.self="startDrag">
        <div class="history-content-rect">
            <div class="history-header-rect" @mousedown.stop="startDrag">
                <span style="margin: 15px;">Charts Storage</span>
                <button class="close-btn" style="margin: 15px;" @click="onClose">×</button>
            </div>
            <div v-if="!chartHistory?.length" class="empty-history-tip">
                No saved charts available.
            </div>
            <div class="history-list-rect">
            <div
                v-for="(item, idx) in chartHistory"
                :key="idx"
                class="chart-history-item-rect"
            >
                <div class="thumb-title-row-rect">
                <div class="chart-thumb-rect" @click="onPreview(item)">
                    <ChartThumbnail :option="item.option" />
                </div>
                <div class="chart-history-title-rect">
                    <template v-if="editingIndex !== idx">
                        <span
                        class="history-title-text"
                        :title="item.title"
                        @click="startEditTitle(idx, item.title)"
                        style="cursor: pointer; user-select: text;"
                        >
                        {{ item.title.length > 7 ? (item.title.slice(0, 7) + '…') : item.title }}
                        </span>
                        <span v-if="item.title.length > 7" class="title-ellipsis-tooltip">{{ item.title }}</span>
                    </template>
                    <template v-else>
                        <input
                        :ref="el => setEditInputRef(el, idx)"
                        v-model="editTitle"
                        class="history-title-input"
                        @blur="saveEditTitle(idx)"
                        @keydown.enter.prevent="saveEditTitle(idx)"
                        @keydown.esc="cancelEditTitle"
                        maxlength="30"
                        :placeholder="'Enter title'"
                        style="width: 90%; max-width: 160px; font-size: 1em; border-radius: 5px; border: 1px solid #d0d0d0; padding: 2px 6px;"
                        :title="editTitle"
                        autocomplete="off"
                        />
                    </template>
                </div>
                <button class="delete-btn-rect" @click.stop="confirmDelete(idx)" title="Delete">×</button>
                </div>
            </div>
            </div>
        </div>
    </div>
</transition>
<transition name="fade">
    <div v-if="showDeleteConfirm" class="confirm-modal" @click.self="cancelDelete">
        <div class="confirm-content">
            <h3 style="color: var(--text-color);">Confirmation</h3>
            <p>Are you sure you want to delete this chart? This operation is irreversible.</p>
            <div name="confirm-buttons">
            <button class="cancel-history-btn" @click="cancelDelete">Cancel</button>
            <button class="confirm-history-btn" @click="handleDelete">Confirm</button>
            </div>
        </div>
    </div>
</transition>
</div>
</template>

<script setup>
/* eslint-disable */
import ChartThumbnail from './ChartThumbnail.vue'
import { ref, onMounted, onBeforeUnmount, defineEmits, defineProps, nextTick } from 'vue'
// 拖拽浮窗相关
const modalStyle = ref({ left: '50vw', top: '12vh' })
const dragOffset = { x: 0, y: 0 }
let dragging = false

function startDrag (e) {
    if (e.button !== 0) return
    dragging = true
    const modal = document.querySelector('.history-modal-draggable')
    const rect = modal.getBoundingClientRect()
    dragOffset.x = e.clientX - rect.left
    dragOffset.y = e.clientY - rect.top
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
}
function onDrag (e) {
    if (!dragging) return
    let left = e.clientX - dragOffset.x
    let top = e.clientY - dragOffset.y
    // 限制在窗口内
    const minLeft = 20
    const minTop = 20
    const maxLeft = window.innerWidth - 480 - 20
    const maxTop = window.innerHeight - 420 - 20
    left = Math.max(minLeft, Math.min(left, maxLeft))
    top = Math.max(minTop, Math.min(top, maxTop))
    modalStyle.value = { left: left + 'px', top: top + 'px' }
}
function stopDrag () {
    dragging = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
}
onMounted(() => {
    // 初始居中
    const w = 480
    const h = 420
    modalStyle.value = {
        left: (window.innerWidth - w) / 2 + 'px',
        top: (window.innerHeight - h) / 3 + 'px'
    }
})
onBeforeUnmount(() => {
    stopDrag()
})
// 删除确认
const showDeleteConfirm = ref(false)
const deleteIndex = ref(null)

function confirmDelete (idx) {
    deleteIndex.value = idx
    showDeleteConfirm.value = true
}

function cancelDelete () {
    showDeleteConfirm.value = false
    deleteIndex.value = null
}

function handleDelete () {
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
function onClose () { emit('close') }
function onPreview(item) { emit('preview', item) }

// 编辑标题相关
const editingIndex = ref(null)
const editTitle = ref('')
const editInputRefs = ref({})

function setEditInputRef(el, idx) {
  if (el) editInputRefs.value[idx] = el
}

function startEditTitle(idx, title) {
  editingIndex.value = idx
  editTitle.value = title
  nextTick(() => {
    const el = editInputRefs.value[idx]
    if (el && typeof el.focus === 'function') el.focus()
  })
}
function saveEditTitle(idx) {
    const val = editTitle.value.trim()
    if (!val) {
        // 非空校验，可加提示
        editTitle.value = ''
        editingIndex.value = null
        return
    }
    // 通知父组件更新标题，保持响应式
    emit('update:title', { idx, title: val })
    editingIndex.value = null
}
function cancelEditTitle() {
    editingIndex.value = null
}
</script>

<style scoped>

@import '../../assets/CSS/ChartHistoryModal.css';

</style>
