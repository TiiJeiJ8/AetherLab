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
                <option value="" disabled>字段</option>
                <option v-for="f in availableFields" :key="f.name" :value="f.name">{{ f.label || f.name }}</option>
            </select>
            <select v-model="filter.operator">
                <option v-for="op in getOperators(filter.type)" :key="op.value" :value="op.value">{{ op.label }}</option>
            </select>
            <template v-if="filter.type==='number'">
                <input v-if="filter.operator!=='range'" type="number" v-model="filter.value" placeholder="数值" />
                <span v-else>
                <input type="number" v-model="filter.valueMin" placeholder="最小值" style="width:60px;" /> -
                <input type="number" v-model="filter.valueMax" placeholder="最大值" style="width:60px;" />
                </span>
            </template>
            <template v-else-if="filter.type==='category'">
                <select v-if="filter.operator==='in'" v-model="filter.value" multiple style="min-width:80px;">
                <option v-for="v in getCategoryValues(filter.field)" :key="v" :value="v">{{ v }}</option>
                </select>
                <select v-else v-model="filter.value">
                <option v-for="v in getCategoryValues(filter.field)" :key="v" :value="v">{{ v }}</option>
                </select>
            </template>
            <input v-else v-model="filter.value" placeholder="值" />
            <button class="remove-btn" @click="removeFilter(idx)">×</button>
            </div>
            <div class="filter-panel-actions">
            <button @click="addFilter">+ 添加条件</button>
            </div>
            <div v-if="errorMsg" class="filter-error">{{ errorMsg }}</div>
        </div>
    </transition>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
const props = defineProps({
    // 传入当前映射区配置对象（如 { xAxis, yAxis, series... }）
    modelValue: { type: Object, required: true },
    rawData: { type: Array, default: () => [] } // 新增
})
const emit = defineEmits(['apply-filter'])

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
function getOperators (type) {
  switch (type) {
    case 'number':
    case 'integer':
      return [
        { value: 'eq', label: '=' },
        { value: 'ne', label: '≠' },
        { value: 'gt', label: '>' },
        { value: 'ge', label: '≥' },
        { value: 'lt', label: '<' },
        { value: 'le', label: '≤' }
      ]
    case 'string':
      return [
        { value: 'eq', label: '等于' },
        { value: 'ne', label: '不等于' },
        { value: 'contains', label: '包含' },
        { value: 'notcontains', label: '不包含' },
        { value: 'startsWith', label: '开头是' },
        { value: 'endsWith', label: '结尾是' }
      ]
    case 'category':
      return [
        { value: 'eq', label: '=' },
        { value: 'ne', label: '≠' },
        { value: 'in', label: '包含于' },
        { value: 'notin', label: '不包含于' }
      ]
    case 'boolean':
      return [
        { value: 'eq', label: '等于' },
        { value: 'ne', label: '不等于' }
      ]
    case 'date':
      return [
        { value: 'eq', label: '=' },
        { value: 'ne', label: '≠' },
        { value: 'before', label: '早于' },
        { value: 'after', label: '晚于' }
      ]
    default:
      return [
        { value: 'eq', label: '=' },
        { value: 'ne', label: '≠' }
      ]
  }
}
function getCategoryValues (field) {
    const f = availableFields.value.find(f => f.name === field)
    console.log('[FilterPanel] getCategoryValues for field:', field, 'Values:', f ? f.values : '[]')
    return f && f.values ? f.values : []
}
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
function validate () {
    for (const f of filters.value) {
        if (!f.field || !f.operator || (f.operator !== 'range' && (f.value === '' || f.value === undefined))) {
        errorMsg.value = '请完整填写所有筛选条件'; return false
        }
        if (f.type === 'number' && f.operator === 'range' && (f.valueMin === '' || f.valueMax === '')) {
        errorMsg.value = '区间筛选需填写最小值和最大值'; return false
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
