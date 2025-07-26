/* eslint-disable */

/**
 * 高级配置项：
 * 节点大小设置
 * 边宽度设置 links
 * 图表布局设置(none, force, circular)
 * 连接曲率 curveness
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

    // 最大 / 最小节点大小
    const minNodeSize = config.minNodeSize || 3; // 默认最小 3
    const maxNodeSize = config.maxNodeSize || 43; // 默认最大 43
    const diff = maxNodeSize - minNodeSize;

    // 自动映射节点大小
    const values = nodes.map(n => typeof n.value === 'number' ? n.value : 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    // 映射到像素区间, 错误则返回15
    const getSymbolSize = v => {
        if (maxValue === minValue || maxValue < minValue) return 15;
        return minNodeSize + diff * ((v - minValue) / (maxValue - minValue));
    };
    const sizedNodes = nodes.map(n => ({ ...n, symbolSize: getSymbolSize(n.value) }));

    // 最粗 / 最细边宽度
    const minEdgeWidth = config.minEdgeWidth || 1.5; // 默认最细 1.5
    const maxEdgeWidth = config.maxEdgeWidth || 5; // 默认最粗 5
    const edgeDiff = maxEdgeWidth - minEdgeWidth;

    // 自动映射边的宽度
    const weights = edges.map(e => typeof e.weight === 'number' ? e.weight : 1);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const getEdgeWidth = w => {
        if (maxW === minW || maxW < minW) return 1.5;
        return minEdgeWidth + edgeDiff * ((w - minW) / (maxW - minW));
    };
    const sizedEdges = edges.map(e => ({ ...e, lineStyle: { width: getEdgeWidth(e.weight) } }));

    let Edges = [];
    if (config.isSizedEdges) {
        Edges = sizedEdges
    }
    else {
        // 若不自动映射，则使用输入的边数据
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
                layout: config.layout || 'force', // none, circular, force
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
                    // 力引导布局配置
                    // 节点间斥力
                    repulsion: config.forceRepulsion || 100,
                    // 节点受到中心引力因子
                    gravity: config.forceGravity || 0.1,
                    // 边的理想长度
                    edgeLength: config.forceEdgeLength || 100,
                    // 动画布局
                    layoutAnimation: config.forceLayoutAnimation !== false,
                    // 防止重叠
                    preventOverlap: config.forcePreventOverlap !== false,
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