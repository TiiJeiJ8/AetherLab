/* eslint-disable */
import ecStat from 'echarts-stat';

/**
 * 散点图高级配置项：
 * 聚合
 * 基础拟合回归线（指数回归、线性回归、多项式回归）
 * 单轴散点图
 * 均值线
 * 系列最高值、最小值
 * 散点图标签顶部/右侧对齐
 * 散点样式（根据系列分配）
 * 视觉映射
 * 大小映射
 * 涟漪图
 * 极坐标系
 * 视觉映射
 * 气泡图
 * 极坐标系
 */

// 散点图 option 生成器
export default function scatterOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
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

    const { yAxis, animation } = config;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    // 处理极坐标
    let usePolar = config.polarStyle && config.polarStyle !== 'none';
    let polar = usePolar ? {
        radius: '70%',
        center: ['50%', '50%']
    } : undefined;
    let angleAxis = undefined;
    let radiusAxis = undefined;
    if (usePolar) {
        angleAxis = {
            startAngle: config.startAngle || 0,
        };
        radiusAxis = {};
    }

    // 散点大小映射：受 sizeMapping 控制
    const sizeMin = typeof config.sizeMin === 'number' ? config.sizeMin : 10;
    const sizeMax = typeof config.sizeMax === 'number' ? config.sizeMax : 50;
    const enableSizeMapping = !!config.sizeMapping;
    // 先生成散点series
    const seriesArr = yArr.map((y, idx) => {
        let coordinateSystem = usePolar ? 'polar' : 'cartesian2d';
        if (config.singleAxisMode === 'x' || config.singleAxisMode === 'y') {
            coordinateSystem = 'singleAxis';
        }
        // labelAlign
        let label = undefined, labelLayout = undefined, labelLine = undefined;
        if (config.labelAlign === 'right') {
            label = {
                show: true,
                position: 'right',
                minMargin: 2,
                formatter: function (param) {
                    return param.data && (param.data[3] || param.name || '');
                }
            };
            labelLayout = {
                align: 'left',
                verticalAlign: 'middle',
                moveOverlap: 'shiftY'
            };
            labelLine = {
                show: true,
                length2: 5,
                lineStyle: { color: '#bbb' }
            };
        } else if (config.labelAlign === 'inside') {
            label = {
                show: true,
                position: config.labelAlign
            };
        }
        // 计算本系列y的最小最大值
        const yVals = yDataArr[idx];
        const minY = Math.min(...yVals);
        const maxY = Math.max(...yVals);
        // 构造带symbolSize的data，是否映射由enableSizeMapping控制
        const dataWithSize = yVals.map(yv => {
            let size = sizeMin;
            if (enableSizeMapping) {
                size = minY === maxY ? sizeMin : (sizeMin + ((yv - minY) / (maxY - minY)) * (sizeMax - sizeMin));
            }
            return {
                value: yv,
                symbolSize: size
            };
        });
        let base = {
            name: y.field,
            type: config.rippleEffect ? 'effectScatter' : 'scatter',
            data: dataWithSize,
            animationDuration: animation ? 1500 : 0,
            label,
            labelLayout,
            labelLine,
            rippleEffect: config.rippleEffect ? { brushType: 'stroke' } : undefined,
            coordinateSystem,
        };
        // 最大/最小值
        if (config.showMaxMin) {
            base.markPoint = {
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            };
        }
        // 均值线
        if (config.showMeanLine) {
            base.markLine = {
                data: [
                    { type: 'average', name: 'Mean' }
                ]
            };
        }
        return base;
    });

    // 再遍历添加回归线series
    yArr.forEach((y, idx) => {
        if (config.trendLine && config.trendLine !== '' && yDataArr[idx] && yDataArr[idx].length > 1) {
            let coordinateSystem = usePolar ? 'polar' : 'cartesian2d';
            if (config.singleAxisMode === 'x' || config.singleAxisMode === 'y') {
                coordinateSystem = 'singleAxis';
            }
            let x = xData && xData.length === yDataArr[idx].length ? xData : yDataArr[idx].map((_, i) => i);
            let points = x.map((xi, i) => [Number(xi), Number(yDataArr[idx][i])])
                .filter(([xi, yi]) => !isNaN(xi) && !isNaN(yi));
            let regType = config.trendLine;
            let regResult;
            if (regType === 'linear') {
                regResult = ecStat.regression('linear', points);
            } else if (regType === 'exponential') {
                regResult = ecStat.regression('exponential', points);
            } else if (regType === 'polynomial') {
                regResult = ecStat.regression('polynomial', points, config.polynomialOrder || 3);
            }
            if (regResult && regResult.points && regResult.points.length > 1) {
                regResult.points.sort((a, b) => a[0] - b[0]);
                seriesArr.push({
                    name: (y.field || 'Trend Line') + ' Regression',
                    type: 'line',
                    data: regResult.points,
                    showSymbol: false,
                    lineStyle: { type: config.trendLineStyle || 'dashed', color: config.trendLineColor || '#888', width: config.trendLineWidth || 2 },
                    symbol: 'none',
                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [
                            {
                                coord: regResult.points[Math.floor(regResult.points.length / 2)],
                                value: regResult.expression,
                                label: {
                                    show: config.trendLineLabelHidden !== true,
                                    position: 'top',
                                    color: config.trendLineColor || '#888',
                                    fontWeight: config.trendLineFontStyle || 'bold',
                                    fontSize: config.trendLineFontSize || 14,
                                    overflow: 'break',
                                    formatter: function () { return regResult.expression; }
                                }
                            }
                        ]
                    },
                    coordinateSystem,
                });
            }
        }
    });

    // 单轴模式
    let singleAxis = undefined;
    let xAxis = undefined, yAxisOpt = undefined;
    if (config.singleAxisMode === 'x') {
        singleAxis = {
            type: 'category',
            data: xData,
            left: 60,
            top: 60,
            right: 60,
            bottom: 60
        };
    } else if (config.singleAxisMode === 'y') {
        singleAxis = {
            type: 'value',
            left: 60,
            top: 60,
            right: 60,
            bottom: 60
        };
    } else {
        xAxis = {
            type: 'category',
            data: xData,
            axisLabel: { interval: 0, rotate: xData.length > 10 ? 45 : 0 },
            splitLine: { show: xGrid },
            name: config.xAxisName || 'X Axis',
        };
        yAxisOpt = {
            type: 'value',
            name: yArr.map(y => y.field).join(','),
            splitLine: { show: yGrid },
            name: config.yAxisName || 'Y Axis',
        };
    }

    // 构造option
    let option = {
        title: {
            text: config.title || '',
            subtext: config.subtext || '',
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center',
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
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        polar,
        angleAxis,
        radiusAxis,
        series: seriesArr,
        animation: animation,
        animationDuration: animation ? 1500 : 0,
        grid: {
            right: 80 // 给右侧留空间，防止标签被裁剪
        },
        ...customOption
    };
    if (config.singleAxisMode === 'x' || config.singleAxisMode === 'y') {
        option.singleAxis = singleAxis;
    } else if (!usePolar) {
        option.xAxis = xAxis;
        option.yAxis = yAxisOpt;
    }
    return option;
}
