/* eslint-disable */

// 雷达图生成器
export default function radarOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 解包RadarPack
    const { indicator, seriesData_radar } = seriesData;

    return {
        // Echarts 雷达图配置
        title: {
            text: config.title || `Chart of Radar`,
            subtext: config.subtext || '',
            left: 'center',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        legend: {
            type: 'scroll',
            show: config.legendVisible !== false,
            top: config.legendPosition || 'bottom',
            data: seriesData_radar.map(item => item.name) || []
        },
        radar: {
            indicator: indicator
        },
        series: [
            {
                name: config.title || `Radar Series`,
                type: 'radar',
                data: seriesData_radar,
                animationDuration: config.animation ? 1500 : 0
            }
        ]
    }
}