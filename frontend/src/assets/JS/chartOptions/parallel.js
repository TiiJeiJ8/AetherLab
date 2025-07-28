/* eslint-disable */

import { readonly } from "vue";

// 引入主题视觉编码分发器
import { getVisualMapInRangeColor } from '../utils/themeDispatcher';

// 平行坐标系图配置生成器
export default function parallelOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 获取视觉编码色
    let visualColors = getVisualMapInRangeColor(config.colorScheme);
    // 默认配置项
    const lineWidth = config.lineWidth || 2;
    const isSmooth = config.isSmooth || false;
    const subtext = config.subtext || '';

    // 维度自动识别 (排除name字段)
    let dimensions = Object.keys(seriesData[0] || {}).filter(key => key !== 'name');

    // 是否添加category维度
    const isCategoryDim = config?.isCategoryDim;
    const positionCategoryDim = config?.positionCategoryDim || 'left'; // left/right
    let parallelAxis = [];

    // 构造数值型维度
    const boundaryRatio = 0.05; // 默认5%边界
    const valueAxes = dimensions.map((dim, idx) => {
        const values = seriesData.map(item => item[dim]);
        let min = Math.min(...values);
        let max = Math.max(...values);
        if (min === max) {
            min -= 1;
            max += 1;
        }
        const range = max - min;
        min = min - range * boundaryRatio;
        max = max + range * boundaryRatio;
        min = Math.floor(min);
        max = Math.ceil(max);
        return {
            dim: null, // 后续统一设置dim索引
            name: dim,
            min,
            max
        };
    });

    // 构造category维度
    if (isCategoryDim) {
        const categories = Array.from(new Set(seriesData.map(item => item.name)));
        const categoryAxis = {
            dim: null, // 后续统一设置dim索引
            name: 'Category',
            type: 'category',
            data: categories
        };
        if (positionCategoryDim === 'left') {
            parallelAxis = [categoryAxis, ...valueAxes];
        } else {
            parallelAxis = [...valueAxes, categoryAxis];
        }
    } else {
        parallelAxis = valueAxes;
    }
    // 统一设置dim索引
    parallelAxis = parallelAxis.map((axis, idx) => ({ ...axis, dim: idx }));

    // 维度顺序调整后，series数据也需调整
    let dataDimensions = dimensions.slice();
    if (isCategoryDim) {
        if (positionCategoryDim === 'left') {
            dataDimensions = ['name', ...dimensions];
        } else {
            dataDimensions = [...dimensions, 'name'];
        }
    }

    // 按name分组
    const groupMap = {};
    seriesData.forEach(item => {
        const group = item.name || 'default';
        if (!groupMap[group]) groupMap[group] = [];
        // 按dataDimensions顺序取值
        groupMap[group].push(dataDimensions.map(dim => item[dim]));
    });

    // 构造series
    const series = Object.entries(groupMap).map(([name, data]) => ({
        name,
        type: 'parallel',
        lineStyle: {
            width: lineWidth
        },
        smooth: isSmooth,
        data
    }));

    let orient = 'horizontal';

    if (config.position === 'left' || config.position === 'right') {
        orient = 'vertical';
    }
    else {
        orient = 'horizontal';
    }

    // legendType控制图例方式
    const legendType = config.legendType || 'legend'; // legend 或 visualmap
    let option = {
        title: {
            text: config.title || 'Chart of Parallel',
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
            trigger: 'item'
        },
        parallelAxis,
        parallel: {
            left: '5%',
            right: '13%',
            bottom: '10%',
            top: '15%'
        },
        series,
        ...customOption,
    };

    if (legendType === 'legend') {
        option.legend = {
            show: config.legendVisible,
            data: Object.keys(groupMap),
            type: 'scroll',
            orient: orient,
            top: config.legendPosition || 'bottom',
            left: 'center',
        };
    } else if (legendType === 'visualMap') {
        // 默认用第一个数值型维度做visualMap
        const visualDimIdx = isCategoryDim && positionCategoryDim === 'left' ? 1 : 0;
        // 动态调整 visualMap
        let visualMapOption = {};
        switch (config.legendPosition) {
            case 'bottom':
                visualMapOption = {
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 0
                };
                break;
            case 'top':
                visualMapOption = {
                    orient: 'horizontal',
                    left: 'center',
                    top: 0
                };
                break;
            case 'right':
                visualMapOption = {
                    orient: 'vertical',
                    right: 0,
                    top: 'center'
                };
                break;
            case 'left':
                visualMapOption = {
                    orient: 'vertical',
                    left: -10,
                    top: 'center'
                };
                break;
            default:
                visualMapOption = {
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 0
                };
        }
        option.visualMap = {
            show: config.legendVisible,
            type: 'continuous',
            dimension: visualDimIdx,
            min: parallelAxis[visualDimIdx].min,
            max: parallelAxis[visualDimIdx].max,
            ...visualMapOption,
            calculable: true,
            inRange: {
                color: visualColors,
            },
            text: ['High', 'Low']
        };
    }
    return option;
}