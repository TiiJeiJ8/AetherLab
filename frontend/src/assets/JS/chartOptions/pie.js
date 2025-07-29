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

    let angleOption = {};
    if (config.isHalfDonut) {
        angleOption = {
            startAngle: config.startAngle || 180,
            endAngle: config.endAngle || 360
        };
    }
    else {
        angleOption = {
            startAngle: config.startAngle || 0,
            endAngle: config.endAngle || 360
        };
    }

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
                radius: [config.innerRadius || '0%', config.outerRadius || '60%'], // 内半径和外半径
                selectedMode: 'multiple',
                selectedOffset: config.selectedOffset || 30, // 选中偏移量
                data: pieSeries,
                roseType: config.roseType || '', // 南丁格尔玫瑰图类型
                ...angleOption, // 角度配置
                itemStyle: {
                    borderRadius: config.pieBorderRadius || 0, // 圆角
                    borderWidth: config.pieBorderWidth || 0 // 扇区间隙
                    , borderColor: config.pieBorderColor || '' // 扇区边框颜色
                },
                labelLine: {
                    show: config.labelLineVisible !== false, // 是否显示引导线
                    length: config.labelLineLength || 20, // 引导线长度
                    length2: config.labelLineLength2 || 15, // 第二段引导线长度
                    smooth: config.labelLineSmooth || 0, // 是否平滑
                    lineStyle: {
                        color: config.labelLineColor || '', // 引导线颜色
                        width: config.labelLineWidth || 1, // 引导线宽度
                        type: config.labelLineType || 'solid' // 引导线类型
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: config.pieBorderRadius || 0, // 圆角
                        borderWidth: config.pieBorderWidth || 0 // 扇区间隙
                        , borderColor: config.pieBorderColor || '' // 扇区边框颜色
                    }
                },
                animation: animation,
                animationDuration: animation ? 1500 : 0
            }
        ],
        ...customOption
    };
}
