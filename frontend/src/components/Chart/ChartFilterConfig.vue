<template>
<div class="filter-panel" :class="{ collapsed }">
    <div class="filter-panel-header">
        <span>Data Filtering</span>
        <div class="logic-toggle">
            <label :class="{active: logic==='AND'}" @click="logic='AND'">AND</label>
            <label :class="{active: logic==='OR'}" @click="logic='OR'">OR</label>
        </div>
        <button class="collapse-btn" @click="collapsed=!collapsed">{{ collapsed ? '▼' : '▲' }}</button>
    </div>
    <transition name="fade">
        <div v-show="!collapsed">
            <div v-for="(filter, idx) in filters" :key="filter.id" class="filter-row">
            <select v-model="filter.field" @change="onFieldChange(filter)">
                <option value="" disabled>Field</option>
                <option v-for="f in availableFields" :key="f.name" :value="f.name">{{ f.label || f.name }}</option>
            </select>
            <select v-model="filter.operator">
                <option v-for="op in getOperators(filter.type)" :key="op.value" :value="op.value">{{ op.label }}</option>
            </select>
            <template v-if="filter.type==='number' || filter.type==='integer'">
                <input type="number" v-model="filter.value" placeholder="Value" />
            </template>
            <template v-else-if="filter.type==='category'">
                <select v-if="filter.operator==='in'" v-model="filter.value" multiple style="min-width:80px;">
                <option v-for="v in getCategoryValues(filter.field)" :key="v" :value="v">{{ v }}</option>
                </select>
                <select v-else v-model="filter.value">
                <option v-for="v in getCategoryValues(filter.field)" :key="v" :value="v">{{ v }}</option>
                </select>
            </template>
            <input v-else v-model="filter.value" placeholder="Value" />
            <button class="remove-btn" @click="removeFilter(idx)">×</button>
            </div>
            <div class="filter-panel-actions">
            <button @click="addFilter">+ Add Condition</button>
            </div>
            <div v-if="errorMsg" class="filter-error">{{ errorMsg }}</div>
        </div>
    </transition>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
/**
 * Props
 * @prop {Object} modelValue - v-model 绑定的配置对象，必填
 * @prop {Array} rawData - 原始数据数组，默认 []
 *
 * Emits
 * @event update:modelValue - 过滤条件变更时自动触发，参数为新配置对象
 */
