/* eslint-disable */

// 主题河流图配置生成器
export default function themeRiverOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    console.log('seriesData for themeRiver chart:', seriesData);
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            }
        },
        legend: {
            data: Array.from(new Set(seriesData.map(item => item[2])))
        },
        singleAxis: {
            type: 'time',
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.8)'
            }
        },
        series: [{
            type: 'themeRiver',
            data: seriesData
        }],
    };
}