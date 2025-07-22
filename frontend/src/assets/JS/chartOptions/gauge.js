/* eslint-disable */

// 仪表盘配置生成器
export default function gaugeOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const gaugeData = Array.isArray(seriesData)
        ? seriesData
        : (seriesData.name && seriesData.value)
            ? seriesData.name.map((n, i) => ({ name: n, value: seriesData.value[i] }))
            : [];

    // 自动分配 offsetCenter
    const total = gaugeData.length;
    // 横向均分，纵向固定
    const getOffset = idx => {
        const x = -40 + (80 / Math.max(1, total - 1)) * idx; // -40% ~ 40%
        return [`${x}%`, '80%'];
    };
    const getDetailOffset = idx => {
        const x = -40 + (80 / Math.max(1, total - 1)) * idx;
        return [`${x}%`, '95%'];
    };

    const series = gaugeData.map((item, idx) => ({
        name: item.name,
        type: 'gauge',
        title: {
            show: true,
            offsetCenter: getOffset(idx)
        },
        detail: {
            formatter: '{value}',
            offsetCenter: getDetailOffset(idx),
            backgroundColor: 'inherit',
            width: 25,
            height: 14,
            fontSize: 12,
            borderRadius: 5,
        },
        progress: {
            show: true,
            overlap: true,
            roundCap: true
        },
        data: [{ name: item.name, value: item.value }]
    }));

    return {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series
    };
};