const props = defineProps({
    // 传入当前映射区的配置对象
    modelValue: { type: Object, required: true },
    rawData: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const filters = ref([])
const logic = ref('AND')
const collapsed = ref(false)
const errorMsg = ref('')

// 移除 guessType 函数，availableFields 只用 type
const availableFields = computed(() => {
    const fields = []
    const used = new Set()
    // 直接用 props.rawData
    let allRows = props.rawData || []
    Object.values(props.modelValue).forEach(val => {
        if (Array.isArray(val)) {
        val.forEach(f => {
            if (f && f.field && !used.has(f.field)) {
                let values = f.values
                if (!values && (f.type === 'category' || f.type === 'string') && allRows.length) {
                    values = Array.from(new Set(allRows.map(row => row[f.field]).filter(v => v !== undefined && v !== null && v !== '')))
                }
                fields.push({
                    name: f.field,
                    label: f.field,
                    type: f.type,
                    values
                })
                used.add(f.field)
            }
        })
        } else if (val && typeof val === 'object' && val.field && !used.has(val.field)) {
            let values = val.values
            if (!values && (val.type === 'category' || val.type === 'string') && allRows.length) {
                values = Array.from(new Set(allRows.map(row => row[val.field]).filter(v => v !== undefined && v !== null && v !== '')))
            }
            fields.push({
                name: val.field,
                label: val.field,
                type: val.type,
                values
            })
            used.add(val.field)
        }
    })
    // 调试：输出所有可用字段及类型
    console.log('[FilterPanel] availableFields:', fields)
    return fields
})

// 初始化过滤器
function addFilter () {
    // 默认选第一个字段并自动推断类型
    const firstField = availableFields.value[0]
    filters.value.push({
        id: Date.now() + Math.random(),
        field: firstField ? firstField.name : '',
        operator: '',
        value: '',
        valueMin: '',
        valueMax: '',
        type: firstField ? firstField.type : ''
    })
}
function removeFilter (idx) {
    filters.value.splice(idx, 1)
}

// 获取操作符列表
function getOperators (type) {
    switch (type) {
        case 'number':
        case 'integer':
        return [
            { value: 'eq', label: 'Equals' },
            { value: 'ne', label: 'Not Equals' },
            { value: 'gt', label: 'Greater Than' },
            { value: 'ge', label: 'Greater Than Or Equal' },
            { value: 'lt', label: 'Less Than' },
            { value: 'le', label: 'Less Than Or Equal' }
        ]
        case 'string':
        return [
            { value: 'eq', label: 'Equals' },
            { value: 'ne', label: 'Not Equals' },
            { value: 'contains', label: 'Contains' },
            { value: 'notcontains', label: 'Not Contains' },
            { value: 'startsWith', label: 'Starts With' },
            { value: 'endsWith', label: 'Ends With' }
        ]
        case 'category':
        return [
            { value: 'eq', label: 'Equals' },
            { value: 'ne', label: 'Not Equals' },
            { value: 'in', label: 'In' },
            { value: 'notin', label: 'Not In' }
        ]
        case 'boolean':
        return [
            { value: 'eq', label: 'Equals' },
            { value: 'ne', label: 'Not Equals' }
        ]
        case 'date':
        return [
            { value: 'eq', label: 'Equals' },
            { value: 'ne', label: 'Not Equals' },
            { value: 'before', label: 'Before' },
            { value: 'after', label: 'After' }
        ]
        default:
        return [
            { value: 'eq', label: 'Equals' },
            { value: 'ne', label: 'Not Equals' }
        ]
    }
}

// 获取分类值
function getCategoryValues (field) {
    const f = availableFields.value.find(f => f.name === field)
    console.log('[FilterPanel] getCategoryValues for field:', field, 'Values:', f ? f.values : '[]')
    return f && f.values ? f.values : []
}

// 监听 modelValue 的变化，初始化过滤器
function onFieldChange (filter) {
    const f = availableFields.value.find(fld => fld.name === filter.field)
    filter.type = f ? f.type : ''
    filter.operator = ''
    filter.value = ''
    filter.valueMin = ''
    filter.valueMax = ''
    // 调试：输出当前选中字段的详细信息
    console.log('[FilterPanel] selected field:', f)
}

// 校验过滤器
function validate () {
    for (const f of filters.value) {
        if (!f.field || !f.operator || f.value === '' || f.value === undefined) {
            errorMsg.value = 'Please complete all filter conditions'; return false
        }
    }
    errorMsg.value = ''
    return true
}

// 移除 applyFilters 相关逻辑，改为 watch filters 自动 emit
watch([filters, logic], () => {
    // 校验通过才 emit
    if (validate()) {
        emit('update:modelValue', {
            ...props.modelValue,
            filter: {
                logic: logic.value,
                filters: filters.value.map(f => ({
                    field: f.field,
                    operator: f.operator,
                    value: f.value,
                    type: f.type
                }))
            }
        })
    }
}, { deep: true })
</script>

<style scoped>
.filter-panel {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fafbfc;
    padding: 10px 12px 8px 12px;
    margin-bottom: 12px;
    min-width: 260px;
    max-width: 420px;
    font-size: 14px;
}
.filter-panel.collapsed { min-height: 0; max-height: 36px; overflow: hidden; padding-bottom: 0; }
.filter-panel-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
}
.logic-toggle label {
    margin: 0 4px; padding: 2px 10px; border-radius: 4px; cursor: pointer; background: #f3f3f3; color: #666;
}
.logic-toggle label.active { background: #409EFF; color: #fff; }
.collapse-btn { background: none; border: none; color: #888; cursor: pointer; font-size: 1.1em; margin-left: 8px; }
.filter-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 6px; background: #fff; border-radius: 5px; padding: 6px 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.filter-row select, .filter-row input {
    font-size: 13px; padding: 2px 6px; border-radius: 4px; border: 1px solid #ccc;
    min-width: 100px;
    z-index: 10;
}
.remove-btn { background: none; border: none; color: #c72d4e; font-size: 1.2em; cursor: pointer; margin-left: 2px; }
.filter-panel-actions { display: flex; gap: 12px; margin-top: 10px; }
.apply-btn { background: #409EFF; color: #fff; border: none; border-radius: 4px; padding: 4px 18px; cursor: pointer; }
.filter-error { color: #c72d4e; margin-top: 6px; font-size: 13px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
