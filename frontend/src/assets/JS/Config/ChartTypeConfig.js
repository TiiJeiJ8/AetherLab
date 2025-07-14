// ChartTypeConfig.js
// 图表类型的动态配置项描述，便于模块化和可扩展
/* eslint-disable */
export const chartTypeConfig = {
    Line: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true },
        ],
        advanced: [
            { key: 'lineWidth', label: 'Line Width', type: 'number', min: 1, max: 10, default: 2 }
        ]
    },
    Bar: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true },
        ],
        advanced: [
            { key: 'barWidth', label: 'Bar Width', type: 'number', min: 1, max: 50, default: 10 }
        ]
    },
    Pie: {
        mapping: [
            { key: 'category', label: 'Category', type: 'dimension', required: true },
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        advanced: [
            { key: 'donut', label: 'Donut Mode', type: 'checkbox', default: false }
        ]
    }
    // ... 其他图表类型可继续扩展
}
