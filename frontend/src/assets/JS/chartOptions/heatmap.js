/* eslint-disable */

// 热力图生成器
export default function heatmapOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    console.log('[heatmapOption] config:', config);
    console.log('[heatmapOption] fileDataMap:', fileDataMap);
    console.log('[heatmapOption] xData:', xData);
    console.log('[heatmapOption] yData:', yDataArr);
    console.log('[heatmapOption] seriesData:', seriesData);

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