/* eslint-disable */
// dataMergeUtils.js
// 多文件数据合并与主键处理工具函数
// 根据不同图表类型，主函数分发到对应的处理器进行数据处理，生成能够绘制图表的数据

/*
关键函数 mergeChartData(config, fileDataMap, nullHandlingType, options)
    参数校验 validateParams
    类型
    图表类型分发器 chartTypeHandlers[type]
    数据提取 getDataRows
    过滤器插件 options.filterPlugin 或 defaultFilterPlugin
    缺失值处理插件 handleNulls (调用 nullHandlingModule 中的具体方法)
    主键合并 如有多文件/多字段，合并主键
    组装seriesData 生成最终用于图表的数据结构
    返回 {xData, yDataArr, mergeType, seriesData}
*/

import mapDispatcher from '../utils/mapDispatcher.js' // 地图文件信息分发器
import LatLonProcessor from './LatLonProcessor.js'; // 经纬度规范化处理器

/**
 * @typedef {Object} AxisConfig
 * @property {string} file - 数据文件名
 * @property {string} field - 字段名
 */

/**
 * @typedef {Object} ChartConfig
 * @property {AxisConfig} [xAxis]
 * @property {AxisConfig|AxisConfig[]} [yAxis]
 * @property {AxisConfig} [category]
 * @property {AxisConfig} [value]
 * @property {Object} [filter]
 * @property {string} [type] - 图表类型，如 'pie', 'line', 'bar' 等
 */

/**
 * @typedef {Object.<string, Array<Object>>} FileDataMap
 */


/**
 * 判断是否有主键（即所有y轴字段的文件都包含x轴字段）
 * @param {AxisConfig} xAxis
 * @param {AxisConfig|AxisConfig[]} yAxis
 * @param {FileDataMap} fileDataMap
 * @returns {boolean}
 */
export function hasPrimaryKey(xAxis, yAxis, fileDataMap) {
    if (!xAxis || !xAxis.field) return false;
    const xField = xAxis.field;
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    return yArr.every(y => {
        const yFileData = fileDataMap[y.file];
        return yFileData && yFileData.length > 0 && yFileData[0].hasOwnProperty(xField);
    });
}


// ---------------- 通用数据处理工具函数 ----------------

/**
 * 提取数据并去掉标题行
 * @param {FileDataMap} fileDataMap
 * @param {string} file
 * @returns {Array<Object>}
 */
function getDataRows(fileDataMap, file) {
    return (fileDataMap[file] || []).slice(1);
}

/**
 * 通用缺失值处理器分发
 * @param {string} type
 * @param {Array} arr
 * @param {Object} nullHandlingModule
 * @returns {Array}
 */
function handleNulls(type, arr, nullHandlingModule) {
    if (!type || type === 'ignore') return arr;
    const handler = nullHandlingModule[type] || nullHandlingModule.ignoreNull;
    return handler(arr);
}

/**
 * 参数校验
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 */
function validateParams(config, fileDataMap) {
    if (!config || typeof config !== 'object') throw new Error('config must be an object');
    if (!fileDataMap || typeof fileDataMap !== 'object') throw new Error('fileDataMap must be an object');
}

// ---------------- 过滤器插件化 ----------------

/**
 * 过滤器插件，默认实现
 * @param {Array} rows
 * @param {Object} filters
 * @returns {Array}
 */
export function defaultFilterPlugin(rows, filters) {
    if (!filters || !filters.filters || !Array.isArray(filters.filters) || filters.filters.length === 0) return rows;
    const logic = filters.logic || 'AND';
    const conds = filters.filters || [];
    console.log('[defaultFilterPlugin] Applying filters:', conds);
    if (conds.length === 0) return rows;
    return rows.filter(row => {
        const results = conds.map(f => {
            const val = row[f.field];
            switch (f.type) {
                case 'integer': {
                    console.log(`[defaultFilterPlugin] Checking integer field ${f.field} with value ${val}`);
                    const num = parseFloat(val);
                    const cmp = parseFloat(f.value);
                    if (f.operator === 'eq') return num === cmp;
                    if (f.operator === 'ne') return num !== cmp;
                    if (f.operator === 'gt') return num > cmp;
                    if (f.operator === 'ge') return num >= cmp;
                    if (f.operator === 'lt') return num < cmp;
                    if (f.operator === 'le') return num <= cmp;
                    return true;
                }
                case 'string': {
                    console.log(`[defaultFilterPlugin] Checking string field ${f.field} with value ${val}`);
                    const str = String(val ?? '');
                    const cmp = String(f.value ?? '');
                    if (f.operator === 'eq') return str === cmp;
                    if (f.operator === 'ne') return str !== cmp;
                    if (f.operator === 'contains') return str.includes(cmp);
                    if (f.operator === 'notcontains') return !str.includes(cmp);
                    if (f.operator === 'startsWith') return str.startsWith(cmp);
                    if (f.operator === 'endsWith') return str.endsWith(cmp);
                    return true;
                }
                case 'category': {
                    console.log(`[defaultFilterPlugin] Checking category field ${f.field} with value ${val}`);
                    if (f.operator === 'eq') return val === f.value;
                    if (f.operator === 'ne') return val !== f.value;
                    if (f.operator === 'in') return Array.isArray(f.value) ? f.value.includes(val) : false;
                    if (f.operator === 'notin') return Array.isArray(f.value) ? !f.value.includes(val) : false;
                    return true;
                }
                case 'boolean': {
                    console.log(`[defaultFilterPlugin] Checking boolean field ${f.field} with value ${val}`);
                    const boolVal = val === true || val === 'true' || val === 1 || val === '1';
                    const cmp = f.value === true || f.value === 'true' || f.value === 1 || f.value === '1';
                    if (f.operator === 'eq') return boolVal === cmp;
                    if (f.operator === 'ne') return boolVal !== cmp;
                    return true;
                }
                case 'date': {
                    console.log(`[defaultFilterPlugin] Checking date field ${f.field} with value ${val}`);
                    const dateVal = new Date(val).getTime();
                    const cmp = new Date(f.value).getTime();
                    if (f.operator === 'eq') return dateVal === cmp;
                    if (f.operator === 'ne') return dateVal !== cmp;
                    if (f.operator === 'before') return dateVal < cmp;
                    if (f.operator === 'after') return dateVal > cmp;
                    return true;
                }
                default:
                    return true;
            }
        });
        return logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
    });
}

