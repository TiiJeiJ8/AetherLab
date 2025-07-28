/* eslint-disable */

// 饼图 option 生成器
export default function pieOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { title, animation } = config;
    const rawSeries = Array.isArray(seriesData) && seriesData.length > 0 ? seriesData : (xData.map((name, i) => ({ name, value: yDataArr[0][i] })));

    const pieSeries = Object.values(
        rawSeries.reduce((acc, cur) => {
            acc[cur.name] = acc[cur.name] || { name: cur.name, value: 0 };
            acc[cur.name].value += Number(cur.value) || 0;
            return acc;
        }, {})
    );
    console.log('[pieOption] pieSeries:', pieSeries);

    return {
        title: {
            text: config.title || 'Chart of Pie',
            subtext: config.subtext,
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center', // bottom 也用 center
            top: config.titlePosition === 'bottom' ? 'bottom' : 'top',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        tooltip: { trigger: 'item' },
        legend: {
            type: 'scroll',
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
