<template>
<div class="filter-panel filter-section" :class="{ collapsed }">
    <div class="filter-panel-header">
        <h4 class="filter-panel-title">Data Filtering</h4>
        <div class="logic-toggle-block">
            <div class="block-toggle-group" style="margin:0;">
                <div class="block-toggle" :class="{ 'checked': logic==='AND' }">
                    <div class="block-toggle-slider" :class="{ 'right': logic==='OR' }"></div>
                    <div class="block-toggle-option left" :class="{ active: logic==='AND' }"
                        @click="logic='AND'" tabindex="0">AND</div>
                    <div class="block-toggle-option right" :class="{ active: logic==='OR' }"
                        @click="logic='OR'" tabindex="0">OR</div>
                </div>
            </div>
        </div>
        <!-- Removed collapse button -->
    </div>
    <div class="filter-panel-content">
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
                <button class="add-condition-btn" @click="addFilter">+ Add Condition</button>
            </div>
            <div v-if="errorMsg" class="filter-error">{{ errorMsg }}</div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch } from 'vue'
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
    modelValue: {
        type: Object,
        required: true
    },
    rawData: {
        type: Array,
        default: () => []
    },
    collapsed: {
        type: Boolean,
        default: false
    },
})
const emit = defineEmits(['update:modelValue'])

const filters = ref([])
const logic = ref('AND')
// 已移除折叠栏
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

@import '../../assets/CSS/ChartFilterPanel.css'

</style>
