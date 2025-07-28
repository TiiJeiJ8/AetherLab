/* eslint-disable */

import { getVisualMapInRangeColor } from "../utils/themeDispatcher";

// 引入主题视觉编码分发器

// 热力图生成器
export default function heatmapOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 获取视觉编码色
    let visualColors = getVisualMapInRangeColor(config.colorScheme);

    // 动态调整 visualMap
    let visualMapOption = {};
    switch (config.legendPosition) {
        case 'bottom':
            visualMapOption = {
                orient: 'horizontal',
                left: 'center',
                bottom: 0
            };
            break;
        case 'top':
            visualMapOption = {
                orient: 'horizontal',
                left: 'center',
                top: 0
            };
            break;
        case 'right':
            visualMapOption = {
                orient: 'vertical',
                right: 0,
                top: 'center'
            };
            break;
        case 'left':
            visualMapOption = {
                orient: 'vertical',
                left: -10,
                top: 'center'
            };
            break;
        default:
            visualMapOption = {
                orient: 'horizontal',
                left: 'center',
                bottom: 0
            };
    }
    return {
        // ECharts 热力图配置
        title: {
            text: config.title || 'Chart of Heatmap',
            subtext: config.subtext,
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center', // bottom 也用 center
            top: config.titlePosition === 'bottom' ? 'bottom' : 'top',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        tooltip: {
            position: 'top'
        },
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'category',
            data: yDataArr
        },
        visualMap: {
            min: seriesData.reduce((min, item) => Math.min(min, item[2]), Infinity),
            max: seriesData.reduce((max, item) => Math.max(max, item[2]), -Infinity),
            calculable: true,
            inRange: {
                color: visualColors
            },
            ...visualMapOption
        },
        series: [{
            name: selectedChartType.name,
            type: 'heatmap',
            data: seriesData,
            label: {
                show: true,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            }
        }],
        ...customOption
    };
}