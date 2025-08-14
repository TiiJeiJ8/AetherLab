/* eslint-disable */

// chartUnifiedService.js
// 一站式生成 ECharts option 的超级统一接口
// 依赖 dataMergeUtils.js 和 echartOptionUtils.js

import { mergeChartData } from './dataMergeUtils'
import { generateEChartOption } from './echartOptionUtils'

/**
 * 一站式生成 ECharts option
 * @param {Object} params
 * @param {Object} params.config - 图表配置（字段映射、过滤等）
 * @param {Object} params.fileDataMap - 文件名到数据行的映射
 * @param {string|Object} params.chartType - 图表类型（如 'Bar', 'Pie' 等，区分大小写）
 * @param {string} [params.nullHandlingType] - 缺失值处理方式（可选）
 * @param {Object} [params.options] - mergeChartData 的 options（可选）
 * @param {Object} [params.customOption] - ECharts option 个性化配置（可选）
 * @returns {Promise<Object>} ECharts option
 */
export async function getUnifiedEChartOption({
    config,
    fileDataMap,
    chartType,
    nullHandlingType = 'ignore',
    options = {},
    customOption = {}
}) {
    // 1. 数据合并与预处理
    const { xData, yDataArr, mergeType, seriesData } = mergeChartData(
        config,
        fileDataMap,
        nullHandlingType,
        options
    )
    // 2. 生成 ECharts option
    const selectedChartType = typeof chartType === 'string' ? { value: chartType } : chartType
    const option = await generateEChartOption(
        config,
        fileDataMap,
        xData,
        yDataArr,
        selectedChartType,
        seriesData,
        customOption
    )
    return option
}

// 用法示例：
// import { getUnifiedEChartOption } from './chartUnifiedService'
// const option = await getUnifiedEChartOption({ config, fileDataMap, chartType: 'Bar', customOption: { ... } })
