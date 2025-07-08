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
 * 合并多文件数据，返回 { xData, yDataArr, mergeType }
 * @param {Object} config - chartConfig
 * @param {Object} fileDataMap - 文件名到对象数组的映射
 * @returns {Object}
 */
export function mergeChartData(config, fileDataMap) {
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
            return mainData.map(row => {
                const match = yFileData.find(r => r[xAxis.field] === row[xAxis.field]);
                return match ? parseFloat(match[y.field]) || 0 : null;
            });
        });
    } else {
        // 行号对齐
        yDataArr = yArr.map(y => {
            const yFileData = (fileDataMap[y.file] || []).slice(1);
            let arr = yFileData.map(row => parseFloat(row[y.field]) || 0);
            if (arr.length > xData.length) arr = arr.slice(0, xData.length);
            while (arr.length < xData.length) arr.push(null);
            return arr;
        });
    }
    return { xData, yDataArr, mergeType: usePrimaryKey ? 'primaryKey' : 'rowIndex' };
}
