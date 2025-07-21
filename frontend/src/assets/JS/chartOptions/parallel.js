/* eslint-disable */

import { readonly } from "vue";

/**
 * 平行坐标系图高级配置项：
 * 线条宽度 LineWidth
 * 副标题 subtext
 */

// 平行坐标系图配置生成器
// 不再需要 visualMap 相关内容
// 平行坐标系图配置生成器
export default function parallelOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 解包数据
    const { dimensions, name } = seriesData;

    if (!dimensions || !name || !Array.isArray(dimensions) || !Array.isArray(name)) {
        return {};
    }



    // 获取所有字段名，包含 Category
    const allKeys = Object.keys(name[0]);
    const groupKey = 'Category';
    const dimensionNames = allKeys.filter(k => k !== groupKey);
    const allData = Array.isArray(name) ? name : [];

    // 构造 parallelAxis（不包含 Category）
    const parallelAxis = dimensionNames.map((dim, idx) => {
        const isNumber = typeof name[0][dim] === 'number';
        let axis = {
            dim: idx,
            name: dim,
            type: isNumber ? 'value' : 'category',
            boundaryGap: false
        };
        if (isNumber) {
            const values = allData.map(item => item[dim]).filter(v => typeof v === 'number' && !isNaN(v));
            if (values.length) {
                axis.min = Math.ceil(Math.min(...values) * 0.75);
                axis.max = Math.ceil(Math.max(...values) * 1.25);
            }
        }
        return axis;
    });

    // 按 Category 分组，生成 series
    const groupMap = {};
    allData.forEach(item => {
        const key = item[groupKey] || '未分类';
        if (!groupMap[key]) groupMap[key] = [];
        groupMap[key].push(item);
    });

    const series = Object.entries(groupMap).map(([cat, arr]) => ({
        name: cat,
        type: 'parallel',
        lineStyle: {
            width: config.lineWidth || 2
        },
        data: arr.map(item => dimensionNames.map(dim => item[dim]))
    }));

    let orient = 'horizontal';
    // 根据配置决定方向
    if (config.position === 'left' || config.position === 'right') {
        orient = 'vertical';
    }
    else {
        orient = 'horizontal';
    }

    const option = {
        title: {
            text: config.title || 'Chart of Parallel',
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
            show: true,
            type: 'scroll',
            orient,
            top: config.legendPosition || 'top',
            left: 'center',
            // 可根据需要自定义更多 legend 配置
        },
        toolbox: {
            show: true,
            feature: {
                DataView: { show: true, readonly: false },
                restore: { show: true },
                saveAsImage: { show: true },
            }
        },
        parallelAxis,
        parallel: {
            left: '5%',
            right: '13%',
            bottom: '10%',
            parallelAxisDefault: {
                type: 'value',
                nameLocation: 'end',
                nameGap: 20
            }
        },
        series,
        ...customOption
    };

    return option;
}