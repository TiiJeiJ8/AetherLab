/* eslint-disable */

// 漏斗图配置生成器
export default function funnelOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const funnelData = seriesData;

    return {
        title: {
            text: config.title || '',
            subtext: config.subtext || '',
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center', // bottom 也用 center
            top: config.titlePosition === 'bottom' ? 'bottom' : 'top',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        legend: {
            type: 'scroll',
            show: config.legendVisible !== false,
            top: config.legendPosition || 'bottom',
            data: funnelData ? funnelData.map(item => item.name) : [],
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
            show: true,
            feature: {
                restore: { show: true },
                saveAsImage: { show: true },
            }
        },
        series: [
            {
                name: 'Funnel',
                type: 'funnel',
                sort: config.sort || 'descending',
                label: {
                    show: true,
                    position: config.labelPosition || 'inside', // inside, left, right
                    fontSize: config.labelFontSize || 12,
                    fontWeight: config.labelFontWeight || 'normal',
                },
                labelLine: {
                    length: config.labelLineLength || 10,
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: funnelData
            }
        ]
    };
}