import BoxplotChartIcon from '../../../components/svg/BoxplotChartIcon.vue';
/**
 * 合并多文件数据，返回 { xData, yDataArr, mergeType, seriesData }
 * @param {Object} config - chartConfig
 * @param {Object} fileDataMap - 文件名到对象数组的映射
 * @returns {Object}
 */

import * as nullHandling from './nullHandling.js';

// ---------------- 图表类型处理器 ----------------

// 调试输入函数
function debugInput(config, fileDataMap, options) {
    console.log('[--debugInput {Chart Type Processor}--] config:', config);
    console.log('[--debugInput {Chart Type Processor}--] fileDataMap:', fileDataMap);
    console.log('[--debugInput {Chart Type Processor}--] options:', options);
}

// 调试输出函数
function debugOutput(series) {
    // 遍历 series 中的所有项目
    series.forEach((item, index) => {
        console.log(`[--debugOutput {Chart Type Processor}--] ${index}:`, item);
    });
}

/**
 * 通用 x/y 图表（如折线、柱状等）数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function xyChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    let { nullHandlingType = 'ignore', nullHandlingModule = nullHandling, filterPlugin = defaultFilterPlugin } = options;
    let { xAxis, yAxis } = config;
    let mainData = getDataRows(fileDataMap, xAxis.file);
    // 优先使用config.isAggregate，否则用options.isAggregate，默认true
    let isAggregate = typeof config.isAggregate === 'boolean' ? config.isAggregate : (typeof options.isAggregate === 'boolean' ? options.isAggregate : true);
    let aggregateFn = options.aggregateFn;
    // 应用过滤
    if (config.filter && config.filter.filters && config.filter.filters.length) {
        mainData = filterPlugin(mainData, config.filter);
    }
    // 只过滤空行，不去重
    mainData = mainData.filter(row => {
        const key = row[xAxis.field];
        return key !== undefined && key !== null && key !== '';
    });
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    if (isAggregate) {
        // 按 name 分组聚合，可自定义聚合方式
        const groupMap = new Map(); // key: name, value: [ [y1, y2, ...], [y1, y2, ...], ... ]
        for (const row of mainData) {
            const key = row[xAxis.field];
            if (!groupMap.has(key)) {
                groupMap.set(key, yArr.map(() => []));
            }
            yArr.forEach((y, idx) => {
                const rawVal = row[y.field];
                const parsedVal = parseFloat(rawVal);
                // console.log(`[xyChartHandler] key=${key}, rawVal=${rawVal}, parsedVal=${parsedVal}`);
                if (rawVal !== null && rawVal !== undefined && rawVal !== '' && !Number.isNaN(parsedVal)) {
                    groupMap.get(key)[idx].push(parsedVal);
                }
            });
        }
        const xData = Array.from(groupMap.keys());
        // 默认聚合函数为累加
        const defaultAggregate = arr => arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0);
        const aggFn = typeof aggregateFn === 'function' ? aggregateFn : defaultAggregate;
        let yDataArr = yArr.map((y, idx) => xData.map(name => aggFn(groupMap.get(name)[idx])));

        // 应用缺失值处理
        if (nullHandlingType && nullHandlingType !== 'ignore') {
            yDataArr = yDataArr.map(arr => handleNulls(nullHandlingType, arr, nullHandlingModule));
        }

        return { xData, yDataArr, mergeType: 'groupByName', seriesData: [] };
    } else {
        // 返回原始未聚合数据
        const xData = mainData.map(row => row[xAxis.field]);
        let yDataArr = yArr.map(y => mainData.map(row => {
            const rawVal = row[y.field];
            const parsedVal = parseFloat(rawVal);
            return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
        }));

        // 应用缺失值处理
        if (nullHandlingType && nullHandlingType !== 'ignore') {
            yDataArr = yDataArr.map(arr => handleNulls(nullHandlingType, arr, nullHandlingModule));
        }

        return { xData, yDataArr, mergeType: 'raw', seriesData: [] };
    }
}

/**
 * 饼图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function pieChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { filterPlugin = defaultFilterPlugin } = options;
    let dataRows = getDataRows(fileDataMap, config.value.file);
    // 应用过滤
    if (config.filter && config.filter.filters && config.filter.filters.length) {
        dataRows = filterPlugin(dataRows, config.filter);
    }
    const len = dataRows.length;
    const result = [];
    for (let i = 0; i < len; i++) {
        const name = dataRows[i][config.category.field];
        const rawVal = dataRows[i][config.value.field];
        const parsedVal = parseFloat(rawVal);
        const val = (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
        if (name !== undefined && name !== null && name !== '') {
            result.push({ name, value: val });
        }
    }
    return { xData: [], yDataArr: [], mergeType: 'pie', seriesData: result };
}

/**
 * 地图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function mapChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options);
    let seriesType = config.seriesType || 'map';
    let { mapType, mapSourceName, mapSourceUrl } = config;

    let isCustom = mapType == 'custom';
    let mapFile = null;

    if (isCustom) {
        if (mapSourceUrl == undefined) {
            if (mapSourceName == undefined) {
                console.warn('[mapChartHandler] No mapSourceUrl or mapSourceName provided, using default map script.');
                mapFile = mapDispatcher('china'); // 默认中国地图
            } else {
                mapFile = mapDispatcher(mapSourceName);
            }
        } else {
            //todo ...外部JSON逻辑...
        }
    } else {
        mapFile = mapDispatcher(mapType);
    }

    // 组装地图JS路径和注册名（中文）
    let mapFilePath = '';
    let mapRegisterName = '';
    if (mapFile) {
        mapFilePath = `/maps/${mapFile.source}/${mapFile.file}`;
        mapRegisterName = mapFile.origin || mapType;
        //! 调试
        // console.log(`[mapChartHandler] Map file path: `, mapFilePath);
        // console.log(`[mapChartHandler] Map register name: `, mapRegisterName);
    }

    // 根据seriesType分发地图图表类型
    if (seriesType === 'map') { //* 区域热力型
        let { nameField = {}, value } = config;
        let dataRow = getDataRows(fileDataMap, value.file);
        // 增加过滤器支持
        const filterPlugin = options.filterPlugin || defaultFilterPlugin;
        if (config.filter && config.filter.filters && config.filter.filters.length) {
            dataRow = filterPlugin(dataRow, config.filter);
        }

        let nameFieldRow = [];
        if (nameField) {
            nameFieldRow = dataRow.map(row => row[nameField.field]);
        }
        let valueFieldRow = dataRow.map(row => row[value.field]);

        const seriesData = [];
        nameFieldRow.forEach((name, i) => {
            seriesData.push({
                name: name,
                value: valueFieldRow[i]
            });
        });

        return {
            xData: [],
            yDataArr: [],
            mergeType: 'map',
            seriesData: seriesData,
            customOption: {
                seriesType,
                mapSourceName: mapRegisterName, // 用于注册的中文名
                mapFilePath
            }
        };
    }
    else if (seriesType === 'heatmap') { //* 地理热力型
        let { lngField = {}, latField = {}, value } = config;
        let dataRow = getDataRows(fileDataMap, value.file);

        // 增加过滤器支持
        const filterPlugin = options.filterPlugin || defaultFilterPlugin;
        if (config.filter && config.filter.filters && config.filter.filters.length) {
            dataRow = filterPlugin(dataRow, config.filter);
        }

        // 获取数据行
        let latFieldRow = [];
        let lngFieldRow = [];
        if (lngField && latField && lngField.field && latField.field) {
            // 确保经纬度字段存在
            latFieldRow = dataRow.map(row => row[latField.field]);
            lngFieldRow = dataRow.map(row => row[lngField.field]);

            // 处理经纬度格式
            lngFieldRow = LatLonProcessor(lngFieldRow, latFieldRow).lngArr;
            latFieldRow = LatLonProcessor(lngFieldRow, latFieldRow).latArr;

            if (latFieldRow == null || lngFieldRow == null) {
                console.warn(`[mapChartHandler] latFieldRow and lngFieldRow length mismatch: ${latFieldRow} vs ${lngFieldRow}`);
                return {
                    xData: [], yDataArr: [], mergeType: 'map', seriesData: [],
                    customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
                };
            }
        }
        let valueFieldRow = dataRow.map(row => row[value.field]);

        const seriesData = [];
        for (let i = 0; i < dataRow.length; i++) {
            const lng = lngFieldRow[i];
            const lat = latFieldRow[i];
            const val = valueFieldRow[i];
            seriesData.push({ value: [lng, lat, val] });
        }

        return {
            xData: [], yDataArr: [], mergeType: 'map', seriesData: seriesData,
            customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
        };
    }
    else if (seriesType === 'scatter') { //* 散点型
        let { lngField = {}, latField = {}, name = {}, value } = config;
        let dataRow = getDataRows(fileDataMap, value.file);

        // 增加过滤器支持
        const filterPlugin = options.filterPlugin || defaultFilterPlugin;
        if (config.filter && config.filter.filters && config.filter.filters.length) {
            dataRow = filterPlugin(dataRow, config.filter);
        }

        // 获取数据行
        let latFieldRow = [];
        let lngFieldRow = [];
        let nameFieldRow = [];
        if (lngField && latField && lngField.field && latField.field) {
            // 确保经纬度字段存在
            latFieldRow = dataRow.map(row => row[latField.field]);
            lngFieldRow = dataRow.map(row => row[lngField.field]);

            // 处理经纬度格式
            lngFieldRow = LatLonProcessor(lngFieldRow, latFieldRow).lngArr;
            latFieldRow = LatLonProcessor(lngFieldRow, latFieldRow).latArr;

            if (latFieldRow == null || lngFieldRow == null) {
                console.warn(`[mapChartHandler] latFieldRow and lngFieldRow length mismatch: ${latFieldRow} vs ${lngFieldRow}`);
                return {
                    xData: [], yDataArr: [], mergeType: 'map', seriesData: [],
                    customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
                };
            }
        }

        if (name && name.field) {
            nameFieldRow = dataRow.map(row => row[name.field]);
        }

        let valueFieldRow = dataRow.map(row => row[value.field]);

        const seriesData = [];
        for (let i = 0; i < dataRow.length; i++) {
            const lng = lngFieldRow[i];
            const lat = latFieldRow[i];
            const val = valueFieldRow[i];
            seriesData.push({ value: [lng, lat, val] });
        }

        return {
            xData: [], yDataArr: [], mergeType: 'map', seriesData: seriesData,
            customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath, nameFieldRow }
        };
    }
    else if (seriesType === 'pie') { //* 饼图型
        let { lngField = {}, latField = {}, nameField = {}, value, categoryField = {} } = config;
        const { filterPlugin = defaultFilterPlugin } = config;
        let dataRow = getDataRows(fileDataMap, config.value.file);
        // 应用过滤器
        if (config.filter && config.filter.filters && config.filter.filters.length) {
            dataRow = filterPlugin(dataRow, config.filter);
        }

        // 获取数据行
        let latFieldRow = [];
        let lngFieldRow = [];
        let nameFieldRow = [];
        let categoryFieldRow = [];
        if (lngField && latField && lngField.field && latField.field) {
            // 确保经纬度字段存在
            latFieldRow = dataRow.map(row => row[latField.field]);
            lngFieldRow = dataRow.map(row => row[lngField.field]);

            // 处理经纬度格式
            lngFieldRow = LatLonProcessor(lngFieldRow, latFieldRow).lngArr;
            latFieldRow = LatLonProcessor(lngFieldRow, latFieldRow).latArr;

            if (latFieldRow == null || lngFieldRow == null) {
                console.warn(`[mapChartHandler] latFieldRow and lngFieldRow length mismatch: ${latFieldRow} vs ${lngFieldRow}`);
                return {
                    xData: [], yDataArr: [], mergeType: 'map', seriesData: [],
                    customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
                };
            }
        }

        if (nameField && nameField.field) {
            nameFieldRow = dataRow.map(row => row[nameField.field]);
        }

        if (categoryField && categoryField.field) {
            categoryFieldRow = dataRow.map(row => row[categoryField.field]);
        }

        console.log('----------------', categoryFieldRow)

        let valueFieldRow = dataRow.map(row => row[value.field]);

        // 分组：每个 name 一个饼图，饼图内是各 category 的扇区
        const pieGroups = {}; // name -> { coord, data: [{name: category, value}] }
        for (let i = 0; i < dataRow.length; i++) {
            const name = nameFieldRow[i];
            const category = categoryFieldRow[i];
            const val = Number(valueFieldRow[i]);
            const lng = lngFieldRow[i];
            const lat = latFieldRow[i];
            if (!pieGroups[name]) {
                pieGroups[name] = {
                    coord: [lng, lat],
                    data: []
                };
            }
            pieGroups[name].data.push({ name: category, value: val });
        }
        // 组装 seriesData 和 positionData
        const seriesData = Object.values(pieGroups).map(group => group.data);
        const positionData = Object.values(pieGroups).map(group => ({ value: group.coord }));

        return {
            xData: [], yDataArr: [], mergeType: 'map', seriesData: seriesData,
            customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath, positionData }
        };
    }
    else if (seriesType === 'bar') { //* 外部条形型
        return {
            xData: [], yDataArr: [], mergeType: 'map', seriesData: [],
            customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
        };
    }
    else if (seriesType === 'lines') { //* 路径型
        return {
            xData: [], yDataArr: [], mergeType: 'map', seriesData: [],
            customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
        };
    }
    else { // 兜底
        console.warn(`[mapChartHandler] Unsupported seriesType: ${seriesType}`);
        return {
            xData: [], yDataArr: [], mergeType: 'map', seriesData: [],
            customOption: { seriesType, mapSourceName: mapRegisterName, mapFilePath }
        };
    }
}

/**
 * K线图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function candlestickChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { nullHandlingType = 'ignore', nullHandlingModule = nullHandling, filterPlugin = defaultFilterPlugin } = options;
    const { time, open, close, high, low, filter } = config;
    // 提取主文件数据
    let mainData = getDataRows(fileDataMap, time.file);
    if (filter && filter.filters && filter.filters.length) {
        mainData = filterPlugin(mainData, filter);
    }
    // 按时间字段排序
    mainData.sort((a, b) => {
        if (a[time.field] < b[time.field]) return -1;
        if (a[time.field] > b[time.field]) return 1;
        return 0;
    });
    // 组装 xData 和 seriesData
    const xData = mainData.map(row => row[time.field]);
    const seriesData = mainData.map(row => {
        const o = parseFloat(row[open.field]);
        const c = parseFloat(row[close.field]);
        const h = parseFloat(row[high.field]);
        const l = parseFloat(row[low.field]);
        // 缺失值处理
        const arr = [o, c, l, h].map(v => (v === null || v === undefined || v === '' || Number.isNaN(v)) ? null : v);
        return handleNulls(nullHandlingType, arr, nullHandlingModule);
    });
    return { xData, yDataArr: [seriesData], mergeType: 'candlestick', seriesData };
}

/**
 * 热力图数据处理器（主键合并，一一对应）
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function heatmapChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { xAxis, yAxis, value } = config;
    // 获取所有数据行
    const xRows = getDataRows(fileDataMap, xAxis.file);
    const yRows = getDataRows(fileDataMap, yAxis.file);
    const valRows = getDataRows(fileDataMap, value.file);

    // 收集所有x、y的取值（类别）
    const xSet = new Set(xRows.map(row => row[xAxis.field]));
    const ySet = new Set(yRows.map(row => row[yAxis.field]));
    const xData = Array.from(xSet);
    const yData = Array.from(ySet);

    // 构建value映射
    const valueMap = new Map();
    valRows.forEach(row => {
        // 优先用valRows里的x/y字段，否则用xRows/yRows索引补齐
        const x = row[xAxis.field] !== undefined ? row[xAxis.field] : null;
        const y = row[yAxis.field] !== undefined ? row[yAxis.field] : null;
        if (x !== null && y !== null) {
            const key = `${x}|${y}`;
            valueMap.set(key, row[value.field]);
        }
    });

    // 生成 seriesData，补齐所有 (x, y) 组合
    const seriesData = [];
    yData.forEach(y => {
        xData.forEach(x => {
            const key = `${x}|${y}`;
            const v = valueMap.has(key) ? valueMap.get(key) : null;
            seriesData.push([x, y, v]);
        });
    });
    return { xData, yData, mergeType: 'heatmap', seriesData };
}


/**
 * 雷达图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function radarChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { indicator, value, name } = config;

    // 维度配置
    const indicators = indicator.map(item => {
        const rows = getDataRows(fileDataMap, item.file);
        const values = rows.map(row => row[item.field]).filter(v => v !== undefined && v !== null);
        const max = Math.ceil(Math.max(...values.map(v => Number(v))) * 1.2); // 乘以安全系数
        return {
            name: item.field,
            max: max || 100
        };
    });

    // 系列数据
    const nameRows = getDataRows(fileDataMap, name.file);
    const seriesData = nameRows.map(row => {
        const values = value.map(item => row[item.field]);
        return {
            name: row[name.field],
            value: values
        };
    });

    // 先封装传输
    const RadarPack = {
        indicator: indicators,
        seriesData_radar: seriesData,
    }
    return { xData: [], yData: [], mergeType: 'radar', seriesData: RadarPack };
}

/**
 * 箱线图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function boxplotChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    // 解析配置
    const { category, series, value, min, q1, median, q3, max } = config;
    // 获取数据行
    const catRows = getDataRows(fileDataMap, category.file);
    const seriesRows = series ? getDataRows(fileDataMap, series.file) : null;
    // 收集所有分组和系列
    const xData = Array.from(new Set(catRows.map(row => row[category.field])));
    let seriesList = seriesRows ? Array.from(new Set(seriesRows.map(row => row[series.field]))) : null;
    if (!seriesList || seriesList.length === 0) seriesList = ['default'];

    let useValue = !!value;
    let valArrs = [];
    if (useValue) {
        if (Array.isArray(value)) {
            valArrs = value.map(v => getDataRows(fileDataMap, v.file).map(row => parseFloat(row[v.field])));
        } else {
            valArrs = [getDataRows(fileDataMap, value.file).map(row => parseFloat(row[value.field]))];
        }
    }

    // 构建分组：series -> category -> [values]
    const groupMap = new Map(); // key: series, value: Map(category, [values])
    catRows.forEach((row, idx) => {
        const cat = row[category.field];
        const ser = (seriesRows && seriesRows[idx] && series.field) ? seriesRows[idx][series.field] : 'default';
        if (!groupMap.has(ser)) groupMap.set(ser, new Map());
        const catMap = groupMap.get(ser);
        if (!catMap.has(cat)) catMap.set(cat, []);
        if (useValue) {
            valArrs.forEach(arr => {
                if (arr[idx] !== undefined && !Number.isNaN(arr[idx])) {
                    catMap.get(cat).push(arr[idx]);
                }
            });
        }
    });

    // 计算统计量
    function calcBoxStats(arr) {
        if (!arr || arr.length === 0) return [null, null, null, null, null];
        const sorted = arr.slice().sort((a, b) => a - b);
        const minV = sorted[0];
        const maxV = sorted[sorted.length - 1];
        const medianV = quantile(sorted, 0.5);
        const q1V = quantile(sorted, 0.25);
        const q3V = quantile(sorted, 0.75);
        return [minV, q1V, medianV, q3V, maxV];
    }
    function quantile(arr, q) {
        const pos = (arr.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (arr[base + 1] !== undefined) {
            return arr[base] + rest * (arr[base + 1] - arr[base]);
        } else {
            return arr[base];
        }
    }

    // 计算异常值（outlier）
    function calcOutliers(arr, stats) {
        if (!arr || arr.length === 0) return [];
        const [min, q1, median, q3, max] = stats;
        // 1.5倍四分位距法
        const IQR = q3 - q1;
        const lower = q1 - 1.5 * IQR;
        const upper = q3 + 1.5 * IQR;
        return arr.filter(v => v < lower || v > upper);
    }

    // 组装 seriesData: 每个系列一个数组，数组顺序与 xData一致
    let seriesData, outlierData;
    if (useValue) {
        // 自动计算五数和异常值
        seriesData = seriesList.map(ser => {
            const catMap = groupMap.get(ser) || new Map();
            return xData.map(cat => calcBoxStats(catMap.get(cat) || []));
        });
        // 计算异常值
        outlierData = seriesList.map(ser => {
            const catMap = groupMap.get(ser) || new Map();
            return xData.flatMap((cat, catIdx) => {
                const arr = catMap.get(cat) || [];
                const stats = seriesData[seriesList.indexOf(ser)][catIdx];
                const outliers = calcOutliers(arr, stats);
                // 返回 [x轴索引, 异常值]，ECharts scatter 需要这种格式
                return outliers.map(v => [catIdx, v]);
            });
        });
    } else {
        // 直接读取五数
        const minRows = min ? getDataRows(fileDataMap, min.file) : null;
        const q1Rows = q1 ? getDataRows(fileDataMap, q1.file) : null;
        const medianRows = median ? getDataRows(fileDataMap, median.file) : null;
        const q3Rows = q3 ? getDataRows(fileDataMap, q3.file) : null;
        const maxRows = max ? getDataRows(fileDataMap, max.file) : null;
        seriesData = seriesList.map(ser => {
            return xData.map((cat, idx) => {
                let rowIdx = -1;
                for (let i = 0; i < catRows.length; i++) {
                    const catVal = catRows[i][category.field];
                    const serVal = seriesRows ? seriesRows[i][series.field] : 'default';
                    if (catVal === cat && serVal === ser) {
                        rowIdx = i;
                        break;
                    }
                }
                if (rowIdx === -1) return [null, null, null, null, null];
                return [
                    minRows ? parseFloat(minRows[rowIdx][min.field]) : null,
                    q1Rows ? parseFloat(q1Rows[rowIdx][q1.field]) : null,
                    medianRows ? parseFloat(medianRows[rowIdx][median.field]) : null,
                    q3Rows ? parseFloat(q3Rows[rowIdx][q3.field]) : null,
                    maxRows ? parseFloat(maxRows[rowIdx][max.field]) : null
                ];
            });
        });
        // 无法自动计算异常值
        outlierData = seriesList.map(() => []);
    }

    const boxplotPack = {
        seriesList: seriesList,
        seriesData_boxplot: seriesData,
        outlierData: outlierData
    }

    return {
        xData,
        yDataArr: [],
        mergeType: 'boxplot',
        seriesData: boxplotPack
    };
}

/**
 * 关系图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function graphChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options);
    const { nodeID, nodeName, nodeValue, nodeCategory, edgeSource, edgeTarget, edgeWeight } = config;

    // 必填字段校验
    if (!nodeID || !nodeID.file || !nodeID.field) throw new Error('nodeID为必填项');
    if (!edgeSource || !edgeSource.file || !edgeSource.field) throw new Error('edgeSource为必填项');
    if (!edgeTarget || !edgeTarget.file || !edgeTarget.field) throw new Error('edgeTarget为必填项');

    //获取数据行
    const nodeIDRows = getDataRows(fileDataMap, nodeID.file);
    const nodeNameRows = nodeName && nodeName.file ? getDataRows(fileDataMap, nodeName.file) : [];
    const nodeValueRows = nodeValue && nodeValue.file ? getDataRows(fileDataMap, nodeValue.file) : [];
    const nodeCategoryRows = nodeCategory && nodeCategory.file ? getDataRows(fileDataMap, nodeCategory.file) : [];
    const edgeSourceRows = getDataRows(fileDataMap, edgeSource.file);
    const edgeTargetRows = getDataRows(fileDataMap, edgeTarget.file);
    const edgeWeightRows = edgeWeight && edgeWeight.file ? getDataRows(fileDataMap, edgeWeight.file) : [];

    // 节点去重，只保留每个id的第一个节点
    const nodes = [];
    const nodeSet = new Set();
    nodeIDRows.forEach((row, idx) => {
        const id = row[nodeID.field];
        if (id !== undefined && id !== null && id !== '' && !nodeSet.has(id)) {
            const name = (nodeNameRows[idx] && nodeName && nodeName.field) ? nodeNameRows[idx][nodeName.field] : id;
            const value = (nodeValueRows[idx] && nodeValue && nodeValue.field) ? parseFloat(nodeValueRows[idx][nodeValue.field]) : 1;
            const category = (nodeCategoryRows[idx] && nodeCategory && nodeCategory.field) ? nodeCategoryRows[idx][nodeCategory.field] : '';
            const node = { id };
            if (name !== undefined) node.name = name;
            if (value !== undefined) node.value = value;
            if (category !== undefined) node.category = category;
            nodes.push(node);
            nodeSet.add(id);
        }
    });

    // 生成边数据，source/target直接用id字符串
    const edges = [];
    edgeSourceRows.forEach((row, idx) => {
        const source = row[edgeSource.field];
        const target = edgeTargetRows[idx] ? edgeTargetRows[idx][edgeTarget.field] : undefined;
        const weight = (edgeWeightRows[idx] && edgeWeight && edgeWeight.field) ? parseFloat(edgeWeightRows[idx][edgeWeight.field]) : 1;
        if (source !== undefined && source !== null && source !== '' &&
            target !== undefined && target !== null && target !== '') {
            const edge = { source: String(source), target: String(target) };
            if (!isNaN(weight)) edge.weight = weight;
            edges.push(edge);
        }
    });

    // 打包
    const graphPack = {
        nodes: nodes,
        edges: edges
    };

    return {
        xData: [],
        yDataArr: [],
        mergeType: 'graph',
        seriesData: graphPack,
    };
}

/**
 * 树图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function treeChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { nodeID, nodeName, parentID, parentName, nodeValue, path } = config;
    // 合理判定：有 nodeID 和 parentID 字段
    const isValid = nodeID && nodeID.file && nodeID.field && parentID && parentID.file && parentID.field;

    // 平铺模式处理
    if (isValid) {
        const nodeIDRows = getDataRows(fileDataMap, nodeID.file);
        const nodeNameRows = nodeName && nodeName.file ? getDataRows(fileDataMap, nodeName.file) : [];
        const parentIDRows = getDataRows(fileDataMap, parentID.file);
        const parentNameRows = parentName && parentName.file ? getDataRows(fileDataMap, parentName.file) : [];
        const nodeValueRows = nodeValue && nodeValue.file ? getDataRows(fileDataMap, nodeValue.file) : [];

        // 构建节点映射
        const nodeMap = new Map();
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            if (!id) return;
            const name = nodeNameRows[idx] && nodeName && nodeName.field ? nodeNameRows[idx][nodeName.field] : id;
            const value = nodeValueRows[idx] && nodeValue && nodeValue.field ? parseFloat(nodeValueRows[idx][nodeValue.field]) : undefined;
            nodeMap.set(id, {
                id,
                name,
                value,
                children: []
            });
        });

        // 构建树结构
        let rootNodes = [];
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            const parentId = parentIDRows[idx] ? parentIDRows[idx][parentID.field] : undefined;
            if (!parentId || !nodeMap.has(parentId)) {
                // 没有父节点，认为是根节点
                rootNodes.push(nodeMap.get(id));
            } else {
                nodeMap.get(parentId).children.push(nodeMap.get(id));
            }
        });

        // 只返回根节点数组
        return {
            xData: [],
            yDataArr: [],
            mergeType: 'tree',
            seriesData: rootNodes
        };
    }

    // 兜底
    return {
        xData: [],
        yDataArr: [],
        mergeType: 'tree',
        seriesData: []
    };
}

/**
 * 矩形树图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function treemapChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { nodeID, nodeName, parentID, parentName, nodeValue } = config;
    // 判定数据是否有效
    const isValid = nodeID && nodeID.file && nodeID.field && parentID && parentID.file && parentID.field;

    if (isValid) {
        const nodeIDRows = getDataRows(fileDataMap, nodeID.file);
        const nodeNameRows = nodeName && nodeName.file ? getDataRows(fileDataMap, nodeName.file) : [];
        const parentIDRows = getDataRows(fileDataMap, parentID.file);
        const parentNameRows = parentName && parentName.file ? getDataRows(fileDataMap, parentName.file) : [];
        const nodeValueRows = nodeValue && nodeValue.file ? getDataRows(fileDataMap, nodeValue.file) : [];

        // 构建节点映射
        const nodeMap = new Map();
        // 先收集所有 parentId，便于后续层级计算
        const parentIdSet = new Set();
        parentIDRows.forEach(row => {
            if (row && parentID && parentID.field) {
                const pid = row[parentID.field];
                if (pid) parentIdSet.add(pid);
            }
        });

        // 计算每个节点的层级（根节点为1，子节点依次+1）
        function getLevel(id, cache = {}) {
            if (cache[id]) return cache[id];
            let level = 1;
            let currentId = id;
            let idx = nodeIDRows.findIndex(row => row[nodeID.field] === currentId);
            while (idx !== -1) {
                const parentId = parentIDRows[idx] ? parentIDRows[idx][parentID.field] : undefined;
                if (!parentId || !nodeMap.has(parentId)) break;
                level++;
                currentId = parentId;
                idx = nodeIDRows.findIndex(row => row[nodeID.field] === currentId);
            }
            cache[id] = level;
            return level;
        }

        // 统计最大层级
        let maxLevel = 1;
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            const level = getLevel(id);
            if (level > maxLevel) maxLevel = level;
        });

        // 构建节点，value 按层级递减（根节点最大，叶子最小）
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            if (!id) return;
            const name = nodeNameRows[idx] && nodeName && nodeName.field ? nodeNameRows[idx][nodeName.field] : id;
            let value = nodeValueRows[idx] && nodeValue && nodeValue.field ? parseFloat(nodeValueRows[idx][nodeValue.field]) : undefined;
            // 层级递减赋值，根节点 value = maxLevel，下一层 maxLevel-1，依次类推
            if (value === undefined || value === null || isNaN(value)) {
                const level = getLevel(id);
                value = Math.max(1, maxLevel - level + 1);
            }
            nodeMap.set(id, {
                id,
                name,
                value,
                children: []
            });
        });

        // 构建树结构
        let rootNodes = [];
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            const parentId = parentIDRows[idx] ? parentIDRows[idx][parentID.field] : undefined;
            if (!parentId || !nodeMap.has(parentId)) {
                // 没有父节点，认为是根节点
                rootNodes.push(nodeMap.get(id));
            } else {
                nodeMap.get(parentId).children.push(nodeMap.get(id));
            }
        });

        // 递归获取最大层级
        function getMaxDepth(nodes, depth) {
            if (!nodes || nodes.length === 0) return depth;
            let max = depth;
            for (let i = 0; i < nodes.length; i++) {
                max = Math.max(max, getMaxDepth(nodes[i].children, depth + 1));
            }
            return max;
        }
        const maxDepth = getMaxDepth(rootNodes, 1);

        // 递归分配 value：有原始 value 则保留，无则自动分配
        function assignValue(nodes) {
            if (!nodes) return 0;
            for (let i = 0; i < nodes.length; i++) {
                if (!nodes[i].children || nodes[i].children.length === 0) {
                    if (nodes[i].value === undefined || nodes[i].value === null || isNaN(nodes[i].value)) {
                        nodes[i].value = 1;
                    }
                } else {
                    if (nodes[i].value === undefined || nodes[i].value === null || isNaN(nodes[i].value)) {
                        nodes[i].value = assignValue(nodes[i].children);
                    } else {
                        // 有 value 时，仍需递归处理子节点
                        assignValue(nodes[i].children);
                    }
                }
            }
            // 返回所有节点 value 之和
            return nodes.reduce((sum, node) => sum + (node.value || 0), 0);
        }
        assignValue(rootNodes);

        // Treemap 要求每个节点有 value, 非叶子节点 value 可为 undefined
        return {
            xData: [],
            yDataArr: [],
            mergeType: 'treemap',
            seriesData: rootNodes
        };
    }

    // 兜底
    return {
        xData: [],
        yDataArr: [],
        mergeType: 'treemap',
        seriesData: []
    };
}

/**
 * 旭日图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function sunburstChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options)
    const { nodeID, nodeName, parentID, parentName, nodeValue } = config;
    // 判定数据是否有效
    const isValid = nodeID && nodeID.file && nodeID.field && parentID && parentID.file && parentID.field;

    if (isValid) {
        const nodeIDRows = getDataRows(fileDataMap, nodeID.file);
        const nodeNameRows = nodeName && nodeName.file ? getDataRows(fileDataMap, nodeName.file) : [];
        const parentIDRows = getDataRows(fileDataMap, parentID.file);
        const parentNameRows = parentName && parentName.file ? getDataRows(fileDataMap, parentName.file) : [];
        const nodeValueRows = nodeValue && nodeValue.file ? getDataRows(fileDataMap, nodeValue.file) : [];

        // 构建节点映射
        const nodeMap = new Map();
        // 先收集所有 parentId，便于后续层级计算
        const parentIdSet = new Set();
        parentIDRows.forEach(row => {
            if (row && parentID && parentID.field) {
                const pid = row[parentID.field];
                if (pid) parentIdSet.add(pid);
            }
        });

        // 计算每个节点的层级（根节点为1，子节点依次+1）
        function getLevel(id, cache = {}) {
            if (cache[id]) return cache[id];
            let level = 1;
            let currentId = id;
            let idx = nodeIDRows.findIndex(row => row[nodeID.field] === currentId);
            while (idx !== -1) {
                const parentId = parentIDRows[idx] ? parentIDRows[idx][parentID.field] : undefined;
                if (!parentId || !nodeMap.has(parentId)) break;
                level++;
                currentId = parentId;
                idx = nodeIDRows.findIndex(row => row[nodeID.field] === currentId);
            }
            cache[id] = level;
            return level;
        }

        // 统计最大层级
        let maxLevel = 1;
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            const level = getLevel(id);
            if (level > maxLevel) maxLevel = level;
        });

        // 构建节点，value 按层级递减（根节点最大，叶子最小）
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            if (!id) return;
            const name = nodeNameRows[idx] && nodeName && nodeName.field ? nodeNameRows[idx][nodeName.field] : id;
            let value = nodeValueRows[idx] && nodeValue && nodeValue.field ? parseFloat(nodeValueRows[idx][nodeValue.field]) : undefined;
            // 层级递减赋值，根节点 value = maxLevel，下一层 maxLevel-1，依次类推
            if (value === undefined || value === null || isNaN(value)) {
                const level = getLevel(id);
                value = Math.max(1, maxLevel - level + 1);
            }
            nodeMap.set(id, {
                id,
                name,
                value,
                children: []
            });
        });

        // 构建树结构
        let rootNodes = [];
        nodeIDRows.forEach((row, idx) => {
            const id = row[nodeID.field];
            const parentId = parentIDRows[idx] ? parentIDRows[idx][parentID.field] : undefined;
            if (!parentId || !nodeMap.has(parentId)) {
                // 没有父节点，认为是根节点
                rootNodes.push(nodeMap.get(id));
            } else {
                nodeMap.get(parentId).children.push(nodeMap.get(id));
            }
        });

        // 递归获取最大层级
        function getMaxDepth(nodes, depth) {
            if (!nodes || nodes.length === 0) return depth;
            let max = depth;
            for (let i = 0; i < nodes.length; i++) {
                max = Math.max(max, getMaxDepth(nodes[i].children, depth + 1));
            }
            return max;
        }
        const maxDepth = getMaxDepth(rootNodes, 1);

        // 递归分配 value：有原始 value 则保留，无则自动分配
        function assignValue(nodes) {
            if (!nodes) return 0;
            for (let i = 0; i < nodes.length; i++) {
                if (!nodes[i].children || nodes[i].children.length === 0) {
                    if (nodes[i].value === undefined || nodes[i].value === null || isNaN(nodes[i].value)) {
                        nodes[i].value = 1;
                    }
                } else {
                    if (nodes[i].value === undefined || nodes[i].value === null || isNaN(nodes[i].value)) {
                        nodes[i].value = assignValue(nodes[i].children);
                    } else {
                        // 有 value 时，仍需递归处理子节点
                        assignValue(nodes[i].children);
                    }
                }
            }
            // 返回所有节点 value 之和
            return nodes.reduce((sum, node) => sum + (node.value || 0), 0);
        }
        assignValue(rootNodes);

        // Sunburst 要求每个节点有 value, 非叶子节点 value 可为 undefined
        return {
            xData: [],
            yDataArr: [],
            mergeType: 'sunburst',
            seriesData: rootNodes
        };
    }

    // 兜底
    return {
        xData: [],
        yDataArr: [],
        mergeType: 'sunburst',
        seriesData: []
    };
}

/**
 * 平行坐标系图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function parallelChartHandler(config, fileDataMap, options) {
    const { dimensions, nameField } = config;
    const { nullHandlingType = 'ignore', nullHandlingModule = nullHandling } = options;

    const mainFile = dimensions[0].file;
    const rows = getDataRows(fileDataMap, mainFile);

    // 过滤掉所有维度都为空的行
    const filteredRows = rows.filter(row =>
        dimensions.some(dim => {
            const v = row[dim.field];
            return v !== undefined && v !== null && v !== '';
        })
    );

    // 按列收集数据
    const dimData = dimensions.map(dim =>
        filteredRows.map(row => {
            const v = row[dim.field];
            const num = parseFloat(v);
            return (v === null || v === undefined || v === '' || Number.isNaN(num)) ? null : num;
        })
    );

    // 缺失值处理
    const handledDimData = dimData.map(arr =>
        nullHandlingType && nullHandlingType !== 'ignore'
            ? (nullHandlingModule[nullHandlingType] || (d => d))(arr)
            : arr
    );

    // 重新组装为对象数组
    const dimensionsRows = filteredRows.map((row, idx) => {
        const obj = {};
        dimensions.forEach((dim, dIdx) => {
            obj[dim.field] = handledDimData[dIdx][idx];
        });
        return obj;
    });

    const nameRows = nameField
        ? filteredRows.map(row => ({ name: row[nameField.field] }))
        : [];

    const combinedRows = dimensionsRows.map((dimObj, idx) => ({
        ...dimObj,
        ...(nameRows[idx] || {})
    }));

    const seriesData = combinedRows;

    return {
        xData: [],
        yDataArr: [],
        mergeType: 'parallel',
        seriesData,
    };
}

/**
 * 桑基图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function sankeyChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options);
    const { source, target, value } = config;

    // 支持直接传入数组或文件字段
    let sourceArr = Array.isArray(source) ? source : getDataRows(fileDataMap, source.file).map(row => row[source.field]);
    let targetArr = Array.isArray(target) ? target : getDataRows(fileDataMap, target.file).map(row => row[target.field]);
    let valueArr = Array.isArray(value) ? value : (value ? getDataRows(fileDataMap, value.file).map(row => row[value.field]) : []);

    // 合并为原始数组 [{Source, Target, Value}]
    const raw = sourceArr.map((s, i) => ({
        Source: s,
        Target: targetArr[i],
        Value: valueArr[i],
    }));

    // nodes: 所有唯一 Source/Target
    const nodeSet = new Set();
    raw.forEach(row => {
        if (row.Source !== undefined && row.Source !== null && row.Source !== '') nodeSet.add(row.Source);
        if (row.Target !== undefined && row.Target !== null && row.Target !== '') nodeSet.add(row.Target);
    });
    const nodes = Array.from(nodeSet).map(name => ({ name }));

    // links: { source, target, value }
    const links = raw.map(row => ({
        source: row.Source,
        target: row.Target,
        value: row.Value
    }));

    const seriesData = {
        data: nodes,
        links: links,
    };

    return { mergeType: 'sankey', seriesData };
}

/**
 * 漏斗图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function funnelChartHandler(config, fileDataMap, options) {
    debugInput(config, fileDataMap, options);

    const { stage, value } = config;

    // 获取数据行
    const dataRows = getDataRows(fileDataMap, stage.file);

    const funnelData = dataRows.map((row) => ({
        name: row[stage.field],
        value: row[value.field],
    }));

    return { xData: [], yDataArr: [], mergeType: 'funnel', seriesData: funnelData, };
}

/**
 * 仪表盘图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function gaugeChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options);

    const { name, value } = config;

    // 获取数据行
    const dataRows = getDataRows(fileDataMap, name.file);

    const nameData = dataRows.map(row => row[name.field]);
    const valueData = dataRows.map(row => parseFloat(row[value.field]));

    const gaugeData = {
        name: nameData,
        value: valueData,
    }

    return { mergeType: 'gauge', seriesData: gaugeData };
}

/**
 * 象形柱图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function pictorialBarChartHandler(config, fileDataMap, options) {
    debugInput(config, fileDataMap, options);
    return {};
}

/**
 * 主题河流图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function themeRiverChartHandler(config, fileDataMap, options) {
    // debugInput(config, fileDataMap, options);

    const { date, value, category } = config;

    // 获取数据行
    const dataRows = getDataRows(fileDataMap, date.file);

    // 按顺序组合(date, value, category)
    const seriesData = dataRows.map(row => [
        row[date.field],
        parseFloat(row[value.field]),
        row[category.field]
    ]);

    return { mergeType: 'themeRiver', seriesData };
}

/**
 * 日历图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function calendarChartHandler(config, fileDataMap, options) {
    debugInput(config, fileDataMap, options);
    return {};
}

// ---------------- 图表类型分发器 ----------------

const chartTypeHandlers = {
    Line: xyChartHandler,
    Bar: xyChartHandler,
    Pie: pieChartHandler,
    Scatter: xyChartHandler,
    Geo_Map: mapChartHandler,
    Candlestick: candlestickChartHandler,
    Heatmap: heatmapChartHandler,
    Radar: radarChartHandler,
    Boxplot: boxplotChartHandler,
    Graph: graphChartHandler,
    Tree: treeChartHandler,
    Treemap: treemapChartHandler,
    Sunburst: sunburstChartHandler,
    Parallel: parallelChartHandler,
    Sankey: sankeyChartHandler,
    Funnel: funnelChartHandler,
    Gauge: gaugeChartHandler,
    PictorialBar: pictorialBarChartHandler,
    ThemeRiver: themeRiverChartHandler,
    Calendar: calendarChartHandler,
    // 其他类型可继续扩展
};

/**
 * 主入口：合并多文件数据，返回 { xData, yDataArr, mergeType, seriesData }
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {string} [nullHandlingType]
 * @param {Object} [options] - 可选项：filterPlugin, nullHandlingModule
 * @returns {Object}
 */
export function mergeChartData(config, fileDataMap, nullHandlingType = 'ignore', options = {}) {
    validateParams(config, fileDataMap);
    let chartType = config.type;

    console.log('[mergeChartData] Inferred chart type:', chartType);

    const handler = chartTypeHandlers[chartType] || xyChartHandler;

    console.log('[mergeChartData] Handler:', handler);

    // 允许config.isAggregate传递到handler
    return handler(config, fileDataMap, { ...options, nullHandlingType, isAggregate: config.isAggregate });
}

// applyFiltersToRows 已被插件化，见 defaultFilterPlugin
