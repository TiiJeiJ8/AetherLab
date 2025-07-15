// dataMergeUtils.js
// 多文件数据合并与主键处理工具函数

/* eslint-disable */

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
    if (conds.length === 0) return rows;
    return rows.filter(row => {
        const results = conds.map(f => {
            const val = row[f.field];
            switch (f.type) {
                case 'integer': {
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
                    if (f.operator === 'eq') return val === f.value;
                    if (f.operator === 'ne') return val !== f.value;
                    if (f.operator === 'in') return Array.isArray(f.value) ? f.value.includes(val) : false;
                    if (f.operator === 'notin') return Array.isArray(f.value) ? !f.value.includes(val) : false;
                    return true;
                }
                case 'boolean': {
                    const boolVal = val === true || val === 'true' || val === 1 || val === '1';
                    const cmp = f.value === true || f.value === 'true' || f.value === 1 || f.value === '1';
                    if (f.operator === 'eq') return boolVal === cmp;
                    if (f.operator === 'ne') return boolVal !== cmp;
                    return true;
                }
                case 'date': {
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

/**
 * 合并多文件数据，返回 { xData, yDataArr, mergeType, seriesData }
 * @param {Object} config - chartConfig
 * @param {Object} fileDataMap - 文件名到对象数组的映射
 * @returns {Object}
 */

import * as nullHandling from './nullHandling.js';

// ---------------- 图表类型处理器 ----------------

/**
 * 通用 x/y 图表（如折线、柱状等）数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function xyChartHandler(config, fileDataMap, options) {
    const { nullHandlingType = 'ignore', nullHandlingModule = nullHandling, filterPlugin = defaultFilterPlugin } = options;
    const { xAxis, yAxis } = config;
    let mainData = getDataRows(fileDataMap, xAxis.file);
    // 应用过滤
    if (config.filter && config.filter.filters && config.filter.filters.length) {
        mainData = filterPlugin(mainData, config.filter);
    }
    const xData = mainData.map(row => row[xAxis.field]);
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const usePrimaryKey = hasPrimaryKey(xAxis, yAxis, fileDataMap);
    let yDataArr = [];
    if (usePrimaryKey) {
        // 主键合并
        const mainIndexMap = new Map();
        for (const row of mainData) {
            mainIndexMap.set(row[xAxis.field], row);
        }
        yDataArr = yArr.map(y => {
            const yFileData = getDataRows(fileDataMap, y.file);
            const yMap = new Map();
            for (const row of yFileData) {
                yMap.set(row[xAxis.field], row);
            }
            let arr = mainData.map(row => {
                const match = yMap.get(row[xAxis.field]);
                if (!match) return null;
                const rawVal = match[y.field];
                const parsedVal = parseFloat(rawVal);
                return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
            });
            arr = handleNulls(nullHandlingType, arr, nullHandlingModule);
            return arr;
        });
    } else {
        yDataArr = yArr.map(y => {
            const yFileData = getDataRows(fileDataMap, y.file);
            let arr = yFileData.filter((row, idx) => mainData[idx]).map(row => {
                const rawVal = row[y.field];
                const parsedVal = parseFloat(rawVal);
                return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
            });
            if (arr.length > xData.length) arr = arr.slice(0, xData.length);
            while (arr.length < xData.length) arr.push(null);
            arr = handleNulls(nullHandlingType, arr, nullHandlingModule);
            return arr;
        });
    }
    return { xData, yDataArr, mergeType: usePrimaryKey ? 'primaryKey' : 'rowIndex', seriesData: [] };
}

/**
 * 饼图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function pieChartHandler(config, fileDataMap, options) {
    const { filterPlugin = defaultFilterPlugin } = options;
    let catData = getDataRows(fileDataMap, config.category.file);
    let valData = getDataRows(fileDataMap, config.value.file);
    // 应用过滤
    if (config.filter && config.filter.filters && config.filter.filters.length) {
        catData = filterPlugin(catData, config.filter);
        valData = filterPlugin(valData, config.filter);
    }
    const len = Math.min(catData.length, valData.length);
    const result = [];
    for (let i = 0; i < len; i++) {
        const name = catData[i][config.category.field];
        const rawVal = valData[i][config.value.field];
        const parsedVal = parseFloat(rawVal);
        const val = (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
        if (name !== undefined && name !== null && name !== '') {
            result.push({ name, value: val });
        }
    }
    return { xData: [], yDataArr: [], mergeType: 'pie', seriesData: result };
}

// ---------------- 图表类型分发器 ----------------

const chartTypeHandlers = {
    pie: pieChartHandler,
    line: xyChartHandler,
    bar: xyChartHandler,
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
    // 自动推断类型
    let chartType = config.type;
    if (!chartType) {
        if (config.category && config.value) chartType = 'pie';
        else chartType = 'line'; // 默认
    }
    const handler = chartTypeHandlers[chartType] || xyChartHandler;
    return handler(config, fileDataMap, { ...options, nullHandlingType });
}

// applyFiltersToRows 已被插件化，见 defaultFilterPlugin
