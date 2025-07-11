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
    //! 调试是否有nullHandlingType
    console.log('nullHandlingType set:', nullHandlingType);
    // 饼图等特殊结构处理
    if (config.category && config.value) {
        const seriesData = buildPieSeriesData(config, fileDataMap);
        return { xData: [], yDataArr: [], mergeType: 'pie', seriesData };
    }
    const { xAxis, yAxis } = config;
    // 去除第一行（标题行）
    const mainData = (fileDataMap[xAxis.file] || []).slice(1);
    const xData = mainData.map(row => row[xAxis.field]);
    const yArr = Array.isArray(yAxis) ? yAxis : [yAxis];
    const usePrimaryKey = hasPrimaryKey(xAxis, yAxis, fileDataMap);
    let yDataArr = [];
    if (usePrimaryKey) {
        // 主键合并（左连接）
        yDataArr = yArr.map(y => {
            const yFileData = (fileDataMap[y.file] || []).slice(1);
            let arr = mainData.map(row => {
                const match = yFileData.find(r => r[xAxis.field] === row[xAxis.field]);
                if (!match) return null;
                const rawVal = match[y.field];
                const parsedVal = parseFloat(rawVal);
                return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
            });
            console.log(`Before handling (primary key merge):`, arr, 'Type:', nullHandlingType);
            // 应用缺失值处理
            if (nullHandlingType && nullHandlingType !== 'ignore') {
                const handler = nullHandling[nullHandlingType] || nullHandling.ignoreNull;
                arr = handler(arr);
                console.log(`After ${nullHandlingType} handling (primary key merge):`, arr);
            }
            return arr;
        });
    } else {
        // 行号对齐
        yDataArr = yArr.map(y => {
            const yFileData = (fileDataMap[y.file] || []).slice(1);
            let arr = yFileData.map(row => {
                const rawVal = row[y.field];
                const parsedVal = parseFloat(rawVal);
                return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
            });
            if (arr.length > xData.length) arr = arr.slice(0, xData.length);
            while (arr.length < xData.length) arr.push(null);
            // 应用缺失值处理
            if (nullHandlingType && nullHandlingType !== 'ignore') {
                const handler = nullHandling[nullHandlingType] || nullHandling.ignoreNull;
                arr = handler(arr);
                console.log(`After ${nullHandlingType} handling (rowIndex):`, arr);
            }
            return arr;
        });
    }
    return { xData, yDataArr, mergeType: usePrimaryKey ? 'primaryKey' : 'rowIndex', seriesData: [] };
}
