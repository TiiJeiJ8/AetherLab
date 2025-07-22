/* eslint-disable */

/**
 * 漏斗图高级配置项：
 * 副标题 subtext
 * 图例布局 legendOrient
 * 数据排序 sort
 * 标签位置 labelPosition
 * 标签字体大小 labelFontSize
 * 标签字体粗细 labelFontWeight
 * 标签引导线长度 labelLineLength
 */

// 漏斗图配置生成器
export default function funnelOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const funnelData = seriesData;

    let legendOrient = config.orient || 'horizontal';

    return {
        title: {
            text: config.title || 'Chart of Funnel',
            subtext: config.subtext || '',
            left: 'center',
            top: 'top',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
            subtextStyle: {
                fontSize: 12,
            },
        },
        legend: {
            type: 'scroll',
            orient: legendOrient,
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