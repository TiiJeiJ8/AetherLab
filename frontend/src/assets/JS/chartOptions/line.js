/* eslint-disable */

/**
 * 折线图高级配置项：
 * 数据点形状
 * 折线样式
 * 平滑
 * 折线颜色渐变
 * 面积图
 * 面积图颜色渐变
 * 凹凸图
 * 最大最小值
 * 均值线
 * 多x轴（hard）
 * 可选区域高亮（可选是否改变折线颜色、高亮区域颜色【若不选择跟随主题样式】）
 * 函数绘图
 * 标记线
 * 阶梯折线图
 * 极坐标
 * 动态排序折线
 */

import { getThemeColorPalette } from "../utils/themeDispatcher";

// 折线图 option 生成器
export default function lineOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 网格线显示控制
    let xGrid = false, yGrid = false;
    switch (config.gridVisible) {
        case 'x':
            xGrid = true; yGrid = false; break;
        case 'y':
            xGrid = false; yGrid = true; break;
        case 'both':
            xGrid = true; yGrid = true; break;
        case 'none':
        default:
            xGrid = false; yGrid = false;
    }
    const { yAxis, title, animation } = config;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const seriesArr = yArr.map((y, idx) => {
        const base = {
            name: y.field,
            type: 'line',
            data: yDataArr[idx],
            smooth: config.isSmooth || false,
            animationDuration: animation ? 1500 : 0
        };
        // 堆叠控制
        if (config.isStack) base.stack = 'total';
        // 阶梯折线
        if (config.isStep) base.step = 'middle';

        const colorPalette = getThemeColorPalette(config.colorScheme); // 获取主题色盘

        // 面积图
        if (config.isArea) base.areaStyle = config.areaGradient ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: colorPalette[0] }, { offset: 1, color: colorPalette[1] }] } } : {};
        // 折线颜色渐变
        if (config.lineGradient) base.lineStyle = { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: colorPalette[0] }, { offset: 1, color: colorPalette[1] }] } };
        // 最大最小值
        if (config.showMaxMin) {
            base.markPoint = {
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            };
        }
        // 均值线
        if (config.showMeanLine) {
            base.markLine = {
                data: [
                    { type: 'average', name: 'Mean' }
                ]
            };
        }
        // 极坐标
        if (config.isPolar) base.coordinateSystem = 'polar';
        return base;
    });
    const option = {
        title: {
            text: config.title || 'Chart of Line',
            subtext: config.subtext,
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center', // bottom 也用 center
            top: config.titlePosition === 'bottom' ? 'bottom' : 'top',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        tooltip: { trigger: 'axis' },
        legend: {
            type: 'scroll',
            show: config.legendVisible !== false,
            data: yArr.map(y => y.field),
            top: config.legendPosition || 'bottom',
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
    if (!config.isPolar) {
        option.xAxis = {
            type: 'category',
            data: xData,
            name: config.xAxisName || 'X Axis',
            axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 },
            splitLine: { show: xGrid }
        };
        option.yAxis = {
            type: 'value',
            name: config.yAxisName || 'Y Axis',
            splitLine: { show: yGrid }
        };
    }
    // 极坐标配置
    if (config.isPolar) {
        option.polar = {};
        option.angleAxis = { type: 'category', data: xData };
        option.radiusAxis = {};
    }
    return option;
}
