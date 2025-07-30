/* eslint-disable */

/**
 * 柱状图高级配置项：
 * 均值线
 * 坐标轴刻度与标签对齐开关
 * 带背景色的柱状图
 * 高亮单个柱子
 * 交错正负轴标签
 * 极坐标柱状图（radial、tangential）
 * 极坐标endAngle
 * 柱状图渐变
 * 堆叠柱状图
 * 堆叠柱状图的归一化
 * 堆叠条形图
 * 折、柱混合
 * 多Y轴
 * 动态排序
 */

import { getThemeColorPalette } from '../utils/themeDispatcher'

// 柱状图 option 生成器
export default function barOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
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
    const colorPalette = getThemeColorPalette(config.colorScheme);
    // 归一化处理
    let normalizedData = yDataArr;
    if (config.isNormalized && yDataArr.length > 1) {
        // 按列归一化
        normalizedData = yDataArr.map((arr, idx) => arr.map((v, i) => {
            const sum = yDataArr.reduce((acc, cur) => acc + (cur[i] || 0), 0);
            return sum ? v / sum : 0;
        }));
    }
    const seriesArr = yArr.map((y, idx) => {
        const base = {
            name: y.field,
            type: 'bar',
            data: (config.isNormalized && yDataArr.length > 1) ? normalizedData[idx] : yDataArr[idx],
            // 动画
            animationDuration: 800,
            animationEasing: 'cubicOut',
            animationDelay: (idx) => idx * 30,
            animationDelayUpdate: (idx) => idx * 30
        };
        // 堆叠
        if (config.isStack || config.isNormalized) base.stack = 'total';
        // 渐变色
        if (config.barGradient) {
            base.itemStyle = base.itemStyle || {};
            base.itemStyle.color = {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: colorPalette[idx % colorPalette.length] },
                    { offset: 1, color: colorPalette[(idx + 1) % colorPalette.length] }
                ]
            };
        }
        // 背景色
        if (config.barBackgroundColor) {
            base.showBackground = true;
            base.backgroundStyle = { color: config.barBackgroundColor };
        }
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
        return base;
    });
    // 极坐标
    let polarOpt = {};
    if (config.polarStyle && config.polarStyle !== 'none') {
        polarOpt.polar = {};
        if (config.polarStyle === 'radial') {
            polarOpt.angleAxis = {
                type: 'category',
                data: xData,
                startAngle: config.startAngle || 0,
                endAngle: config.endAngle || 360,
            };
            polarOpt.radiusAxis = { z: 999 };
            seriesArr.forEach(s => s.coordinateSystem = 'polar');
        } else if (config.polarStyle === 'tangential') {
            polarOpt.radiusAxis = { type: 'category', data: xData, z: 999 };
            polarOpt.angleAxis = {
                startAngle: config.startAngle || 0,
                endAngle: config.endAngle || 360
            };
            seriesArr.forEach(s => s.coordinateSystem = 'polar');
        }
    }
    // 轴对齐
    const xAxisOpt = {
        type: 'category',
        data: xData,
        axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 },
        splitLine: { show: xGrid },
        name: config.xAxisName || 'X Axis',
    };
    // 竖直/水平条形
    let yAxisOpt = {
        type: 'value',
        name: config.yAxisName || 'Y Axis',
        splitLine: { show: yGrid }
    };
    if (config.isHorizontal === true) {
        // 横向条形
        xAxisOpt.type = 'value';
        xAxisOpt.name = config.xAxisName || 'X Axis';
        yAxisOpt = {
            type: 'category',
            data: xData,
            name: config.yAxisName || 'Y Axis',
        };
    }
    // 交错正负轴标签
    if (config.staggerAxisLabel) {
        xAxisOpt.axisLabel = xAxisOpt.axisLabel || {};
        xAxisOpt.axisLabel.margin = 20;
        xAxisOpt.axisLabel.rotate = 30;
    }
    const option = {
        title: {
            text: config.title || 'Chart of Bar',
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
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        ...polarOpt,
        ...customOption
    };
    // 极坐标下不显示xAxis/yAxis
    if (!polarOpt.polar) {
        option.xAxis = xAxisOpt;
        option.yAxis = yAxisOpt;
    }
    return option;
}
