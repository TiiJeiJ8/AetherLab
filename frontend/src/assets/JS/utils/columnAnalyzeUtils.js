// 列类型推断、统计等工具函数，便于复用和单元测试

/* eslint-disable */

/**
 * 推断数据类型
 * @param {Array} columnData
 * @returns {string}
 */
export function inferDataType(columnData) {
    if (!Array.isArray(columnData) || columnData.length === 0) return 'unknown';
    const sample = columnData.slice(0, Math.min(20, columnData.length));
    const uniqueValues = [...new Set(sample)];
    const uniqueCount = uniqueValues.length;
    // 检查布尔
    const isTrueFalseBool = sample.every(val => {
        const str = String(val).toLowerCase();
        return str === 'true' || str === 'false' || val === true || val === false;
    });
    if (isTrueFalseBool && uniqueCount <= 2) return 'boolean';
    // 检查数字
    const isNumeric = sample.every(val => !isNaN(val) && !isNaN(parseFloat(val)));
    if (isNumeric) {
        const isInteger = sample.every(val => Number.isInteger(parseFloat(val)));
        if (isInteger) {
            if (uniqueCount === 2 && uniqueValues.every(val => val === 0 || val === 1 || val === '0' || val === '1')) {
                return 'boolean';
            } else if (uniqueCount <= 10 && uniqueCount < sample.length * 0.5) {
                return 'category';
            } else {
                return 'integer';
            }
        } else {
            return 'number';
        }
    }
    // 检查日期
    const isDate = sample.some(val => !isNaN(Date.parse(val)));
    if (isDate) return 'date';
    // 类别值
    if (uniqueCount <= 10 && uniqueCount < sample.length * 0.5) return 'category';
    return 'string';
}

/**
 * 计算列统计信息
 * @param {Array} columnData
 * @param {number} totalRows
 * @returns {Object}
 */
export function calculateColumnStats(columnData, totalRows) {
    const nonEmptyCount = columnData.length;
    const nullCount = totalRows - nonEmptyCount;
    const uniqueCount = new Set(columnData).size;
    return {
        nullCount,
        uniqueCount,
        fillRate: Math.round((nonEmptyCount / totalRows) * 100)
    };
}

/**
 * 获取列类型样式类
 * @param {string} type
 * @returns {string}
 */
export function getColumnTypeClass(type) {
    const typeClasses = {
        'string': 'type-string',
        'number': 'type-number',
        'integer': 'type-integer',
        'date': 'type-date',
        'boolean': 'type-boolean',
        'category': 'type-category',
        'unknown': 'type-unknown'
    };
    return typeClasses[type] || 'type-unknown';
}
