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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // y轴刻度最大/小值/间隔
            { key: 'yAxisMin', label: 'Y Axis Min', type: 'number', min: 0, placeholder: 'Min Value' },
            { key: 'yAxisMax', label: 'Y Axis Max', type: 'number', min: 0, placeholder: 'Max Value' },
            { key: 'yAxisInterval', label: 'Y Axis Interval', type: 'number', min: 1, placeholder: 'Interval' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
            // 显示最大最小值
            { key: 'showMaxMin', label: 'Show Max/Min', type: 'checkbox', description: 'Whether to show maximum and minimum values on the line chart' },
            // 均值线开关
            { key: 'showMeanLine', label: 'Show Mean Line', type: 'checkbox', description: 'Whether to show the mean line on the chart' },
            // 折线平滑
            { key: 'isSmooth', label: 'Smooth', type: 'checkbox', description: 'Whether to smooth the line' },
            // 对数尺度
            { key: 'isLogScale', label: 'Log Scale', type: 'checkbox', description: 'Whether to use logarithmic scale for the Y axis' },
            // 折线颜色渐变
            { key: 'lineGradient', label: '[Line] Gradient', type: 'checkbox', description: 'Whether to use gradient color for the line' },
            // 极坐标开关
            { key: 'isPolar', label: 'Polar Coordinate', type: 'checkbox', description: 'Whether to use polar coordinates for the line chart' },
            // 面积图模式开关
            { key: 'isArea', label: 'Area Chart', type: 'checkbox', description: 'Whether to display as an area chart' },
            // 面积图堆叠
            { key: 'isStack', label: '[Area] Stacked Area', type: 'checkbox', description: 'Whether to stack area charts' },
            // 面积图颜色渐变
            { key: 'areaGradient', label: '[Area] Gradient', type: 'checkbox', description: 'Whether to use gradient color for the area chart' },
            //todo 凹凸图模式开关(future)
            // { key: 'isBumpChart', label: 'Bump Chart', type: 'checkbox', description: 'Whether to use Bump Chart' },
            // 阶梯折线图模式开关
            { key: 'isStep', label: 'Step Line', type: 'checkbox', description: 'Whether to display as a step line chart' },
            //todo 折线样式和数据点样式(future)
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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // y轴刻度最大/小值/间隔
            { key: 'yAxisMin', label: 'Y Axis Min', type: 'number', min: 0, placeholder: 'Min Value' },
            { key: 'yAxisMax', label: 'Y Axis Max', type: 'number', min: 0, placeholder: 'Max Value' },
            { key: 'yAxisInterval', label: 'Y Axis Interval', type: 'number', min: 1, placeholder: 'Interval' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
            // 柱状图平行/竖直显示
            { key: 'isHorizontal', label: 'Horizontal Bars', type: 'checkbox', description: 'Whether to display bars horizontally' },
            // 显示最大最小值
            { key: 'showMaxMin', label: 'Show Max/Min', type: 'checkbox', description: 'Whether to show maximum and minimum values on the line chart' },
            // 均值线开关
            { key: 'showMeanLine', label: 'Show Mean Line', type: 'checkbox', description: 'Whether to show the mean line on the chart' },
            // 对数尺度
            { key: 'isLogScale', label: 'Log Scale', type: 'checkbox', description: 'Whether to use logarithmic scale for the Y axis' },
            // 柱体背景色
            { key: 'barBackgroundColor', label: 'Bar Background Color', type: 'text', placeholder: 'Hex Color, eg. #fff', description: 'Background color of the bar chart' },
            // 柱状图渐变
            { key: 'barGradient', label: 'Bar Gradient', type: 'checkbox', description: 'Whether to use gradient color for the bar chart' },
            // 柱体堆叠
            { key: 'isStack', label: 'Stacked Bar', type: 'checkbox', description: 'Whether to stack bar charts' },
            // 柱体堆叠归一化
            { key: 'isNormalized', label: 'Normalized Stacked Bar', type: 'checkbox', description: 'Whether to normalize stacked bar charts' },
            // 极坐标(None, radial, tangential)
            { key: 'polarStyle', label: 'Polar Coordinate Style', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Radial', value: 'radial' }, { label: 'Tangential', value: 'tangential' }], description: 'Whether to use polar coordinates for the line chart' },
            // 极坐标startAngle
            { key: 'startAngle', label: '[Polar]Start Angle', type: 'number', min: 0, max: 360, description: 'Starting angle for the polar bar chart, default is 0' },
            // 极坐标endAngle
            { key: 'endAngle', label: '[Polar]End Angle', type: 'number', min: 0, max: 360, description: 'Ending angle for the polar bar chart, default is 360' },

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
            // 圆角
            { key: 'pieBorderRadius', label: 'Border Radius', type: 'number', min: 0 },
            // 扇区间隙
            { key: 'pieBorderWidth', label: 'Border Width', type: 'number', min: 0 },
            // 扇区边框颜色
            { key: 'pieBorderColor', label: 'Border Color', type: 'text', placeholder: 'Hex Color, eg. #fff', description: 'Color of the pie sector border' },
            // 内/外半径
            { key: 'innerRadius', label: 'Inner Radius', type: 'number', min: 0, description: 'Inner radius of the pie chart, can be percentage or pixel value' },
            { key: 'outerRadius', label: 'Outer Radius', type: 'number', min: 0, description: 'Outer radius of the pie chart, can be percentage or pixel value' },
            // 扇区选中偏移量
            { key: 'selectedOffset', label: 'Selected Offset', type: 'number', min: 0, description: 'Offset distance when a sector is selected' },
            // 饼图引导线
            { key: 'labelLineVisible', label: 'Label Line Visible', type: 'checkbox', description: 'Whether to show label lines for pie sectors' },
            { key: 'labelLineLength', label: 'Label Line Length', type: 'number', min: 0, description: 'Length of the label line for pie sectors' }, // 第一段引导线长度
            { key: 'labelLineLength2', label: 'Label Line Length 2', type: 'number', min: 0, description: 'Length of the second segment of the label line for pie sectors' }, // 第二段引导线长度
            { key: 'labelLineSmooth', label: 'Label Line Smooth', type: 'number', min: 0, max: 1, description: 'Whether to smooth the label line for pie sectors' }, // 是否平滑
            { key: 'labelLineColor', label: 'Label Line Color', type: 'text', placeholder: 'Hex Color, eg. #fff', description: 'Color of the label line for pie sectors' },
            { key: 'labelLineWidth', label: 'Label Line Width', type: 'number', min: 0, description: 'Width of the label line for pie sectors' }, // 引导线宽度
            { key: 'labelLineType', label: 'Label Line Type', type: 'select', options: [{ label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }, { label: 'Dotted', value: 'dotted' }] }, // 引导线类型
            //todo 饼图纹理(future)
            // 南丁格尔玫瑰图开关
            { key: 'roseType', label: 'Rose Type', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'Radius Mode', value: 'radius' }, { label: 'Area Mode', value: 'area' }] }, // radius->数值越大，半径越粗，面积呈二次方放大（视觉冲击强）, area->数值越大，面积越大，半径按平方根增长（更精确感知比例）
            // 半环形图开关
            { key: 'isHalfDonut', label: 'Half Donut', type: 'checkbox', description: 'Whether to display as a half donut chart' },
            { key: 'startAngle', label: 'Start Angle', type: 'number', min: 0, max: 360, description: 'Starting angle for the pie chart, default is 0' },
            { key: 'endAngle', label: 'End Angle', type: 'number', min: 0, max: 360, description: 'Ending angle for the pie chart, default is 360' },
            //todo 嵌套环形图开关(future)
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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // y轴刻度最大/小值/间隔
            { key: 'yAxisMin', label: 'Y Axis Min', type: 'number', min: 0, placeholder: 'Min Value' },
            { key: 'yAxisMax', label: 'Y Axis Max', type: 'number', min: 0, placeholder: 'Max Value' },
            { key: 'yAxisInterval', label: 'Y Axis Interval', type: 'number', min: 1, placeholder: 'Interval' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
            // 系列最大/小值
            { key: 'showMaxMin', label: 'Show Max/Min', type: 'checkbox', description: 'Whether to show maximum and minimum values on the scatter chart' },
            // 均值线
            { key: 'showMeanLine', label: 'Show Mean Line', type: 'checkbox', description: 'Whether to show the mean line on the chart' },
            // 拟合回归线
            { key: 'trendLine', label: 'Trend Line', type: 'select', options: [{ label: 'None', value: '' }, { label: 'Linear', value: 'linear' }, { label: 'Polynomial', value: 'polynomial' }, { label: 'Exponential', value: 'exponential' }] },
            // 多项式回归阶数
            { key: 'polynomialOrder', label: 'Polynomial Order', type: 'number', min: 1, description: 'Order of polynomial regression, default is 3' },
            // 回归线标签是否可见
            { key: 'trendLineLabelHidden', label: 'Trend Line Label Hidden', type: 'checkbox', description: 'Whether to show the trend line label' },
            // 回归线标签字体样式
            { key: 'trendLineFontStyle', label: 'Trend Line Font Style', type: 'select', options: [{ label: 'Normal', value: 'normal' }, { label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }] },
            // 回归线标签字体大小
            { key: 'trendLineFontSize', label: 'Trend Line Font Size', type: 'number', min: 0, max: 40, description: 'Font size of the trend line label' },
            // 回归线颜色
            { key: 'trendLineColor', label: 'Trend Line Color', type: 'text', placeholder: 'Hex Color, eg. #fff', description: 'Color of the trend line' },
            // 回归线宽度
            { key: 'trendLineWidth', label: 'Trend Line Width', type: 'number', min: 0, description: 'Width of the trend line' },
            // 回归线样式
            { key: 'trendLineStyle', label: 'Trend Line Style', type: 'select', options: [{ label: 'Dashed', value: 'dashed' }, { label: 'Solid', value: 'solid' }, { label: 'Dotted', value: 'dotted' }] },
            // 单轴模式
            { key: 'singleAxisMode', label: 'Single Axis Mode', type: 'select', options: [{ label: 'None', value: '' }, { label: 'X Axis', value: 'x' }, { label: 'Y Axis', value: 'y' }] },
            // 散点图标签顶部/右侧
            { key: 'labelAlign', label: 'Label', type: 'select', options: [{ label: 'None', value: '' }, { label: 'Right', value: 'right' }, { label: 'Inside', value: 'inside' }] },
            //todo 视觉映射(todo)
            // 大小映射
            { key: 'sizeMapping', label: 'Size Mapping', type: 'checkbox', description: 'Whether to enable size mapping for the scatter chart' },
            // 大小映射最小点大小/最大点大小
            { key: 'sizeMin', label: 'Size Min', type: 'number', min: 0, description: 'Minimum size for scatter points' },
            { key: 'sizeMax', label: 'Size Max', type: 'number', min: 0, description: 'Maximum size for scatter points' },
            // 涟漪图
            { key: 'rippleEffect', label: 'Ripple Effect', type: 'checkbox', description: 'Whether to enable ripple effect for the scatter chart' },
            // 极坐标(None, radial, tangential)
            { key: 'polarStyle', label: 'Polar Coordinate Style', type: 'select', options: [{ label: 'None', value: '' }, { label: 'Radial', value: 'radial' }, { label: 'Tangential', value: 'tangential' }] }, // 极坐标样式
            // 极坐标startAngle
            { key: 'startAngle', label: '[Polar]Start Angle', type: 'number', min: 0, max: 360, description: 'Starting angle for the polar scatter chart, default is 0' },
            // 极坐标endAngle
            { key: 'endAngle', label: '[Polar]End Angle', type: 'number', min: 0, max: 360, description: 'Ending angle for the polar scatter chart, default is 360' },
            //todo 散点分系列样式(future)
        ]
    },
    // 地图
    Geo_Map: {
        mapping: [
            // 地区名字
            { key: 'nameField', label: 'Field Name', type: 'dimension', required: true, description: 'Field containing region names or point names.' },
            // 经纬度坐标及其坐标点名称
            { key: 'lngField', label: 'Longitude', type: 'dimension', required: true, description: 'Longitude & Latitude field, for point-based geo data.' },
            { key: 'latField', label: 'Latitude', type: 'dimension', required: true },
            { key: 'name', label: 'Location Name', type: 'tag', required: false, description: 'Optional name field for points, if not using region names.' },
            // 值
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Value for each region or point (e.g., population, sales).' },
            // 分类字段
            { key: 'categoryField', label: 'Category Field', type: 'dimension', required: true, description: 'Field used to categorize the data points.' },
            // lines 专用字段
            { key: 'fromLngField', label: 'From Longitude', type: 'dimension', required: false, description: 'Start point longitude for lines.' },
            { key: 'fromLatField', label: 'From Latitude', type: 'dimension', required: false, description: 'Start point latitude for lines.' },
            { key: 'toLngField', label: 'To Longitude', type: 'dimension', required: false, description: 'End point longitude for lines.' },
            { key: 'toLatField', label: 'To Latitude', type: 'dimension', required: false, description: 'End point latitude for lines.' },
            { key: 'fromName', label: 'From Name', type: 'tag', required: false, description: 'Start point name for lines.' },
            { key: 'toName', label: 'To Name', type: 'tag', required: false, description: 'End point name for lines.' },
        ],
        basic: [
            // 地图系列类型
            { key: 'seriesType', label: 'Series Type', type: 'select', required: true, options: [{ label: 'Map', value: 'map' }, { label: 'Heatmap', value: 'heatmap' }, { label: 'Scatter', value: 'scatter' }, { label: 'Pie', value: 'pie' }] },
            // , { label: 'Bar', value: 'bar' }, { label: 'Lines', value: 'lines' }
            // 地图类型选择
            { key: 'mapType', label: 'Map Name', type: 'select', required: true, options: [{ label: 'China', value: 'china' }, { label: 'World', value: 'world' }, { label: 'Custom', value: 'custom' }] },
            // 地图数据源名称（支持中英文）
            { key: 'mapSourceName', label: 'Map Resource', type: 'text', placeholder: "Enter map resource name" },
            //todo 外部地图JSON数据URL(future plan)
            // { key: 'mapSourceUrl', label: 'GeoJSON URL', type: 'text', placeholder: "Enter GeoJSON URL", description: 'URL for external GeoJSON data, e.g., https://example.com/map.json' }, // https://datav.aliyun.com/portal/school/atlas/area_selector
        ],
        advanced: [
            // 是否可拖拽和缩放
            { key: 'isRoam', label: 'Roam', type: 'checkbox', description: 'Whether the map is draggable and zoomable' },
            // 通用配置项
            { key: 'areaColor', label: 'Area Color', type: 'text', description: 'Background color of map areas', placeholder: '#f3f3f3' },
            { key: 'borderColor', label: 'Border Color', type: 'text', description: 'Border color of map areas', placeholder: '#999' },
            { key: 'borderWidth', label: 'Border Width', type: 'number', min: 0, max: 10, description: 'Width of area borders' },
            { key: 'isDiscrete', label: 'Discrete Legend', type: 'checkbox', description: 'Use discrete color mapping instead of continuous', condition: { seriesType: ['map'] } },

            // 热力地图特有配置
            { key: 'pointSize', label: 'Point Size', type: 'number', min: 5, max: 100, description: 'Size of scatter points (heatmap type only)', condition: { seriesType: 'heatmap' } },
            { key: 'blurSize', label: 'Blur Size', type: 'number', min: 5, max: 50, description: 'Blur radius for points (heatmap)', condition: { seriesType: 'heatmap' } },

            // 散点图特有配置
            { key: 'sizeMapping', label: 'Size Mapping', type: 'checkbox', description: 'Map point size to data values', condition: { seriesType: 'scatter' } },
            { key: 'sizeMin', label: 'Min Size', type: 'number', min: 1, max: 999, description: 'Minimum point size when size mapping enabled', condition: { seriesType: 'scatter', sizeMapping: true } },
            { key: 'sizeMax', label: 'Max Size', type: 'number', min: 1, max: 999, description: 'Maximum point size when size mapping enabled', condition: { seriesType: 'scatter', sizeMapping: true } },
            { key: 'rippleEffect', label: 'Ripple Effect', type: 'checkbox', description: 'Enable ripple animation (scatter type only)', condition: { seriesType: 'scatter' } },

            // 饼图特有配置
            { key: 'pieRadius', label: 'Pie Radius', type: 'number', min: 10, max: 100, description: 'Radius of pie charts', condition: { seriesType: 'pie' } },
            { key: 'selectedOffset', label: 'Selected Offset', type: 'number', min: 0, max: 50, description: 'Offset when pie sector is selected', condition: { seriesType: 'pie' } },
            {
                key: 'roseType', label: 'Rose Type', type: 'select', options: [
                    { label: 'None', value: '' },
                    { label: 'Radius', value: 'radius' },
                    { label: 'Area', value: 'area' }
                ], description: 'Nightingale rose chart type', condition: { seriesType: 'pie' }
            },
            { key: 'pieBorderRadius', label: 'Pie Border Radius', type: 'number', min: 0, max: 20, description: 'Border radius of pie sectors', condition: { seriesType: 'pie' } },
            { key: 'pieBorderWidth', label: 'Pie Border Width', type: 'number', min: 0, max: 5, description: 'Border width of pie sectors', condition: { seriesType: 'pie' } },
            { key: 'pieBorderColor', label: 'Pie Border Color', type: 'text', description: 'Border color of pie sectors', placeholder: '#fff', condition: { seriesType: 'pie' } },
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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
            // MA5
            { key: 'ma5', label: 'MA5', type: 'checkbox', description: 'Whether to show the 5-day moving average line' },
            // MA10
            { key: 'ma10', label: 'MA10', type: 'checkbox', description: 'Whether to show the 10-day moving average line' },
            // MA20
            { key: 'ma20', label: 'MA20', type: 'checkbox', description: 'Whether to show the 20-day moving average line' },
            // MA30
            { key: 'ma30', label: 'MA30', type: 'checkbox', description: 'Whether to show the 30-day moving average line' },
            // 最大/最小值标记
            { key: 'showMaxMin', label: 'Show Max/Min', type: 'checkbox', description: 'Whether to show maximum and minimum values on the radar chart' },
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
            { key: 'name', label: 'Series Name', type: 'tag', required: true, description: 'Series name for the radar chart' },
        ],
        basic: [
        ],
        advanced: [
            // 雷达图形状
            { key: 'radarShape', label: 'Radar Shape', type: 'select', required: false, options: [{ label: 'Polygon', value: '' }, { label: 'Circle', value: 'circle' }] },
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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
            // 热力图单元格中的标签显示
            { key: 'isLabelVisible', label: 'Ceils\' Label', type: 'checkbox', description: 'Whether to show labels on heatmap cells' },
            // 热力图离散映射开关
            { key: 'isDiscrete', label: 'Discrete Mapping', type: 'checkbox', description: 'Whether to use discrete color mapping for heatmap ( Default: visualMap )' },
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
            // 是否可拖拽和缩放
            { key: 'isRoam', label: 'Roam', type: 'checkbox', description: 'Whether the graph is draggable and zoomable' },
            // 布局设置
            { key: 'layout', label: 'Layout', type: 'select', options: [{ label: 'Circular', value: 'circular' }, { label: 'Force', value: 'force' }] },
            // 力引导布局的配置
            // 节点间斥力
            { key: 'forceRepulsion', label: '[Force] Repulsion', type: 'number', min: 0, description: 'Repulsion force for the force layout' },
            // 理想边长
            { key: 'forceEdgeLength', label: '[Force] Edge Length', type: 'number', min: 0, description: 'Ideal edge length for the force layout' },
            // 节点受到中心引力因子
            { key: 'forceGravity', label: '[Force] Gravity', type: 'number', min: 0, description: 'Gravity factor for the force layout' },
            // 防止重叠
            { key: 'forcePreventOverlap', label: '[Force] Prevent Overlap', type: 'checkbox', description: 'Whether to prevent node overlap in the force layout' },
            // 动画布局
            { key: 'forceLayoutAnimation', label: '[Force] Layout Animation', type: 'checkbox', description: 'Whether to enable animation for the force layout' },
            // 节点大小配置
            { key: 'minNodeSize', label: 'Min Node Size', type: 'number', min: 1, max: 100, description: 'Minimum size of nodes' },
            { key: 'maxNodeSize', label: 'Max Node Size', type: 'number', min: 1, max: 100, description: 'Maximum size of nodes' },
            // 边宽度配置
            { key: 'isSizedEdges', label: 'Sized Edges', type: 'checkbox', description: 'Whether to automatically size edges based on weight' },
            { key: 'minEdgeWidth', label: 'Min Edge Width', type: 'number', min: 0.1, max: 10, description: 'Minimum width of edges' },
            { key: 'maxEdgeWidth', label: 'Max Edge Width', type: 'number', min: 0.1, max: 10, description: 'Maximum width of edges' },
            // 边弧度
            { key: 'curveness', label: 'Edge Curveness', type: 'number', min: 0, max: 1, description: 'Curveness of edges' },
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
            // 是否可拖拽和缩放
            { key: 'isRoam', label: 'Roam', type: 'checkbox', description: 'Whether the tree is draggable and zoomable' },
            // 树状图朝向
            { key: 'orient', label: 'Orientation', type: 'select', options: [{ label: 'Left to Right', value: 'LR' }, { label: 'Right to Left', value: 'RL' }, { label: 'Top to Bottom', value: 'TB' }, { label: 'Bottom to Top', value: 'BT' }] },
            // 树状图显示样式
            { key: 'layout', label: 'Layout', type: 'select', options: [{ label: 'Orthogonal', value: 'orthogonal' }, { label: 'Radial', value: 'radial' }] },
            // 树状图多树排列形式
            { key: 'position_tree', label: 'Multiple Trees Position', type: 'select', options: [{ label: 'Left and Right', value: 'left and right' }, { label: 'Top and Bottom', value: 'top and bottom' }] },
            // 默认展开层级
            { key: 'initialTreeDepth', label: 'Initial Depth', type: 'number', min: 1, description: 'Initial depth of the tree to display' },
            // 连线形状
            { key: 'edgeShape', label: 'Edge Shape', type: 'select', options: [{ label: 'Polyline', value: 'polyline' }, { label: 'Curve', value: 'curve' }] },
            // 连线分叉位置
            { key: 'edgeForkPosition', label: 'Edge Fork Position', type: 'number', min: 0, max: 1, description: 'Position of edge forks' },
            // 节点原点半径
            { key: 'symbolSize', label: 'Node Size', type: 'number', min: 1, max: 100, description: 'Size of the tree nodes' },
            // 线宽
            { key: 'width', label: 'Line Width', type: 'number', min: 1, description: 'Width of the connecting lines' },
            // 曲线度
            { key: 'curveness', label: 'Curveness', type: 'number', min: 0, max: 1, description: 'Curveness of the connecting lines' },
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
            // 排序
            { key: 'sort', label: 'Sort', type: 'select', options: [{ label: 'Descending', value: 'desc' }, { label: 'Ascending', value: 'asc' }] },
            // 最小可见面积
            { key: 'visibleMin', label: 'Visible Min Area', type: 'number', min: 0, description: 'Minimum area for a node to be visible, eg. 300' },
            // 叶子节点的深度(控制最大显示层级)
            { key: 'leafDepth', label: 'Leaf Depth', type: 'number', min: 1, description: 'Maximum depth of leaf nodes to display' },
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
            // 排序
            { key: 'sort', label: 'Sort', type: 'select', options: [{ label: 'Descending', value: 'desc' }, { label: 'Ascending', value: 'asc' }] },
            // 最小显示标签角度
            { key: 'minAngle', label: 'Min Angle', type: 'number', min: 0, max: 180, description: 'Minimum angle for labels to be displayed' },
            // 区块圆角
            { key: 'borderRadius', label: 'Border Radius', type: 'number', min: 0, max: 50, description: 'Radius of the corners of the sunburst blocks' },
            // 边框宽度
            { key: 'borderWidth', label: 'Border Width', type: 'number', min: 0, max: 10, description: 'Width of the border around each sunburst block' },
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
            // 图例显示方式( VisualMap or Legend )
            { key: 'legendType', label: 'Legend Type', type: 'select', options: [{ label: 'VisualMap', value: 'visualMap' }, { label: 'Legend', value: 'legend' }] },
            // 是否显示Category维度
            { key: 'isCategoryDim', label: 'Show Category Dimension', type: 'checkbox', description: 'Whether to add a category dimension to the parallel chart' },
            // Category维度位置
            { key: 'positionCategoryDim', label: 'Category Dimension Position', type: 'select', options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
            // 线条宽度
            { key: 'lineWidth', label: 'Line Width', type: 'number', min: 1, max: 100 },
            // 是否平滑
            { key: 'isSmooth', label: 'Smooth Lines', type: 'checkbox', description: 'Whether to use smooth lines for the parallel chart' },
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
            // 图表布局
            { key: 'orient', label: 'Layout Orientation', type: 'select', options: [{ label: 'Horizontal', value: 'horizontal' }, { label: 'Vertical', value: 'vertical' }] },
            // 连接是否为渐变色
            { key: 'isGradient', label: 'Link Gradient', type: 'checkbox', description: 'Whether to use gradient color for links' },
            // 连接透明度
            { key: 'lineOpacity', label: 'Link Opacity', type: 'number', min: 0, max: 1 },
            // 连接曲度
            { key: 'lineCurveness', label: 'Link Curveness', type: 'number', min: 0, max: 1 },
            // 标签位置
            { key: 'labelPosition', label: 'Label Position', type: 'select', options: [{ label: 'Inside', value: 'inside' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
            // 左/右对齐布局
            { key: 'nodeAlign', label: 'Node Alignment', type: 'select', options: [{ label: 'Justify', value: 'justify' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
        ]
    },
    // 漏斗图
    Funnel: {
        mapping: [
            // 阶段名称
            { key: 'stage', label: 'Stage', type: 'dimension', required: true, description: 'The name of the stage in the funnel' },
            // 阶段值
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'The value of the stage in the funnel' },
        ],
        basic: [
        ],
        advanced: [
            // 排序
            { key: 'sort', label: 'Sort', type: 'select', options: [{ label: 'Descending', value: 'descending' }, { label: 'Ascending', value: 'ascending' }] },
            // 标签位置
            { key: 'labelPosition', label: 'Label Position', type: 'select', options: [{ label: 'Inside', value: 'inside' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
            // 标签字体大小
            { key: 'labelFontSize', label: 'Label Font Size', type: 'number', min: 8, max: 24 },
            // 标签字体粗细
            { key: 'labelFontWeight', label: 'Label Font Weight', type: 'select', options: [{ label: 'Normal', value: 'normal' }, { label: 'Bold', value: 'bold' }, { label: 'Lighter', value: 'lighter' }] },
            // 标签引导线长度
            { key: 'labelLineLength', label: 'Label Line Length', type: 'number', min: 0, max: 100 },
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
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name' },
            // 网格线(x, y, x&y, none)显示
            { key: 'gridVisible', label: 'Grid', type: 'select', required: false, options: [{ label: 'None', value: '' }, { label: 'X', value: 'x' }, { label: 'Y', value: 'y' }, { label: 'X & Y', value: 'both' }] },
            // 图形符号（可选）
            { key: 'symbol', label: 'Symbol', type: 'select', options: [{ label: 'Circle', value: 'circle' }, { label: 'Rect', value: 'rect' }, { label: 'Image', value: 'image' }] },
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
            { key: 'value', label: 'Value', type: 'measure', required: false },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // ... 其他图表类型可继续扩展
}
