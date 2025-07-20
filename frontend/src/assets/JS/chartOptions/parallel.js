/* eslint-disable */

// 平行坐标系图配置生成器
export default function parallelOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    console.log('[generateEChartOption] xData:', xData);
    console.log('[generateEChartOption] yDataArr:', yDataArr);
    console.log('[generateEChartOption] selectedChartType:', selectedChartType);
    console.log('[generateEChartOption] seriesData:', seriesData);
    console.log('[generateEChartOption] customOption:', customOption);

    // 基础配置
    const option = {
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        parallelAxis: [],
        parallel: {
            left: '5%',
            right: '13%',
            bottom: '10%',
            top: '10%',
            parallelAxisDefault: {
                type: 'value',
                nameLocation: 'end',
                nameGap: 20,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        },
        series: []
    };

    // 添加平行坐标轴
    yDataArr.forEach((yData, index) => {
        option.parallelAxis.push({
            dim: index,
            name: yData.name || `Dimension ${index + 1}`,
            type: 'value'
        });
    });

    // 添加数据系列
    option.series.push({
        type: 'parallel',
        data: seriesData,
        smooth: true,
        lineStyle: {
            width: 2
        }
    });

    // 合并自定义配置
    Object.assign(option, customOption);

    return option;
}