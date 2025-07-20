// ChartTypeConfig.js
// 图表类型的动态配置项描述，便于模块化和可扩展
// 包含数据映射配置项和高级配置项

/* eslint-disable */
export const chartTypeConfig = {
    // 折线图
    Line: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true },
        ],
        basic: [
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
        basic: [
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
        basic: [
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
        basic: [
        ],
        advanced: [
        ]
    },
    // 地图
    Geo_Map: {
        mapping: [
            // 地区名字
            { key: 'nameField', label: 'Field Name', type: 'dimension', required: false, description: 'Region name field, such as province, city, or district. Used to match map areas.\n ( If you choose this field, it is no need to provide longitude and latitude fields anymore)' },
            // 经纬度坐标及其坐标点名称
            { key: 'lngField', label: 'Longitude', type: 'dimension', required: false, description: 'Longitude & Latitude field, for point-based geo data.' },
            { key: 'latField', label: 'Latitude', type: 'dimension', required: false },
            { key: 'name', label: 'Location Name', type: 'tag', required: false, description: 'Optional name field for points, if not using region names.' },
            // 值
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Value for each region or point (e.g., population, sales).' },
        ],
        basic: [
            // 地图类型选择
            { key: 'mapName', label: 'Map Name', type: 'select', required: true, options: [{ label: 'World', value: 'world' }, { label: 'China', value: 'china' }], default: 'World' },
            // 地图数据源URL
            { key: 'mapUrl', label: 'GeoJSON URL', type: 'text', placeholder: "https://xxx/china.json", required: false },
            // 地图系列类型
            { key: 'seriesType', label: 'Series Type', type: 'select', required: true, options: [{ label: 'Map', value: 'map' }, { label: 'Scatter', value: 'scatter' }, { label: 'Heatmap', value: 'heatmap' }, { label: 'Lines', value: 'lines' }, { label: 'Bar', value: 'bar' }, { label: 'Pie', value: 'pie' }] },
        ],
        advanced: [
        ]
    },
    // K线图
    Candlestick: {
        mapping: [
            // 时间序列
            { key: 'time', label: 'Time', type: 'dimension', required: true },
            // 开盘价、收盘价、最高价、最低价
            { key: 'open', label: 'Open', type: 'measure', required: true },
            { key: 'close', label: 'Close', type: 'measure', required: true },
            { key: 'high', label: 'High', type: 'measure', required: true },
            { key: 'low', label: 'Low', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 雷达图
    Radar: {
        mapping: [
            // 维度名称
            { key: 'indicator', label: 'Indicator', type: 'dimension', required: true, multiple: true, description: 'Radar chart indicators, e.g. ["Sales", "Marketing", "Development"]' },
            // 数据值
            { key: 'value', label: 'Value', type: 'measure', required: true, multiple: true, description: 'Values corresponding to each indicator, e.g. [120, 200, 150]' },
            // 系列名称
            { key: 'name', label: 'Name', type: 'tag', required: false, description: 'Series name for the radar chart' },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 箱线图
    Boxplot: {
        mapping: [
            // 类目
            { key: 'category', label: 'Category', type: 'dimension', required: true },
            // 系列
            { key: 'series', label: 'Series', type: 'tag', required: false, description: 'Optional series name for the boxplot' },
            // 值列(自动计算Min、Q1、Q2、Q3、Max)
            { key: 'value', label: 'Value', type: 'measure', required: false, multiple: false, description: 'This field will be automatically used to calculate the boxplot statistics' },
            // 最小值、Q1、Q2（中位数）、Q3、最大值
            { key: 'min', label: 'Min', type: 'measure', required: false },
            { key: 'q1', label: 'Q1', type: 'measure', required: false },
            { key: 'median', label: 'Median', type: 'measure', required: false },
            { key: 'q3', label: 'Q3', type: 'measure', required: false },
            { key: 'max', label: 'Max', type: 'measure', required: false },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 热力图
    Heatmap: {
        mapping: [
            // X轴维度
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true },
            // Y轴维度
            { key: 'yAxis', label: 'Y Axis', type: 'dimension', required: true },
            // 值
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
            // 热力图单元格中的标签显示
            { key: 'label', label: 'Label', type: 'boolean', required: false, default: true, description: 'Whether to show labels on heatmap cells' },
            // 热力图单元格标签内容：默认显示value
            { key: 'labelFormatter', label: 'Label Formatter', type: 'text', required: false, default: '{c}', description: 'Custom label format, e.g. "{b}: {c}"' },
        ]
    },
    // 关系图
    Graph: {
        mapping: [
            // 节点ID
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true, description: 'Unique identifier for each node' },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false, description: 'Optional name for each node, used for display' },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: false, description: 'Optional value for each node, used for size or color' },
            // 节点分组
            { key: 'nodeCategory', label: 'Node Category', type: 'dimension', required: false, description: 'Optional category for each node, used for grouping' },
            // 边起点
            { key: 'edgeSource', label: 'Edge Source', type: 'dimension', required: true, description: 'Source node ID for the edge' },
            // 边终点
            { key: 'edgeTarget', label: 'Edge Target', type: 'dimension', required: true, description: 'Target node ID for the edge' },
            // 边权重
            { key: 'edgeWeight', label: 'Edge Weight', type: 'measure', required: false, description: 'Weight of the edge, used for size or color' },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 树图
    Tree: {
        mapping: [
            // 平铺模式
            // 节点ID
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false },
            // 父节点ID
            { key: 'parentID', label: 'Parent ID', type: 'dimension', required: true },
            // 父节点名称
            { key: 'parentName', label: 'Parent Name', type: 'tag', required: false },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 矩形树图
    Treemap: {
        mapping: [
            // 节点ID
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false },
            // 父节点ID
            { key: 'parentID', label: 'Parent ID', type: 'dimension', required: true },
            // 父节点名称
            { key: 'parentName', label: 'Parent Name', type: 'tag', required: false },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 旭日图
    Sunburst: {
        mapping: [
            // 节点ID
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false },
            // 父节点ID
            { key: 'parentID', label: 'Parent ID', type: 'dimension', required: true },
            // 父节点名称
            { key: 'parentName', label: 'Parent Name', type: 'tag', required: false },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: false },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 平行坐标系图
    Parallel: {
        mapping: [
            // 维度
            { key: 'dimensions', label: 'Dimensions (multiple)', type: 'dimension & measure', required: true, multiple: true },
            // 系列名称
            { key: 'nameField', label: 'Series', type: 'tag', required: false },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 桑基图
    Sankey: {
        mapping: [
            // 源节点
            { key: 'source', label: 'Source', type: 'dimension', required: true },
            // 目标节点
            { key: 'target', label: 'Target', type: 'dimension', required: true },
            // 流量/权重
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 漏斗图
    Funnel: {
        mapping: [
            // 阶段名称
            { key: 'stage', label: 'Stage', type: 'dimension', required: true },
            // 阶段值
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        basic: [
            { key: 'sort', label: 'Sort', type: 'select', options: [{ label: 'Descending', value: 'desc' }, { label: 'Ascending', value: 'asc' }] },
        ],
        advanced: [
        ]
    },
    // 仪表盘
    Gauge: {
        mapping: [
            // 指标名称
            { key: 'name', label: 'Name', type: 'dimension', required: false, description: 'Only one name is allowed' },
            // 指标值
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Only one value is allowed' },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 象形柱图
    PictorialBar: {
        mapping: [
            // 类别轴字段
            { key: 'category', label: 'Category', type: 'dimension', required: true },
            // 值轴字段
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
            // 图形符号（可选）
            { key: 'symbol', label: 'Symbol', type: 'select', required: false, options: [{ label: 'Circle', value: 'circle' }, { label: 'Rect', value: 'rect' }, { label: 'Image', value: 'image' }], default: 'circle' },
        ]
    },
    // 主题河流图
    ThemeRiver: {
        mapping: [
            // 时间字段
            { key: 'date', label: 'Date', type: 'dimension', required: true },
            // 类别字段
            { key: 'category', label: 'Category', type: 'dimension', required: false },
            // 值字段
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // 日历图
    Calendar: {
        mapping: [
            // 日期字段
            { key: 'date', label: 'Date', type: 'dimension', required: true },
            // 数值字段
            { key: 'value', label: 'Value', type: 'measure', required: true },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // ... 其他图表类型可继续扩展
}
