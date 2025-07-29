/* eslint-disable */

// K线图生成器
export default function candlestickOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
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
    // 标记最大/最小值
    let markPoint = undefined;
    if (config.showMaxMin) {
        markPoint = {
            data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
            ],
            symbolSize: 60,
            label: { fontSize: 12 }
        };
    }
    const { yAxis, title, animation } = config;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    // K线图数据处理
    const seriesDataProcessed = yDataArr.map((data, idx) => ({
        name: yArr[idx].field,
        type: 'candlestick',
        data: yDataArr[0],
        animationDuration: animation ? 1500 : 0,
        ...(markPoint ? { markPoint } : {})
    }));

    // MA均线计算函数
    function calcMA(data, period) {
        return data.map((item, idx) => {
            if (idx < period - 1) return '-';
            // ECharts K线数据格式：[open, close, low, high]
            // 取收盘价（第2项）
            const sum = data.slice(idx - period + 1, idx + 1).reduce((acc, cur) => acc + cur[1], 0);
            return +(sum / period).toFixed(2);
        });
    }

    // 生成MA系列
    const maSeries = [];
    if (config.ma5) {
        maSeries.push({
            name: 'MA5',
            type: 'line',
            data: calcMA(yDataArr[0], 5),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1 }
        });
    }
    if (config.ma10) {
        maSeries.push({
            name: 'MA10',
            type: 'line',
            data: calcMA(yDataArr[0], 10),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1 }
        });
    }
    if (config.ma20) {
        maSeries.push({
            name: 'MA20',
            type: 'line',
            data: calcMA(yDataArr[0], 20),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1 }
        });
    }
    if (config.ma30) {
        maSeries.push({
            name: 'MA30',
            type: 'line',
            data: calcMA(yDataArr[0], 30),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1 }
        });
    }

    // legend需包含均线
    const legendData = [...yArr.map(y => y.field), ...maSeries.map(ma => ma.name)];

    return {
        title: {
            text: config.title || 'Chart of Candlestick',
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
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            type: 'scroll',
            show: config.legendVisible !== false,
            data: legendData,
            top: config.legendPosition || 'bottom',
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: { show: true },
                dataView: { show: true, readOnly: false },
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
            name: config.yAxisName || 'Y Axis',
            splitLine: { show: yGrid }
        },
        series: [...seriesDataProcessed, ...maSeries],
        animation,
        animationDuration: animation ? 1500 : 0,
        ...customOption
    };
}