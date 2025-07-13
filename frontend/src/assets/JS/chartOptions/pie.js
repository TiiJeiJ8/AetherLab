/* eslint-disable */

// 饼图 option 生成器
export default function pieOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { title, animation } = config;
    const pieSeries = Array.isArray(seriesData) && seriesData.length > 0 ? seriesData : (xData.map((name, i) => ({ name, value: yDataArr[0][i] })));
    return {
        title: {
            text: title || '',
            left: 'center',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: { trigger: 'item' },
        legend: {
            show: config.legendVisible !== false,
            top: config.legendPosition || 'bottom',
        },
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
        ],
        ...customOption
    };
}
