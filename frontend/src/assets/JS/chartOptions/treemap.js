/* eslint-disable */

// 引入主题视觉编码分发器
import { getVisualMapInRangeColor } from "../utils/themeDispatcher"

// 矩形树图图生成器
export default function treemapOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    let orient = 'horizontal';

    if (config.position === 'left' || config.position === 'right') {
        orient = 'vertical';
    }
    else {
        orient = 'horizontal';
    }
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
            left: 'left',
            top: config.legendPosition || 'bottom',
        };
    }
    else {
        visualMap = {};
    }

    const baseOption = {
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
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
            }
        },
        tooltip: {},
        series: [
            {
                type: 'treemap',
                data: seriesData,
                visibleMin: config.visibleMin || 300, // 最小可见面积
                leafDepth: config.leafDepth || 2, // 叶子节点的深度
                label: {
                    show: true,
                    formatter: '{b}',
                },
                sort: config.sort || 'desc',
            },
        ],
        ...customOption,
    };
    if (config.legendVisible === true) {
        baseOption.visualMap = visualMap;
    }
    return baseOption
}