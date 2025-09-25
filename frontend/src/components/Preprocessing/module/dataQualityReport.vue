<template>
<div class="data-quality-report-container">
    <div v-if="!report" class="report-placeholder">
        <p style="user-select: none;">Generating data quality report...</p>
    </div>
    <div v-else class="report-content">
    </div>
</div>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue'

import { generateDataQualityReport } from '@/assets/JS/utils/reportGen.js'

const props = defineProps({
    data: { type: Object, default: () => ({}) }
})

const report = ref(null)

</script>

<style scoped>
.data-quality-report-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
}
.report-placeholder {
    text-align: center;
    color: #888;
    font-size: 1.2em;
}
</style>