/* eslint-disable */

// 折线图 option 生成器
export default function lineOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { yAxis, title, animation } = config;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const seriesArr = yArr.map((y, idx) => ({
        name: y.field,
        type: 'line',
        data: yDataArr[idx],
        animationDuration: animation ? 1500 : 0
    }));
    return {
        title: {
            text: title || `${yArr.map(y => y.field).join(',')} vs ${config.xAxis.field}`,
            left: 'center',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'axis' },
        legend: { data: yArr.map(y => y.field), top: 'bottom' },
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
            axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 }
        },
        yAxis: { type: 'value', name: yArr.map(y => y.field).join(',') },
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
}
