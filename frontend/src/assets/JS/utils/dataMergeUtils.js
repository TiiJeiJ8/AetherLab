// dataMergeUtils.js
// 多文件数据合并与主键处理工具函数

/* eslint-disable */

/**
 * 判断是否有主键（即所有y轴字段的文件都包含x轴字段）
 * @param {Object} xAxis - x轴配置
 * @param {Array|Object} yAxis - y轴配置
 * @param {Object} fileDataMap - 文件名到对象数组的映射
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

/**
 * 针对饼图等 category/value 结构，组装 ECharts 所需的 series.data
 * @param {Object} config - chartConfig，需包含 category/value 字段
 * @param {Object} fileDataMap - 文件名到对象数组的映射
 * @returns {Array} seriesData
 */
export function buildPieSeriesData(config, fileDataMap) {
    const { category, value } = config;
    if (!category || !value || !category.file || !value.file) return [];
    // 取出数据（去掉标题行）
    const catData = (fileDataMap[category.file] || []).slice(1);
    const valData = (fileDataMap[value.file] || []).slice(1);
    // 以category为主，value按行号对齐
    const len = Math.min(catData.length, valData.length);
    const result = [];
    for (let i = 0; i < len; i++) {
        const name = catData[i][category.field];
        const rawVal = valData[i][value.field];
        const parsedVal = parseFloat(rawVal);
        // 保留缺失值为 null
        const val = (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
        if (name !== undefined && name !== null && name !== '') {
            result.push({ name, value: val });
        }
    }
    return result;
}

/**
 * 合并多文件数据，返回 { xData, yDataArr, mergeType, seriesData }
 * @param {Object} config - chartConfig
 * @param {Object} fileDataMap - 文件名到对象数组的映射
 * @returns {Object}
 */
import * as nullHandling from './nullHandling.js';
export function mergeChartData(config, fileDataMap, nullHandlingType = 'ignore') {
    // 饼图等特殊结构处理
    if (config.category && config.value) {
        let catData = (fileDataMap[config.category.file] || []).slice(1);
        let valData = (fileDataMap[config.value.file] || []).slice(1);
        // 应用过滤
        if (config.filter && config.filter.filters && config.filter.filters.length) {
            catData = applyFiltersToRows(catData, config.filter, []);
            valData = applyFiltersToRows(valData, config.filter, []);
            console.log('[mergeChartData] Pie after filter:', { catData, valData });
        }
        // 以category为主，value按行号对齐
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
        console.log('[mergeChartData] Pie result:', result);
        return { xData: [], yDataArr: [], mergeType: 'pie', seriesData: result };
    }
    const { xAxis, yAxis } = config;
    let mainData = (fileDataMap[xAxis.file] || []).slice(1);
    // 应用过滤
    if (config.filter && config.filter.filters && config.filter.filters.length) {
        mainData = applyFiltersToRows(mainData, config.filter, []);
        console.log('[mergeChartData] mainData after filter:', mainData);
    }
    const xData = mainData.map(row => row[xAxis.field]);
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const usePrimaryKey = hasPrimaryKey(xAxis, yAxis, fileDataMap);
    let yDataArr = [];
    if (usePrimaryKey) {
        // 优化：用Map加速主键查找
        const mainIndexMap = new Map();
        for (const row of mainData) {
            mainIndexMap.set(row[xAxis.field], row);
        }
        yDataArr = yArr.map(y => {
            const yFileData = (fileDataMap[y.file] || []).slice(1);
            // 用Map加速查找
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
            // 应用缺失值处理
            if (nullHandlingType && nullHandlingType !== 'ignore') {
                const handler = nullHandling[nullHandlingType] || nullHandling.ignoreNull;
                arr = handler(arr);
            }
            console.log('[mergeChartData] yDataArr (primaryKey) after filter:', arr);
            return arr;
        });
    } else {
        yDataArr = yArr.map(y => {
            const yFileData = (fileDataMap[y.file] || []).slice(1);
            // 行号对齐，过滤后补齐
            let arr = yFileData.filter((row, idx) => mainData[idx]).map(row => {
                const rawVal = row[y.field];
                const parsedVal = parseFloat(rawVal);
                return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
            });
            if (arr.length > xData.length) arr = arr.slice(0, xData.length);
            while (arr.length < xData.length) arr.push(null);
            if (nullHandlingType && nullHandlingType !== 'ignore') {
                const handler = nullHandling[nullHandlingType] || nullHandling.ignoreNull;
                arr = handler(arr);
            }
            console.log('[mergeChartData] yDataArr (rowIndex) after filter:', arr);
            return arr;
        });
    }
    console.log('[mergeChartData] xData after filter:', xData);
    console.log('[mergeChartData] yDataArr after filter:', yDataArr);
    return { xData, yDataArr, mergeType: usePrimaryKey ? 'primaryKey' : 'rowIndex', seriesData: [] };
}

/**
 * 应用筛选条件到数据行
 * @param {Array} rows - 数据行数组
 * @param {Object} filters - 筛选条件
 * @param {Array} availableFields - 可用字段列表
 * @returns {Array} - 过滤后的数据行数组
 */
function applyFiltersToRows(rows, filters, availableFields) {
    console.log('[applyFiltersToRows] Initial rows:', rows);
    console.log('[applyFiltersToRows] Filters:', filters);
    if (!filters || !filters.filters || !Array.isArray(filters.filters) || filters.filters.length === 0) return rows;
    // 支持 AND/OR 逻辑
    const logic = filters.logic || 'AND';
    const conds = filters.filters || [];
    if (conds.length === 0) return rows;
    return rows.filter(row => {
        const results = conds.map(f => {
            const val = row[f.field];
            console.log('[applyFiltersToRows] Checking field:', f.field, 'Value:', val);
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
