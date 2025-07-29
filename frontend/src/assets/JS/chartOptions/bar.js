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
 * 圆角柱体
 * 堆叠柱状图
 * 堆叠柱状图的归一化
 * 堆叠条形图
 * 折、柱混合
 * 多Y轴
 * 多层下钻
 * 动态排序
 */

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
    const seriesArr = yArr.map((y, idx) => ({
        name: y.field,
        type: 'bar',
        data: yDataArr[idx],
        animationDuration: animation ? 1500 : 0
    }));
    return {
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
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 },
            splitLine: { show: xGrid },
            name: config.xAxisName || 'X Axis',
        },
        yAxis: {
            type: 'value',
            name: yArr.map(y => y.field).join(','),
            splitLine: { show: yGrid },
            name: config.yAxisName || 'Y Axis',
        },
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
}
