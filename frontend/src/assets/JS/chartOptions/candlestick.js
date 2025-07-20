/* eslint-disable */

// K线图生成器
export default function candlestickOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { yAxis, title, animation } = config;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    // K线图数据处理
    const seriesDataProcessed = yDataArr.map((data, idx) => ({
        name: yArr[idx].field,
        type: 'candlestick',
        data: yDataArr[0],
        animationDuration: animation ? 1500 : 0
    }));

    return {
        title: {
            text: title || `Candlestick Chart`,
            subtext: config.subtext || '',
            left: 'center',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
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
                magicType: { show: true, type: ['line', 'bar', 'candlestick'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 }
        },
        yAxis: { type: 'value', name: yArr.map(y => y.field).join(',') },
        series: seriesDataProcessed,
        animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
}