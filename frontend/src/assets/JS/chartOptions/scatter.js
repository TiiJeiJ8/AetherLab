/* eslint-disable */

// 散点图 option 生成器
export default function scatterOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { yAxis, title, animation } = config;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const seriesArr = yArr.map((y, idx) => ({
        name: y.field,
        type: 'scatter',
        data: yDataArr[idx],
        animationDuration: animation ? 1500 : 0
    }));
    return {
        title: {
            text: config.title || 'Chart of Scatter',
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
                magicType: { show: true, type: ['line', 'bar', 'scatter'] },
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
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
}
