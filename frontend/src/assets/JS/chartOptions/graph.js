/* eslint-disable */

/**
 * 高级配置项：
 * 节点大小设置
 * 边宽度设置 links
 * 图表布局设置(none, force, circular)
 * 连接曲率 curveness
 * 布局样式 layout
 */

// 关系图生成器
export default function graphOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { nodes, edges } = seriesData;
    // 兼容无category字段
    let categories = Array.from(new Set(nodes.map(node => node.category))).filter(Boolean);
    if (categories.length === 0) {
        categories = ['Default'];
        // 给所有节点补上默认分组
        nodes.forEach(n => { n.category = 'Default'; });
    }

    // 自动映射节点大小
    const values = nodes.map(n => typeof n.value === 'number' ? n.value : 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    // 映射到 3~43 像素区间, 默认15
    const getSymbolSize = v => {
        if (maxValue === minValue) return 15;
        return 3 + 40 * ((v - minValue) / (maxValue - minValue));
    };
    const sizedNodes = nodes.map(n => ({ ...n, symbolSize: getSymbolSize(n.value) }));

    // 自动映射边的宽度(1-5 px; default: 1.5 px)
    const weights = edges.map(e => typeof e.weight === 'number' ? e.weight : 1);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const getEdgeWidth = w => {
        if (maxW === minW) return 1.5;
        return 1 + 4 * ((w - minW) / (maxW - minW));
    };
    const sizedEdges = edges.map(e => ({ ...e, lineStyle: { width: getEdgeWidth(e.weight) } }));

    let Edges = [];
    if (config.isSizedEdges) {
        Edges = sizedEdges
    }
    else {
        Edges = edges
    }

    return {
        title: {
            text: config.title || 'Chart of Graph',
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
        toolbox: {
            show: true,
            feature: {
                dataZoom: { show: true },
                saveAsImage: { show: true },
                restore: { show: true },
                dataView: { show: true, readOnly: false },
            }
        },
        legend: {
            type: 'scroll',
            data: categories.map(name => ({ name })),
            show: config.legendVisible !== false,
            top: config.legendPosition || 'bottom',
        },
        series: [
            {
                type: 'graph',
                layout: config.layout || 'circular', // none, circular, force
                roam: true,
                data: sizedNodes,
                links: Edges,
                categories: categories.map(cat => ({ name: cat })),
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                },
                force: {
                    repulsion: 200,
                    edgeLength: 100
                },
                lineStyle: {
                    color: 'source',
                    curveness: config.curveness || 0.3,
                },
                edgeLabel: {
                    show: false,
                },
                emphasis: {
                    focus: 'adjacency'
                },
            }
        ],
        ...customOption,
    };
}