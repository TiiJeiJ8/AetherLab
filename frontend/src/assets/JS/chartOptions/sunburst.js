/* eslint-disable */

/**
 * 旭日图高级配置项：
 * 副标题 subtext
 * 排序方式 sort (undefined, dec, asc)
 * 最小显示标签角度 minAngle
 * 旭日图区块圆角 borderRadius
 * 旭日图边界宽度(控制区块距离) borderWidth
 */

// 引入主题视觉编码分发器
import { getVisualMapInRangeColor } from '../utils/themeDispatcher';

// 旭日图生成器
export default function sunburstOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 获取视觉编码色
    let visualColors = getVisualMapInRangeColor(config.colorScheme);
    // 递归获取所有节点 value
    function getValueRange(data) {
        let values = [];
        function traverse(nodes) {
            if (!nodes) return;
            for (let i = 0; i < nodes.length; i++) {
                if (typeof nodes[i].value === 'number') {
                    values.push(nodes[i].value);
                }
                if (nodes[i].children && nodes[i].children.length > 0) {
                    traverse(nodes[i].children);
                }
            }
        }
        traverse(data);
        return {
            min: values.length ? Math.min(...values) : 1,
            max: values.length ? Math.max(...values) : 100
        };
    }

    // 自动计算最大层级
    function getMaxDepth(data, depth) {
        depth = depth || 1;
        if (!Array.isArray(data)) return depth;
        let max = depth;
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            if (node.children && node.children.length > 0) {
                max = Math.max(max, getMaxDepth(node.children, depth + 1));
            }
        }
        return max;
    }

    var maxDepth = getMaxDepth(seriesData);
    // 缩小最外层半径
    var outerRadius = config.outerRadius || '80%';
    // 均匀分配每层 r0/r
    var levels = [];
    for (var i = 0; i < maxDepth; i++) {
        var r0 = (i === 0) ? '0%' : Math.round((i / maxDepth) * 80) + '%';
        var r = Math.round(((i + 1) / maxDepth) * 80) + '%';
        var label = {};
        var itemStyle = {};
        if (i === 0) {
            label = { show: false };
        } else if (i === maxDepth - 1) {
            label = { position: 'outside', padding: 3, silent: false, rotate: 'radial' };
            itemStyle = { borderWidth: 3 };
        } else if (i === 1) {
            label = { rotate: 'radial', minAngle: 6 };
            itemStyle = { borderWidth: 2 };
        } else {
            label = { align: 'right' };
        }
        levels.push({ r0: r0, r: r, label: label, itemStyle: itemStyle });
    }

    let orient = 'horizontal';

    if (config.position === 'left' || config.position === 'right') {
        orient = 'vertical';
    }
    else {
        orient = 'horizontal';
    }

    let visualMap = {};
    const valueRange = getValueRange(seriesData);
    if (config.legendVisible === true) {
        visualMap = config.visualMap || {
            show: true,
            type: 'continuous',
            inRange: {
                color: visualColors
            },
            min: valueRange.min,
            max: valueRange.max,
            dimension: 'value',
            orient,
            left: 'center',
            top: config.legendPosition || 'bottom',
        };
    }
    else {
        visualMap = {};
    }

    const baseOption = {
        title: {
            text: config.title || 'Chart of Sunburst',
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
            trigger: 'item',
            formatter: info => `${info.name} : ${info.value}`
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
            }
        },
        series: [
            {
                type: 'sunburst',
                data: seriesData,
                radius: [0, outerRadius],
                sort: config.sort || 'undefined',
                emphasis: {
                    focus: 'ancestor'
                },
                label: {
                    show: function (params) {
                        const rect = params.rect || params.labelRect;
                        if (rect && rect.width * rect.height < 400) {
                            return false;
                        }
                        return true;
                    },
                    fontSize: 12,
                    minAngle: config.minAngle || 5,
                },
                levels,
                itemStyle: {
                    borderRadius: config.borderRadius || 3,
                    borderWidth: config.borderWidth || 3,
                },
                ...customOption
            }
        ]
    };
    if (config.legendVisible === true) {
        baseOption.visualMap = visualMap;
    }
    return baseOption;
}