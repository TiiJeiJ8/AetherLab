<template>
<div class="raw-preview-root">
    <div class="preview-header-inline">
        <div class="header-info">
        <h3>{{ fileName || 'Raw Data Preview' }}</h3>
        <span class="file-info" v-if="rowCount !== null">Showing {{ shownRows }} / {{ rowCount }} rows</span>
        </div>
    </div>

    <div class="preview-table-wrapper-inline">
        <div v-if="tableHeaders.length && displayRows.length" class="table-container-inline">
            <div class="table-body" ref="tableContainerRef">
                <table class="preview-table-inline" ref="tableRef">
                    <thead>
                        <tr>
                            <th class="row-number">#</th>
                            <th v-for="(header, idx) in tableHeaders" :key="idx" class="column-header" :title="String(header).length > 12 ? String(header) : ''">{{ String(header) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in displayRows" :key="idx">
                            <td class="row-number">{{ idx + 1 }}</td>
                            <td v-for="(header, hidx) in tableHeaders" :key="hidx" :title="getCellValue(row, header, hidx)">{{ getCellValue(row, header, hidx) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="empty-tip-inline">
            <div class="empty-icon">📄</div>
            <p>No data available to preview.</p>
        </div>
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { computed } from 'vue'
import { getCellValue } from '@/assets/JS/utils/dataPreviewUtils.js'

const props = defineProps({
    data: { type: Object, default: () => ({}) },
    fileName: { type: String, default: '' }
})

// Normalize headers and rows following DataPreviewModal behavior
const tableHeaders = computed(() => {
    const d = props.data || {}
    // parsedData like previewData
    if (Array.isArray(d.parsedData) && d.parsedData.length > 0) {
        const first = d.parsedData[0]
        if (Array.isArray(first)) return first
        if (first && typeof first === 'object') return Object.keys(first)
    }
    // explicit headers
    if (Array.isArray(d.headers) && d.headers.length > 0) return d.headers
    // data as array of arrays: if first row is array, treat it as header row
    if (Array.isArray(d.data) && d.data.length > 0) {
        const first = d.data[0]
        if (Array.isArray(first)) return first
        // otherwise, derive column count from longest row
        if (Array.isArray(first)) {
            let maxCols = 0
            for (const r of d.data) if (Array.isArray(r) && r.length > maxCols) maxCols = r.length
            return Array.from({ length: maxCols }, (_, i) => `col_${i}`)
        }
    }
    return []
})

const displayRows = computed(() => {
    const d = props.data || {}
    if (Array.isArray(d.parsedData) && d.parsedData.length > 0) {
        const first = d.parsedData[0]
        if (Array.isArray(first)) return d.parsedData.slice(1)
        return d.parsedData
    }
    if (Array.isArray(d.data) && d.data.length > 0) {
        const first = d.data[0]
        if (Array.isArray(first)) return d.data.slice(1)
        return d.data
    }
    return []
})

const rowCount = computed(() => displayRows.value.length)
const shownRows = computed(() => rowCount.value)

</script>

<style scoped>
.raw-preview-root { width:100%; height:100%; display:flex; flex-direction:column; gap:8px; min-height:0; }
.preview-header-inline { display:flex; align-items:center; justify-content:space-between }
.preview-header-inline .header-info h3 { margin:0; font-size:1rem }
.preview-table-wrapper-inline { flex:1; min-height:0; /* outer wrapper */ border:1px solid var(--border-color,#e6e6e6); border-radius:6px; padding:8px }
.table-container-inline { width:100%; flex:1; min-height:0; overflow:auto }
.table-body { overflow:auto }
.preview-table-inline { width:100%; border-collapse:collapse; font-size:0.9rem; background: var(--table-bg); table-layout: auto !important; direction: ltr !important }
.preview-table-inline thead { background: var(--table-header-bg, var(--bg-secondary, #f8f9fa)); font-weight:600 }
.preview-table-inline thead th { color: var(--text-color); font-weight:600 }
.preview-table-inline thead,
.preview-table-inline thead tr { display: table-header-group !important; direction: ltr !important }
.preview-table-inline thead tr { display: table-row !important }
.preview-table-inline thead th { display: table-cell !important; vertical-align: middle !important }
.preview-table-inline th, .preview-table-inline td { padding:6px 8px; border-bottom:1px solid #eee; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:table-cell; vertical-align:middle; text-align:center }
.preview-table-inline th { background: var(--table-header-bg); font-weight:700; padding:12px 16px; }
.preview-table-inline th.row-number { width:70px; min-width:70px; max-width:70px }
.row-number { width:48px; text-align:center }
.empty-tip-inline { color:#999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px }


.preview-table-wrapper-inline,
.table-container-inline,
.table-body {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: rgba(0,0,0,0.25) transparent;
}

.preview-table-wrapper-inline::-webkit-scrollbar,
.table-container-inline::-webkit-scrollbar,
.table-body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.preview-table-wrapper-inline::-webkit-scrollbar-track,
.table-container-inline::-webkit-scrollbar-track,
.table-body::-webkit-scrollbar-track {
    background: transparent;
}

.preview-table-wrapper-inline::-webkit-scrollbar-thumb,
.table-container-inline::-webkit-scrollbar-thumb,
.table-body::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.25);
    border-radius: 6px;
}

[data-theme="dark"] .preview-table-wrapper-inline::-webkit-scrollbar-thumb,
[data-theme="dark"] .table-container-inline::-webkit-scrollbar-thumb,
[data-theme="dark"] .table-body::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.18);
}

/* Dark theme visual improvements */
[data-theme="dark"] .raw-preview-root {
    background: transparent;
}
[data-theme="dark"] .preview-table-wrapper-inline {
    background: var(--bg-color, #333333ff);
    border: 1px solid var(--border-color, #404040);
}
[data-theme="dark"] .preview-table-inline {
    background: transparent;
    color: var(--text-color, #dee2e6);
}
[data-theme="dark"] .preview-table-inline thead {
    background: var(--bg-tertiary, #3d3d3d);
}
[data-theme="dark"] .preview-table-inline th, [data-theme="dark"] .preview-table-inline td {
    border-bottom: 1px solid rgba(255,255,255,0.04);
}
[data-theme="dark"] .preview-table-inline th {
    color: var(--text-color, #dee2e6);
}
[data-theme="dark"] .empty-tip-inline { color: var(--text-secondary, #b0b0b0) }

[data-theme="dark"] .preview-table-wrapper-inline::-webkit-scrollbar-track,
[data-theme="dark"] .table-container-inline::-webkit-scrollbar-track,
[data-theme="dark"] .table-body::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.02);
}

[data-theme="dark"] .preview-table-wrapper-inline::-webkit-scrollbar-thumb,
[data-theme="dark"] .table-container-inline::-webkit-scrollbar-thumb,
[data-theme="dark"] .table-body::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.12);
}
</style>
