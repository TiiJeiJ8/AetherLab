/* eslint-disable */

// 树状图生成器
export default function treeOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    return {
        title: {
            text: config.title || 'Chart of Tree',
            subtext: config.subtext,
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center', // bottom 也用 center
            top: config.titlePosition === 'bottom' ? 'bottom' : 'top',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
            }
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function (params) {
                // 支持显示 value
                if (params.data.value !== undefined && params.data.value !== null) {
                    return `${params.data.name} : ${params.data.value}`;
                }
                return params.data.name;
            }
        },
        // 判断是否有多棵树
        series: Array.isArray(seriesData)
            ? seriesData.map((tree, idx, arr) => {
                const n = arr.length;

                let left = config.left || '10%';
                let right = config.right || '10%';
                let top = config.top || '10%';
                let bottom = config.bottom || '10%';
                // 设置多树排列位置
                if (config.position_tree === 'left and right') {
                    // 横向均分 left/right
                    left = `${(idx * 100 / n + 5)}%`;
                    right = `${((n - idx - 1) * 100 / n + 5)}%`;
                    top = '10%';
                    bottom = '10%';
                }
                else if (config.position_tree === 'top and bottom') {
                    // 纵向均分 top/bottom
                    left = '10%';
                    right = '10%';
                    top = `${(idx * 100 / n + 5)}%`;
                    bottom = `${((n - idx - 1) * 100 / n + 5)}%`;
                } else {
                    // 默认均分 left/right
                    left = `${(idx * 100 / n + 5)}%`;
                    right = `${((n - idx - 1) * 100 / n + 5)}%`;
                    top = '10%';
                    bottom = '10%';
                }

                return {
                    type: 'tree',
                    data: [tree],
                    orient: config.orient || 'BT', // LR, RL, TB, BT
                    /**
                     * orthogonal: 直角布局, radial: 径向布局
                     * orthogonal 布局时, orient 只支持 LR, RL
                     * radial 布局时, orient 只支持 TB, BT
                     * 直角布局时，节点间距会更大一些
                     * 径向布局时，节点间距会更小一些
                     */
                    layout: config.layout || 'radial', // orthogonal, radial
                    top,
                    left,
                    bottom,
                    right,
                    symbolSize: config.symbolSize || 9, // 节点原点半径
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12,
                        overflow: 'break', // 标签自动换行
                        ellipsis: true // 标签超出部分省略号
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left',
                            overflow: 'break',
                            ellipsis: true
                        }
                    },
                    lineStyle: {
                        width: config.width || 1, // 线宽
                        curveness: config.curveness || 0.3 // 曲线度
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    symbolSize: config.symbolSize || 7,
                    edgeShape: config.edgeShape || 'curve', // curve, polyline
                    edgeForkPosition: config.edgeForkPosition || '50%', // 折线分叉位置
                    initialTreeDepth: config.initialTreeDepth || 3,
                    expandAndCollapse: true, // 是否允许展开和折叠
                    roam: true,
                    animationDuration: 500,
                    animationDurationUpdate: 700,
                };
            })
            : [
                {
                    type: 'tree',
                    data: seriesData,
                    orient: config.orient || 'LR', // LR, RL, TB, BT
                    /**
                     * orthogonal: 直角布局, radial: 径向布局
                     * orthogonal 布局时, orient 只支持 LR, RL
                     * radial 布局时, orient 只支持 TB, BT
                     * 直角布局时，节点间距会更大一些
                     * 径向布局时，节点间距会更小一些
                     */
                    layout: config.layout || 'orthogonal', // orthogonal, radial
                    top: config.top || '10%',
                    left: config.left || '10%',
                    bottom: config.bottom || '10%',
                    right: config.right || '10%',
                    symbolSize: config.symbolSize || 9,
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12,
                        overflow: 'break',
                        ellipsis: true
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left',
                            overflow: 'break',
                            ellipsis: true
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    symbolSize: config.symbolSize || 7,
                    edgeShape: config.edgeShape || 'curve', // curve, polyline
                    edgeForkPosition: config.edgeForkPosition || '50%', // 折线分叉位置
                    initialTreeDepth: config.initialTreeDepth || 2,
                    expandAndCollapse: true, // 是否允许展开和折叠
                    roam: true,
                    animationDuration: 500,
                    animationDurationUpdate: 700,
                }
            ],
        ...customOption,
    };
}
