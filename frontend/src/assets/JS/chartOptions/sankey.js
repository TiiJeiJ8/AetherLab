/* eslint-disable */

/**
 * 桑基图高级配置项：
 * 副标题 subtext
 * 连接颜色 isGradient
 * 连接宽度 lineWidth
 * 连接透明度 lineOpacity
 * 连接曲度 lineCurveness
 * 图表布局 orient
 * 标签配置 labelPositon
 * 左/右对齐布局 nodeAlign
 */

// 桑基图配置生成器

export default function sankeyOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 解包
    const { data, links } = seriesData;

    let orient = config.orient || 'vertical';
    let labelPosition = config.labelPosition || 'inside';
    let nodeAlign = config.nodeAlign || 'justify';

    return {
        title: {
            text: config.title || 'Chart of Sankey',
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
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        toolbox: {
            show: true,
            feature: {
                restore: { show: true },
                saveAsImage: { show: true },
            }
        },
        series: [{
            type: 'sankey',
            emphasis: {
                focus: 'adjacency'
            },
            lineStyle: {
                color: config.isGradient ? 'gradient' : 'source',
                width: config.lineWidth || 1,
                opacity: config.lineOpacity || 0.5,
                curveness: config.lineCurveness || 0.5
            },
            label: {
                position: labelPosition,
                formatter: '{b}'
            },
            orient: orient,
            nodeAlign: nodeAlign,
            data: data,
            links: links,
        }],
        ...customOption
    }
}