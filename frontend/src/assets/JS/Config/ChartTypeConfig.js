// ChartTypeConfig.js
// 图表类型的动态配置项描述，便于模块化和可扩展
/* eslint-disable */
export const chartTypeConfig = {
    // 折线图
    Line: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true },
        ],
        advanced: [
        ]
    },
    // 柱状图
    Bar: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true },
        ],
        advanced: [
        ]
    },
    // 饼图
    Pie: {
        mapping: [
            { key: 'category', label: 'Category', type: 'dimension', required: true },
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        advanced: [
        ]
    },
    // 散点图
    Scatter: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true },
        ],
        advanced: [
        ]
    },
    // 地图
    GeoMap: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // K线图
    Candlestick: {
        mapping: [
            { key: 'time', label: 'Time', type: 'dimension', required: true },
            { key: 'open', label: 'Open', type: 'measure', required: true },
            { key: 'close', label: 'Close', type: 'measure', required: true },
            { key: 'high', label: 'High', type: 'measure', required: true },
            { key: 'low', label: 'Low', type: 'measure', required: true },
        ],
        advanced: [
        ]
    },
    // 雷达图
    Radar: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 箱线图
    Boxplot: {
        mapping: [
            { key: 'category', label: 'Category', type: 'dimension', required: true },
            { key: 'min', label: 'Min', type: 'measure', required: true },
            { key: 'q1', label: 'Q1', type: 'measure', required: true },
            { key: 'median', label: 'Median', type: 'measure', required: true },
            { key: 'q3', label: 'Q3', type: 'measure', required: true },
            { key: 'max', label: 'Max', type: 'measure', required: true },
        ],
        advanced: [
        ]
    },
    // 热力图
    Heatmap: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'dimension', required: true },
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        advanced: [
        ]
    },
    // 关系图
    Graph: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 树图
    Tree: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 矩形树图
    Treemap: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 旭日图
    Sunburst: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 平行坐标系图
    Parallel: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 桑基图
    Sankey: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 漏斗图
    Funnel: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 仪表盘
    Gauge: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 象形柱图
    PictorialBar: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 主题河流图
    ThemeRiver: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // 日历图
    Calendar: {
        mapping: [
        ],
        advanced: [
        ]
    },
    // ... 其他图表类型可继续扩展
}
