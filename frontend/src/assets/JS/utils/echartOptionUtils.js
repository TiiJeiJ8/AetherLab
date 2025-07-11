/* eslint-disable */

// 生成ECharts配置，支持多文件数据查找和主键/行号对齐
export function generateEChartOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData) {
    const { yAxis, title, colorScheme, animation } = config;
    // series配置
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const seriesArr = yArr.map((y, idx) => ({
        name: y.field,
        type: selectedChartType.value.toLowerCase(),
        data: yDataArr[idx],
        animationDuration: animation ? 1500 : 0,
        itemStyle: { color: getColorByScheme(colorScheme) }
    }));
    // 基础option
    const option = {
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
        animationDuration: animation ? 1500 : 0
    };
    // 饼图特殊处理：优先用 seriesData
    if (selectedChartType.value === 'Pie' || selectedChartType.value === 'pie') {
        const pieSeries = Array.isArray(seriesData) && seriesData.length > 0 ? seriesData : (xData.map((name, i) => ({ name, value: yDataArr[0][i] })));
        const option = {
            title: {
                text: title || '',
                left: 'center',
                textStyle: { fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            series: [
                {
                    name: title || '',
                    type: 'pie',
                    radius: '60%',
                    data: pieSeries,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    animation: animation,
                    animationDuration: animation ? 1500 : 0
                }
            ]
        };
        console.log('[generateEChartOption] option:', option);
        return option;
    }
    // 调试输出
    console.log('[generateEChartOption] option:', option);
    return option;
}

// 根据配色方案获取颜色
export function getColorByScheme(scheme) {
    const colorSchemes = {
        default: '#5470c6',
        blue: '#1890ff',
        green: '#52c41a',
        warm: '#fa8c16',
        cool: '#13c2c2'
    }
    return colorSchemes[scheme] || colorSchemes.default
}
