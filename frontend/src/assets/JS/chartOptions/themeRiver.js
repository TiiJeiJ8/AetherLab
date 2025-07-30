/* eslint-disable */

// 主题河流图配置生成器
export default function themeRiverOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    let orient = 'horizontal';

    if (config.position === 'left' || config.position === 'right') {
        orient = 'vertical';
    }
    else {
        orient = 'horizontal';
    }
    return {
        title: {
            text: config.title || 'Chart of Theme River',
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
            show: config.legendVisible,
            data: Array.from(new Set(seriesData.map(item => item[2]))),
            type: 'scroll',
            orient: orient,
            top: config.legendPosition || 'bottom',
            left: 'center',
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