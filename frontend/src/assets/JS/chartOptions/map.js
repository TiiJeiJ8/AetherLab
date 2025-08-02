/* eslint-disable */


/**
 * 地图分为几个小类型：热力填充型、散点型、路径型、饼图型、外部折线图、外部柱状图
 * 需要详细规划
 * 考虑如何实现多种类型图表的选择并实现对应的数据导入映射
*/

import * as echarts from 'echarts';
import { getVisualMapInRangeColor } from '../utils/themeDispatcher';

//! 确保 ECharts 在全局作用域中可用，以便地图文件可以访问
if (typeof window !== 'undefined') {
    window.echarts = echarts;
}
//! 地图 JS 加载缓存，防止重复加载
const loadedMapScripts = new Set();

// 地图注册函数
async function loadMapScript(src) {
    return new Promise((resolve, reject) => {
        if (loadedMapScripts.has(src)) {
            resolve();
            return;
        }

        // 确保 ECharts 已经加载并设置为全局变量
        if (typeof echarts === 'undefined') {
            reject(new Error('ECharts is not loaded'));
            return;
        }

        // 将 ECharts 设置为全局变量，以便地图文件可以访问
        if (typeof window !== 'undefined' && !window.echarts) {
            window.echarts = echarts;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedMapScripts.add(src);
            // 给地图注册一些时间来完成
            setTimeout(() => {
                resolve();
            }, 100);
        };
        script.onerror = (error) => {
            console.error('Failed to load map script:', src, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// 地图注册&验证
async function MapRegister_Validator(mapSourceName, mapFilePath) {
    // 动态加载地图
    if (mapFilePath) {
        try {
            console.log('[mapOption] Loading map script:', mapFilePath);
            await loadMapScript(mapFilePath);

            // 验证地图是否注册成功，最多等待 5 次
            let attempts = 0;
            let mapInfo = null;
            while (attempts < 5 && !mapInfo) {
                await new Promise(resolve => setTimeout(resolve, 100));
                mapInfo = echarts.getMap(mapSourceName);
                attempts++;
                console.log(`[mapOption] Attempt ${attempts}: Check map registration for "${mapSourceName}":`, mapInfo ? 'SUCCESS' : 'FAILED');
            }

            if (!mapInfo) {
                console.error(`[mapOption] Map "${mapSourceName}" failed to register after ${attempts} attempts`);
                return {
                    title: { text: `Map load failed` },
                    graphic: {
                        type: 'text',
                        left: 'center',
                        top: 'middle',
                        style: {
                            text: `Map "${mapSourceName}" register failed\nPlease check map file: ${mapFilePath}`,
                            textAlign: 'center',
                            fill: '#ff4444',
                            fontSize: 14
                        }
                    }
                };
            }

            console.log(`[mapOption] Map "${mapSourceName}" registered successfully`);
        }
        catch (error) {
            console.error('Failed to load map script:', error);
            return {
                title: { text: 'Map Load Error' },
                graphic: {
                    type: 'text',
                    left: 'center',
                    top: 'middle',
                    style: {
                        text: `Map load failed: ${error.message}`,
                        textAlign: 'center',
                        fill: '#ff4444',
                        fontSize: 14
                    }
                }
            };
        }
    }
    else {
        // 检查默认地图是否已经注册
        const mapInfo = echarts.getMap(mapSourceName || 'china');
        if (!mapInfo) {
            console.error('[mapOption] No map path provided and default map not registered');
            return {
                title: { text: 'Map Configuration Error' },
                graphic: {
                    type: 'text',
                    left: 'center',
                    top: 'middle',
                    style: {
                        text: 'Map config ERROR\nMissing the map file path',
                        textAlign: 'center',
                        fill: '#ff4444',
                        fontSize: 14
                    }
                }
            };
        }
    }
}

// 地图配置生成器
export default async function mapOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    let { seriesType, mapSourceName, mapFilePath } = customOption;

    // 地图注册&验证兜底 解决漏加载
    await MapRegister_Validator(mapSourceName, mapFilePath);

    // 获取视觉颜色
    let visualColors = getVisualMapInRangeColor(config.colorScheme);
    // 动态调整 visualMap
    let visualMapOption = {};
    switch (config.legendPosition) {
        case 'bottom':
            visualMapOption = {
                orient: 'horizontal',
                left: 'center',
                bottom: 0
            };
            break;
        case 'top':
            visualMapOption = {
                orient: 'horizontal',
                left: 'center',
                top: 0
            };
            break;
        case 'right':
            visualMapOption = {
                orient: 'vertical',
                right: 0,
                top: 'center'
            };
            break;
        case 'left':
            visualMapOption = {
                orient: 'vertical',
                left: -10,
                top: 'center'
            };
            break;
        default:
            visualMapOption = {
                orient: 'horizontal',
                left: 'center',
                bottom: 0
            };
    }

    // 通用配置
    let option = {
        title: {
            text: config.title || `Chart of Map[${seriesType}]`,
            subtext: config.subtext,
            left: config.titlePosition === 'left' ? 'left'
                : config.titlePosition === 'center' ? 'center'
                    : config.titlePosition === 'right' ? 'right'
                        : 'center', // bottom 也用 center
            top: config.titlePosition === 'bottom' ? 'bottom' : 'top',
            textStyle: { fontSize: 16, fontWeight: 'bold' },
            subtextStyle: { fontSize: 12 }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
    }

    // 根据 seriesType 选择不同的处理逻辑并生成 option
    if (seriesType === 'map') { //* 区域热力型
        return {
            ...option,
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2
            },
            visualMap: {
                type: config.isDiscrete ? 'piecewise' : 'continuous',
                ...(() => {
                    const values = seriesData.map(item => item.value);
                    let min = Math.min(...values);
                    let max = Math.max(...values);
                    if (min === max) {
                        min = min - 1;
                        max = max + 1;
                    }
                    return { min, max };
                })(),
                calculable: true,
                inRange: {
                    color: visualColors
                },
                ...visualMapOption
            },
            series: [{
                name: mapSourceName || 'Map Data',
                type: 'map',
                map: mapSourceName || 'china',
                data: seriesData,
                label: {
                    show: config.labelVisible || false,
                },
                itemStyle: {
                    areaColor: config.areaColor || '#f3f3f3',
                    borderColor: config.borderColor || '#999',
                    borderWidth: config.borderWidth || 0.5
                },
                roam: true,
            }],
        }
    }
    else if (seriesType === 'heatmap') { //* 地理热力型
        return {
            ...option,
            geo: {
                map: mapSourceName || 'china',
                roam: true,
                label: {
                    show: config.labelVisible || false,
                },
                itemStyle: {
                    areaColor: config.areaColor || '#f3f3f3',
                    borderColor: config.borderColor || '#999',
                    borderWidth: config.borderWidth || 0.5
                }
            },
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: function (params) {
                    return `Lng: ${params.value[0]}<br>Lat: ${params.value[1]}<br>Value: ${params.value[2]}`;
                }
            },
            visualMap: {
                type: config.isDiscrete ? 'piecewise' : 'continuous',
                ...(() => {
                    const values = (seriesData || []).map(item => Array.isArray(item.value) ? item.value[2] : undefined);
                    let min = Math.min(...values);
                    let max = Math.max(...values);
                    if (min === max) {
                        min = min - 1;
                        max = max + 1;
                    }
                    return { min, max };
                })(),
                calculable: true,
                inRange: {
                    color: visualColors
                },
                ...visualMapOption
            },
            series: [{
                name: mapSourceName || 'Heatmap Data',
                type: 'heatmap',
                coordinateSystem: 'geo',
                data: seriesData,
                label: {
                    show: config.labelVisible || false,
                },
                emphasis: {
                    show: true,
                },
                roam: true,
                pointSize: config.pointSize || 20, // 热力点像素大小
                blurSize: config.blurSize || 20, // 热力点模糊半径
            }],
        }
    }
    else if (seriesType === 'scatter') { //* 散点型
        // 大小映射逻辑
        const sizeMin = typeof config.sizeMin === 'number' ? config.sizeMin : 10;
        const sizeMax = typeof config.sizeMax === 'number' ? config.sizeMax : 50;
        const enableSizeMapping = !!config.sizeMapping; // 是否启用大小映射
        // 提取所有数值
        const values = (seriesData || []).map(item => Array.isArray(item.value) ? item.value[2] : undefined);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        // 构造带 symbolSize 的 data
        const dataWithSize = (seriesData || []).map(item => {
            const v = Array.isArray(item.value) ? item.value[2] : undefined;
            let size = sizeMin;
            if (enableSizeMapping && minVal !== maxVal && v !== undefined) {
                size = sizeMin + ((v - minVal) / (maxVal - minVal)) * (sizeMax - sizeMin);
            }
            return {
                ...item,
                symbolSize: size
            };
        });
        return {
            ...option,
            geo: {
                map: mapSourceName || 'china',
                roam: true,
                label: {
                    show: config.labelVisible || false,
                },
                itemStyle: {
                    areaColor: config.areaColor || '#f3f3f3',
                    borderColor: config.borderColor || '#999',
                    borderWidth: config.borderWidth || 0.5
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [{
                name: mapSourceName || 'Scatter Data',
                type: config.rippleEffect ? 'effectScatter' : 'scatter',
                rippleEffect: config.rippleEffect ? { brushType: 'stroke' } : undefined,
                coordinateSystem: 'geo',
                geoIndex: 0,
                data: dataWithSize,
                label: {
                    show: config.labelVisible || false,
                },
                emphasis: {
                    show: true,
                },
                roam: true,
                // pointSize/blurSize 可保留用于兼容
                pointSize: config.pointSize || 20,
                blurSize: config.blurSize || 20,
            }],
        }
    }
    else if (seriesType === 'pie') { //* 饼图型

    }
    else if (seriesType === 'bar') { //* 外部条形型

    }
    else if (seriesType === 'lines') { //* 路径型

    }
    else {
        // 兜底
    }
}