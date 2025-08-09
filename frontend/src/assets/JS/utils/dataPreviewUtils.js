// DataPreviewModal 相关通用工具函数

/* eslint-disable */

/**
 * 获取单元格值
 * @param {Array|Object} row
 * @param {string|number} header
 * @param {number} index
 * @returns {any}
 */
export function getCellValue(row, header, index) {
    if (Array.isArray(row)) {
        const value = row[index];
        return value === undefined || value === null ? '' : value;
    } else if (typeof row === 'object' && row !== null) {
        const value = row[header];
        return value === undefined || value === null ? '' : value;
    }
    return row === undefined || row === null ? '' : row;
}

/**
 * 格式化文件大小
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
