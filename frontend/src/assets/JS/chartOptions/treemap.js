/* eslint-disable */

/**
 * 矩形树图高级配置项：
 * 副标题 subtext
 * 布局算法 layoutAlgorithm
 * 最小可见面积 visibleMin
 * 叶子节点的深度(控制最大显示层级) leafDepth
 */

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
            text: config.title || 'Chart of Treemap',
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
                layoutAlgorithm: config.layoutAlgorithm || 'squarify', // 布局算法选项 squarify, slice, dice
                /**
                 * slice 适合数据量较少时，横向分布清晰。
                 * dice 适合数据量较少时，纵向分布清晰。
                 * squarify 则让每个区域尽量接近正方形，更适合数据量大或层级多的场景。
                 */
                visibleMin: config.visibleMin || 300, // 最小可见面积
                leafDepth: config.leafDepth || 2, // 叶子节点的深度
                label: {
                    show: true,
                    formatter: '{b}',
                },
            },
        ],
        ...customOption,
    };
    if (config.legendVisible === true) {
        baseOption.visualMap = visualMap;
    }
    return baseOption
}