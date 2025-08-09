// ChartTypeConfig.js
// 图表类型的动态配置项描述，便于模块化和可扩展
// 包含数据映射配置项和高级配置项

/* eslint-disable */
export const chartTypeConfig = {
    // 折线图
    Line: {
        mapping: [
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true, description: 'Field for X axis, typically time, category, or numerical values.' },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true, description: 'Field for Y axis, typically a numerical value.' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // y轴刻度最大/小值/间隔
            { key: 'yAxisMin', label: 'Y Axis Min', type: 'number', min: 0, placeholder: 'Min Value', description: 'Minimum value for the Y axis' },
            { key: 'yAxisMax', label: 'Y Axis Max', type: 'number', min: 0, placeholder: 'Max Value', description: 'Maximum value for the Y axis' },
            { key: 'yAxisInterval', label: 'Y Axis Interval', type: 'number', min: 1, placeholder: 'Interval', description: 'Interval between Y axis ticks' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid' },
                    { key: 'x', content: 'Show only X axis grid lines' },
                    { key: 'y', content: 'Show only Y axis grid lines' },
                    { key: 'both', content: 'Show both X and Y axis grid lines' }
                ]
            },
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
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true, description: 'Field for X axis, typically a category, time or numerical data.' },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true, description: 'Field for Y axis, typically a numerical value.' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // y轴刻度最大/小值/间隔
            { key: 'yAxisMin', label: 'Y Axis Min', type: 'number', min: 0, placeholder: 'Min Value', description: 'Minimum value for the Y axis' },
            { key: 'yAxisMax', label: 'Y Axis Max', type: 'number', min: 0, placeholder: 'Max Value', description: 'Maximum value for the Y axis' },
            { key: 'yAxisInterval', label: 'Y Axis Interval', type: 'number', min: 1, placeholder: 'Interval', description: 'Interval between Y axis ticks' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid' },
                    { key: 'x', content: 'Show only X axis grid lines' },
                    { key: 'y', content: 'Show only Y axis grid lines' },
                    { key: 'both', content: 'Show both X and Y axis grid lines' }
                ]
            },
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
            {
                key: 'polarStyle',
                label: 'Polar Coordinate Style',
                type: 'select',
                options: [
                    { label: 'None', value: 'none' },
                    { label: 'Radial', value: 'radial' },
                    { label: 'Tangential', value: 'tangential' }
                ],
                description: 'Whether to use polar coordinates for the bar chart',
                tips: [
                    { key: 'none', content: 'Standard rectangular coordinate system' },
                    { key: 'radial', content: 'Bars are arranged radially from the center' },
                    { key: 'tangential', content: 'Bars are arranged tangentially around the circle' }
                ]
            },
            // 极坐标startAngle
            { key: 'startAngle', label: '[Polar]Start Angle', type: 'number', min: 0, max: 360, description: 'Starting angle for the polar bar chart, default is 0' },
            // 极坐标endAngle
            { key: 'endAngle', label: '[Polar]End Angle', type: 'number', min: 0, max: 360, description: 'Ending angle for the polar bar chart, default is 360' },

        ]
    },
    // 饼图
    Pie: {
        mapping: [
            { key: 'category', label: 'Category', type: 'dimension', required: true, description: 'Field for pie chart categories, typically a categorical or nominal data.' },
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Field for pie chart values, typically a numerical value.' },
        ],
        basic: [
        ],
        advanced: [
            // 圆角
            { key: 'pieBorderRadius', label: 'Border Radius', type: 'number', min: 0, description: 'Border radius of the pie chart' },
            // 扇区间隙
            { key: 'pieBorderWidth', label: 'Border Width', type: 'number', min: 0, description: 'Border width of the pie chart' },
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
            {
                key: 'labelLineType',
                label: 'Label Line Type',
                type: 'select',
                options: [
                    { label: 'Solid', value: 'solid' },
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Dotted', value: 'dotted' }
                ],
                tips: [
                    { key: 'solid', content: 'Solid line for label guide' },
                    { key: 'dashed', content: 'Dashed line for label guide' },
                    { key: 'dotted', content: 'Dotted line for label guide' }
                ]
            }, // 引导线类型
            //todo 饼图纹理(future)
            // 南丁格尔玫瑰图开关
            {
                key: 'roseType',
                label: 'Rose Type',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'Radius Mode', value: 'radius' },
                    { label: 'Area Mode', value: 'area' }
                ],
                description: 'Rose chart type selection',
                tips: [
                    { key: '', content: 'Standard pie chart' },
                    { key: 'radius', content: 'Sector radius is proportional to value (visual impact)' },
                    { key: 'area', content: 'Sector area is proportional to value (accurate proportion)' }
                ]
            }, // radius->数值越大，半径越粗，面积呈二次方放大（视觉冲击强）, area->数值越大，面积越大，半径按平方根增长（更精确感知比例）
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
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true, description: 'The dimension for the X axis' },
            { key: 'yAxis', label: 'Y Axis', type: 'measure', required: true, multiple: true, description: 'The measure for the Y axis' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // y轴刻度最大/小值/间隔
            { key: 'yAxisMin', label: 'Y Axis Min', type: 'number', min: 0, placeholder: 'Min Value', description: 'Minimum value for the Y axis' },
            { key: 'yAxisMax', label: 'Y Axis Max', type: 'number', min: 0, placeholder: 'Max Value', description: 'Maximum value for the Y axis' },
            { key: 'yAxisInterval', label: 'Y Axis Interval', type: 'number', min: 1, placeholder: 'Interval', description: 'Interval between Y axis ticks' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid' },
                    { key: 'x', content: 'Show only X axis grid lines' },
                    { key: 'y', content: 'Show only Y axis grid lines' },
                    { key: 'both', content: 'Show both X and Y axis grid lines' }
                ]
            },
            // 系列最大/小值
            { key: 'showMaxMin', label: 'Show Max/Min', type: 'checkbox', description: 'Whether to show maximum and minimum values on the scatter chart' },
            // 均值线
            { key: 'showMeanLine', label: 'Show Mean Line', type: 'checkbox', description: 'Whether to show the mean line on the chart' },
            // 拟合回归线
            {
                key: 'trendLine',
                label: 'Trend Line',
                type: 'select',
                options: [
                    { label: 'None', value: '' },
                    { label: 'Linear', value: 'linear' },
                    { label: 'Polynomial', value: 'polynomial' },
                    { label: 'Exponential', value: 'exponential' }
                ],
                description: 'Type of trend line to fit on the scatter chart',
                tips: [
                    { key: '', content: 'No trend line' },
                    { key: 'linear', content: 'Fit a linear regression line' },
                    { key: 'polynomial', content: 'Fit a polynomial regression line' },
                    { key: 'exponential', content: 'Fit an exponential regression line' }
                ]
            },
            // 多项式回归阶数
            { key: 'polynomialOrder', label: 'Polynomial Order', type: 'number', min: 1, description: 'Order of polynomial regression, default is 3' },
            // 回归线标签是否可见
            { key: 'trendLineLabelHidden', label: 'Trend Line Label Hidden', type: 'checkbox', description: 'Whether to show the trend line label' },
            // 回归线标签字体样式
            {
                key: 'trendLineFontStyle',
                label: 'Trend Line Font Style',
                type: 'select',
                options: [
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Italic', value: 'italic' }
                ],
                description: 'Font style of the trend line label',
                tips: [
                    { key: 'normal', content: 'Normal font style' },
                    { key: 'bold', content: 'Bold font style' },
                    { key: 'italic', content: 'Italic font style' }
                ]
            },
            // 回归线标签字体大小
            { key: 'trendLineFontSize', label: 'Trend Line Font Size', type: 'number', min: 0, max: 40, description: 'Font size of the trend line label' },
            // 回归线颜色
            { key: 'trendLineColor', label: 'Trend Line Color', type: 'text', placeholder: 'Hex Color, eg. #fff', description: 'Color of the trend line' },
            // 回归线宽度
            { key: 'trendLineWidth', label: 'Trend Line Width', type: 'number', min: 0, description: 'Width of the trend line' },
            // 回归线样式
            {
                key: 'trendLineStyle',
                label: 'Trend Line Style',
                type: 'select',
                options: [
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Solid', value: 'solid' },
                    { label: 'Dotted', value: 'dotted' }
                ],
                description: 'Style of the trend line',
                tips: [
                    { key: 'dashed', content: 'Dashed line' },
                    { key: 'solid', content: 'Solid line' },
                    { key: 'dotted', content: 'Dotted line' }
                ]
            },
            // 单轴模式
            {
                key: 'singleAxisMode',
                label: 'Single Axis Mode',
                type: 'select',
                options: [
                    { label: 'None', value: '' },
                    { label: 'X Axis', value: 'x' },
                    { label: 'Y Axis', value: 'y' }
                ],
                description: 'Whether to use single axis mode for the scatter chart',
                tips: [
                    { key: '', content: 'Standard two-axis scatter plot' },
                    { key: 'x', content: 'Single X axis mode' },
                    { key: 'y', content: 'Single Y axis mode' }
                ]
            },
            // 散点图标签顶部/右侧
            {
                key: 'labelAlign',
                label: 'Label',
                type: 'select',
                options: [
                    { label: 'None', value: '' },
                    { label: 'Right', value: 'right' },
                    { label: 'Inside', value: 'inside' }
                ],
                description: 'Label alignment for scatter points',
                tips: [
                    { key: '', content: 'No label' },
                    { key: 'right', content: 'Label on the right of the point' },
                    { key: 'inside', content: 'Label inside the point' }
                ]
            },
            //todo 视觉映射(todo)
            // 大小映射
            { key: 'sizeMapping', label: 'Size Mapping', type: 'checkbox', description: 'Whether to enable size mapping for the scatter chart' },
            // 大小映射最小点大小/最大点大小
            { key: 'sizeMin', label: 'Size Min', type: 'number', min: 0, description: 'Minimum size for scatter points' },
            { key: 'sizeMax', label: 'Size Max', type: 'number', min: 0, description: 'Maximum size for scatter points' },
            // 涟漪图
            { key: 'rippleEffect', label: 'Ripple Effect', type: 'checkbox', description: 'Whether to enable ripple effect for the scatter chart' },
            // 极坐标(None, radial, tangential)
            {
                key: 'polarStyle',
                label: 'Polar Coordinate Style',
                type: 'select',
                options: [
                    { label: 'None', value: '' },
                    { label: 'Radial', value: 'radial' },
                    { label: 'Tangential', value: 'tangential' }
                ],
                description: 'Polar coordinate style for the scatter chart',
                tips: [
                    { key: '', content: 'Standard rectangular coordinate system' },
                    { key: 'radial', content: 'Points are arranged radially from the center' },
                    { key: 'tangential', content: 'Points are arranged tangentially around the circle' }
                ]
            }, // 极坐标样式
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
            {
                key: 'seriesType',
                label: 'Series Type',
                type: 'select',
                required: true,
                options: [
                    { label: 'Map', value: 'map' },
                    { label: 'Heatmap', value: 'heatmap' },
                    { label: 'Scatter', value: 'scatter' },
                    { label: 'Pie', value: 'pie' }
                ],
                description: 'Type of map series to display',
                tips: [
                    { key: 'map', content: 'Choropleth map with area coloring based on data' },
                    { key: 'heatmap', content: 'Heat map overlay showing data density' },
                    { key: 'scatter', content: 'Scatter points on map with optional size mapping' },
                    { key: 'pie', content: 'Pie charts positioned on map locations' }
                ]
            },
            // , { label: 'Bar', value: 'bar' }, { label: 'Lines', value: 'lines' }
            // 地图类型选择
            {
                key: 'mapType',
                label: 'Map Name',
                type: 'select',
                required: true,
                options: [
                    { label: 'China', value: 'china' },
                    { label: 'World', value: 'world' },
                    { label: 'Custom', value: 'custom' }
                ],
                description: 'Type of map to display',
                tips: [
                    { key: 'china', content: 'China administrative map' },
                    { key: 'world', content: 'World countries map' },
                    { key: 'custom', content: 'Custom map resource' }
                ]
            },
            // 地图数据源名称（支持中英文）
            { key: 'mapSourceName', label: 'Map Resource', type: 'text', placeholder: "Enter map resource name", description: 'Name of the map resource, e.g., "Foshan", "佛山". (Uppercase and lowercase and Chinese are supported)' },
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
                key: 'roseType',
                label: 'Rose Type',
                type: 'select',
                options: [
                    { label: 'None', value: '' },
                    { label: 'Radius', value: 'radius' },
                    { label: 'Area', value: 'area' }
                ],
                description: 'Nightingale rose chart type',
                condition: { seriesType: 'pie' },
                tips: [
                    { key: '', content: 'Standard pie chart' },
                    { key: 'radius', content: 'Radius-based rose chart (visual impact)' },
                    { key: 'area', content: 'Area-based rose chart (accurate proportion)' }
                ]
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
            { key: 'time', label: 'Time', type: 'dimension', required: true, description: 'Time series for the Candlestick chart, typically a date or timestamp.' },
            // 开盘价、收盘价、最高价、最低价
            { key: 'open', label: 'Open', type: 'measure', required: true, description: 'Opening price for the Candlestick chart.' },
            { key: 'close', label: 'Close', type: 'measure', required: true, description: 'Closing price for the Candlestick chart.' },
            { key: 'high', label: 'High', type: 'measure', required: true, description: 'Highest price for the Candlestick chart.' },
            { key: 'low', label: 'Low', type: 'measure', required: true, description: 'Lowest price for the Candlestick chart.' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid' },
                    { key: 'x', content: 'Show only X axis grid lines' },
                    { key: 'y', content: 'Show only Y axis grid lines' },
                    { key: 'both', content: 'Show both X and Y axis grid lines' }
                ]
            },
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
            {
                key: 'radarShape',
                label: 'Radar Shape',
                type: 'select',
                required: false,
                options: [
                    { label: 'Polygon', value: '' },
                    { label: 'Circle', value: 'circle' }
                ],
                description: 'Shape of the radar chart, polygon or circle',
                tips: [
                    { key: '', content: 'Polygon-shaped radar chart' },
                    { key: 'circle', content: 'Circle-shaped radar chart' }
                ]
            },
        ]
    },
    // 箱线图
    Boxplot: {
        mapping: [
            // 类目
            { key: 'category', label: 'Category', type: 'dimension', required: true, description: 'Field for categories, typically a categorical or nominal data.' },
            // 系列
            { key: 'series', label: 'Series', type: 'tag', required: false, description: 'Optional series name for the boxplot' },
            // 值列(自动计算Min、Q1、Q2、Q3、Max)
            { key: 'value', label: 'Value', type: 'measure', required: false, multiple: false, description: 'This field will be automatically used to calculate the boxplot statistics' },
            // 最小值、Q1、Q2（中位数）、Q3、最大值
            { key: 'min', label: 'Min', type: 'measure', required: false, description: 'Minimum value for the boxplot' },
            { key: 'q1', label: 'Q1', type: 'measure', required: false, description: 'First quartile value for the boxplot' },
            { key: 'median', label: 'Median', type: 'measure', required: false, description: 'Median value for the boxplot' },
            { key: 'q3', label: 'Q3', type: 'measure', required: false, description: 'Third quartile value for the boxplot' },
            { key: 'max', label: 'Max', type: 'measure', required: false, description: 'Maximum value for the boxplot' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid' },
                    { key: 'x', content: 'Show only X axis grid lines' },
                    { key: 'y', content: 'Show only Y axis grid lines' },
                    { key: 'both', content: 'Show both X and Y axis grid lines' }
                ]
            },
        ]
    },
    // 热力图
    Heatmap: {
        mapping: [
            // X轴维度
            { key: 'xAxis', label: 'X Axis', type: 'dimension', required: true, description: 'The dimension for the X axis of the heatmap' },
            // Y轴维度
            { key: 'yAxis', label: 'Y Axis', type: 'dimension', required: true, description: 'The dimension for the Y axis of the heatmap' },
            // 值
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'The value for each cell in the heatmap' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid' },
                    { key: 'x', content: 'Show only X axis grid lines' },
                    { key: 'y', content: 'Show only Y axis grid lines' },
                    { key: 'both', content: 'Show both X and Y axis grid lines' }
                ]
            },
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
            {
                key: 'layout',
                label: 'Layout',
                type: 'select',
                options: [
                    { label: 'Circular', value: 'circular' },
                    { label: 'Force', value: 'force' }
                ],
                description: 'Layout type for the graph',
                tips: [
                    { key: 'circular', content: 'Arrange nodes in a circular pattern' },
                    { key: 'force', content: 'Use force-directed layout with physics simulation' }
                ]
            },
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
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true, description: 'Unique identifier for each node' },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false, description: 'Optional name for each node' },
            // 父节点ID
            { key: 'parentID', label: 'Parent ID', type: 'dimension', required: true, description: 'Parent node ID for each node' },
            // 父节点名称
            { key: 'parentName', label: 'Parent Name', type: 'tag', required: false, description: 'Optional name for parent node' },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: true, description: 'Value for each node' },
        ],
        basic: [
        ],
        advanced: [
            // 是否可拖拽和缩放
            { key: 'isRoam', label: 'Roam', type: 'checkbox', description: 'Whether the tree is draggable and zoomable' },
            // 树状图朝向
            {
                key: 'orient',
                label: 'Orientation',
                type: 'select',
                options: [
                    { label: 'Left to Right', value: 'LR' },
                    { label: 'Right to Left', value: 'RL' },
                    { label: 'Top to Bottom', value: 'TB' },
                    { label: 'Bottom to Top', value: 'BT' }
                ],
                description: 'Orientation of the tree layout',
                tips: [
                    { key: 'LR', content: 'Tree grows from left to right' },
                    { key: 'RL', content: 'Tree grows from right to left' },
                    { key: 'TB', content: 'Tree grows from top to bottom' },
                    { key: 'BT', content: 'Tree grows from bottom to top' }
                ]
            },
            // 树状图显示样式
            {
                key: 'layout',
                label: 'Layout',
                type: 'select',
                options: [
                    { label: 'Orthogonal', value: 'orthogonal' },
                    { label: 'Radial', value: 'radial' }
                ],
                description: 'Layout style for the tree',
                tips: [
                    { key: 'orthogonal', content: 'Traditional rectangular tree layout' },
                    { key: 'radial', content: 'Radial circular tree layout' }
                ]
            },
            // 树状图多树排列形式
            {
                key: 'position_tree',
                label: 'Multiple Trees Position',
                type: 'select',
                options: [
                    { label: 'Left and Right', value: 'left and right' },
                    { label: 'Top and Bottom', value: 'top and bottom' }
                ],
                description: 'Arrangement for multiple trees',
                tips: [
                    { key: 'left and right', content: 'Place multiple trees side by side' },
                    { key: 'top and bottom', content: 'Stack multiple trees vertically' }
                ]
            },
            // 默认展开层级
            { key: 'initialTreeDepth', label: 'Initial Depth', type: 'number', min: 1, description: 'Initial depth of the tree to display' },
            // 连线形状
            {
                key: 'edgeShape',
                label: 'Edge Shape',
                type: 'select',
                options: [
                    { label: 'Polyline', value: 'polyline' },
                    { label: 'Curve', value: 'curve' }
                ],
                description: 'Shape of the connecting lines',
                tips: [
                    { key: 'polyline', content: 'Straight lines with angles' },
                    { key: 'curve', content: 'Smooth curved lines' }
                ]
            },
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
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true, description: 'Unique identifier for each node' },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false, description: 'Optional name for each node' },
            // 父节点ID
            { key: 'parentID', label: 'Parent ID', type: 'dimension', required: true, description: 'Parent node ID for each node' },
            // 父节点名称
            { key: 'parentName', label: 'Parent Name', type: 'tag', required: false, description: 'Optional name for parent node' },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: true, description: 'Value for each node' },
        ],
        basic: [
        ],
        advanced: [
            // 排序
            {
                key: 'sort',
                label: 'Sort',
                type: 'select',
                options: [
                    { label: 'Descending', value: 'desc' },
                    { label: 'Ascending', value: 'asc' }
                ],
                description: 'Sort order for treemap nodes',
                tips: [
                    { key: 'desc', content: 'Sort nodes by value in descending order (largest first)' },
                    { key: 'asc', content: 'Sort nodes by value in ascending order (smallest first)' }
                ]
            },
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
            { key: 'nodeID', label: 'Node ID', type: 'dimension', required: true, description: 'Unique identifier for each node' },
            // 节点名称
            { key: 'nodeName', label: 'Node Name', type: 'tag', required: false, description: 'Optional name for each node' },
            // 父节点ID
            { key: 'parentID', label: 'Parent ID', type: 'dimension', required: true, description: 'Parent node ID for each node' },
            // 父节点名称
            { key: 'parentName', label: 'Parent Name', type: 'tag', required: false, description: 'Optional name for parent node' },
            // 节点数值
            { key: 'nodeValue', label: 'Node Value', type: 'measure', required: false, description: 'Value for each node' },
        ],
        basic: [
        ],
        advanced: [
            // 排序
            {
                key: 'sort',
                label: 'Sort',
                type: 'select',
                options: [
                    { label: 'Descending', value: 'desc' },
                    { label: 'Ascending', value: 'asc' }
                ],
                description: 'Sort order for sunburst nodes',
                tips: [
                    { key: 'desc', content: 'Sort nodes by value in descending order (largest first)' },
                    { key: 'asc', content: 'Sort nodes by value in ascending order (smallest first)' }
                ]
            },
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
            { key: 'dimensions', label: 'Dimensions (multiple)', type: 'dimension & measure', required: true, multiple: true, description: 'Dimensions and/or measures for parallel coordinates' },
            // 系列名称
            { key: 'nameField', label: 'Series', type: 'tag', required: false, description: 'Optional series name for the parallel chart' },
        ],
        basic: [
        ],
        advanced: [
            // 图例显示方式( VisualMap or Legend )
            {
                key: 'legendType',
                label: 'Legend Type',
                type: 'select',
                options: [
                    { label: 'VisualMap', value: 'visualMap' },
                    { label: 'Legend', value: 'legend' }
                ],
                description: 'Legend display type',
                tips: [
                    { key: 'visualMap', content: 'Use continuous visual mapping component, map color by value range' },
                    { key: 'legend', content: 'Use traditional legend display, show by series category' }
                ]
            },
            // 是否显示Category维度
            { key: 'isCategoryDim', label: 'Show Category Dimension', type: 'checkbox', description: 'Whether to add a category dimension to the parallel chart' },
            // Category维度位置
            {
                key: 'positionCategoryDim',
                label: 'Category Dimension Position',
                type: 'select',
                options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' }
                ],
                description: 'Position of the category dimension',
                tips: [
                    { key: 'left', content: 'Place the category dimension on the left for quick access to category information' },
                    { key: 'right', content: 'Place the category dimension on the right to contrast with value dimensions' }
                ]
            },
            // 线条宽度
            { key: 'lineWidth', label: 'Line Width', type: 'number', min: 1, max: 100, description: 'Width of the lines in the parallel chart' },
            // 是否平滑
            { key: 'isSmooth', label: 'Smooth Lines', type: 'checkbox', description: 'Whether to use smooth lines for the parallel chart' },
        ]
    },
    // 桑基图
    Sankey: {
        mapping: [
            // 源节点
            { key: 'source', label: 'Source', type: 'dimension', required: true, description: 'Source node for the link' },
            // 目标节点
            { key: 'target', label: 'Target', type: 'dimension', required: true, description: 'Target node for the link' },
            // 流量/权重
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Value or weight of the link' },
        ],
        basic: [
        ],
        advanced: [
            // 图表布局
            {
                key: 'orient',
                label: 'Layout Orientation',
                type: 'select',
                options: [
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Vertical', value: 'vertical' }
                ],
                description: 'Orientation of the Sankey diagram',
                tips: [
                    { key: 'horizontal', content: 'Horizontal layout, nodes are arranged from left to right' },
                    { key: 'vertical', content: 'Vertical layout, nodes are arranged from top to bottom' }
                ]
            },
            // 连接是否为渐变色
            { key: 'isGradient', label: 'Link Gradient', type: 'checkbox', description: 'Whether to use gradient color for links' },
            // 连接透明度
            { key: 'lineOpacity', label: 'Link Opacity', type: 'number', min: 0, max: 1, description: 'Opacity of the links' },
            // 连接曲度
            { key: 'lineCurveness', label: 'Link Curveness', type: 'number', min: 0, max: 1, description: 'Curveness of the links' },
            // 标签位置
            {
                key: 'labelPosition',
                label: 'Label Position',
                type: 'select',
                options: [
                    { label: 'Inside', value: 'inside' },
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' }
                ],
                description: 'Position of the node labels',
                tips: [
                    { key: 'inside', content: 'Label is displayed inside the node' },
                    { key: 'left', content: 'Label is displayed on the left side of the node' },
                    { key: 'right', content: 'Label is displayed on the right side of the node' }
                ]
            },
            // 左/右对齐布局
            {
                key: 'nodeAlign',
                label: 'Node Alignment',
                type: 'select',
                options: [
                    { label: 'Justify', value: 'justify' },
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' }
                ],
                description: 'Alignment of the nodes',
                tips: [
                    { key: 'justify', content: 'Nodes are evenly distributed, making full use of available space for visual balance.' },
                    { key: 'left', content: 'Nodes are left-aligned, forming a neat left boundary.' },
                    { key: 'right', content: 'Nodes are right-aligned, forming a neat right boundary.' }
                ]
            },
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
            {
                key: 'sort',
                label: 'Sort',
                type: 'select',
                options: [
                    { label: 'Descending', value: 'descending' },
                    { label: 'Ascending', value: 'ascending' }
                ],
                description: 'Sort order for funnel stages',
                tips: [
                    { key: 'descending', content: 'Sort in descending order, values from large to small, suitable for funnel conversion logic' },
                    { key: 'ascending', content: 'Sort in ascending order, values from small to large, suitable for showing growth trends' }
                ]
            },
            // 标签位置
            {
                key: 'labelPosition',
                label: 'Label Position',
                type: 'select',
                options: [
                    { label: 'Inside', value: 'inside' },
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' }
                ],
                description: 'Position of the labels',
                tips: [
                    { key: 'inside', content: 'Label is displayed inside the funnel, concise but requires enough space' },
                    { key: 'left', content: 'Label is displayed on the left side of the funnel, easy to read but takes up space' },
                    { key: 'right', content: 'Label is displayed on the right side of the funnel, suitable for right-aligned layouts' }
                ]
            },
            // 标签字体大小
            { key: 'labelFontSize', label: 'Label Font Size', type: 'number', min: 8, max: 24, description: 'Font size of the labels' },
            // 标签字体粗细
            {
                key: 'labelFontWeight',
                label: 'Label Font Weight',
                type: 'select',
                options: [
                    { label: 'Normal', value: 'normal' },
                    { label: 'Bold', value: 'bold' },
                    { label: 'Lighter', value: 'lighter' }
                ],
                description: 'Font weight of the labels',
                tips: [
                    { key: 'normal', content: 'Normal font weight, standard display effect' },
                    { key: 'bold', content: 'Bold font, highlights important information' },
                    { key: 'lighter', content: 'Light font, reduces visual distraction' }
                ]
            },
            // 标签引导线长度
            { key: 'labelLineLength', label: 'Label Line Length', type: 'number', min: 0, max: 100, description: 'Length of the label guide lines' },
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
            { key: 'category', label: 'Category', type: 'dimension', required: true, description: 'Category field for pictorial bar' },
            // 值轴字段
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Value field for pictorial bar' },
        ],
        basic: [
        ],
        advanced: [
            // xAxis,yAxis名称
            { key: 'xAxisName', label: 'X Axis Name', type: 'text', placeholder: 'X Axis Name', description: 'Name for the X axis' },
            { key: 'yAxisName', label: 'Y Axis Name', type: 'text', placeholder: 'Y Axis Name', description: 'Name for the Y axis' },
            // 网格线(x, y, x&y, none)显示
            {
                key: 'gridVisible',
                label: 'Grid',
                type: 'select',
                required: false,
                options: [
                    { label: 'None', value: '' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'X & Y', value: 'both' }
                ],
                description: 'Grid visibility for the chart',
                tips: [
                    { key: '', content: 'Disable grid lines for a cleaner chart' },
                    { key: 'x', content: 'Show X axis grid lines for easier horizontal value reading' },
                    { key: 'y', content: 'Show Y axis grid lines for easier vertical value reading' },
                    { key: 'both', content: 'Show both X and Y axis grid lines for full value reference' }
                ]
            },
            // 图形符号（可选）
            {
                key: 'symbol',
                label: 'Symbol',
                type: 'select',
                options: [
                    { label: 'Circle', value: 'circle' },
                    { label: 'Rect', value: 'rect' },
                    { label: 'Image', value: 'image' }
                ],
                description: 'Symbol type for pictorial bar',
                tips: [
                    { key: 'circle', content: 'Circle symbol, suitable for representing completeness or periodic data.' },
                    { key: 'rect', content: 'Rectangle symbol, similar to traditional bar charts, clear and intuitive.' },
                    { key: 'image', content: 'Custom image symbol, can use personalized icons to enhance expressiveness.' }
                ]
            },
        ]
    },
    // 主题河流图
    ThemeRiver: {
        mapping: [
            // 时间字段
            { key: 'date', label: 'Date', type: 'dimension', required: true, description: 'Date field for theme river' },
            // 类别字段
            { key: 'category', label: 'Category', type: 'dimension', required: false, description: 'Category field for theme river' },
            // 值字段
            { key: 'value', label: 'Value', type: 'measure', required: true, description: 'Value field for theme river' },
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
            { key: 'date', label: 'Date', type: 'dimension', required: true, description: 'Date field for calendar chart' },
            // 数值字段
            { key: 'value', label: 'Value', type: 'measure', required: false, description: 'Value field for calendar chart' },
        ],
        basic: [
        ],
        advanced: [
        ]
    },
    // ... 其他图表类型可继续扩展
}
