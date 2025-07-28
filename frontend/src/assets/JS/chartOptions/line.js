/* eslint-disable */

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
    const seriesArr = yArr.map((y, idx) => ({
        name: y.field,
        type: 'line',
        data: yDataArr[idx],
        smooth: config.isSmooth || false,
        animationDuration: animation ? 1500 : 0
    }));
    return {
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
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 },
            splitLine: { show: xGrid }
        },
        yAxis: {
            type: 'value',
            name: yArr.map(y => y.field).join(','),
            splitLine: { show: yGrid }
        },
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
}
