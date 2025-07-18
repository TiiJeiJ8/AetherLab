/* eslint-disable */

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
    // 映射到 3~48 像素区间
    const getSymbolSize = v => {
        if (maxValue === minValue) return 15;
        return 3 + 40 * ((v - minValue) / (maxValue - minValue));
    };
    const sizedNodes = nodes.map(n => ({ ...n, symbolSize: getSymbolSize(n.value) }));

    return {
        tooltip: {
            show: true,
            formatter: function (params) {
                if (params.dataType === 'node') {
                    return params.data.name || params.data.id;
                } else if (params.dataType === 'edge') {
                    return `${params.data.source} → ${params.data.target}` + (params.data.weight ? ` (Weight: ${params.data.weight})` : '');
                }
                return '';
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: { show: true },
                saveAsImage: { show: true },
                restore: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['force', 'chord', 'none']
                }
            }
        },
        legend: {
            type: 'scroll',
            data: categories,
            show: config.legendVisible !== false,
            top: config.legendPosition || 'bottom',
        },
        series: [
            {
                type: 'graph',
                layout: 'circular', // none, circular, force
                roam: true,
                data: sizedNodes,
                links: edges,
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
                    curveness: 0.3,
                },
                edgeLabel: {
                    show: false
                },
                emphasis: {
                    focus: 'adjacency'
                },
            }
        ],
        ...customOption,
    };
}