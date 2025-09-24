/* eslint-disable */

// preprocessingDataMergeUtils.js
// 用于数据预处理模块的数据合并和处理的工具函数

// ------------------- 参数校验函数 -------------------
// 参数校验函数，新增 isCustomCols
function validateParams(activeSidebarId, fileDataMap, mappedColumns, isCustomCols) {
    if (typeof activeSidebarId !== 'string' || !activeSidebarId) {
        throw new Error('Invalid activeSidebarId');
    }
    if (typeof fileDataMap !== 'object' || fileDataMap === null) {
        throw new Error('Invalid fileDataMap');
    }
    if (!Array.isArray(mappedColumns)) {
        throw new Error('Invalid mappedColumns: expected an array');
    }
    if (typeof isCustomCols !== 'boolean') {
        throw new Error('Invalid isCustomCols: expected a boolean');
    }
}


// ------------------- 数据处理函数 -------------------

/**
 * 质量分析模型的数据处理函数
 * @param {Object} fileDataMap - 文件名到数据的映射对象
 * @param {Array} mappedColumns - 右侧边栏中拖拽放置区的数据列索引数组
 * @returns {Array} - 处理后的数据数组
 */
function qualityModelHandler(fileName, fileDataMap, mappedColumns) {
    return
}

// ------------------- 预处理模块分发器 -------------------

const preprocessingModelTypeHandlers = {
    'quality': qualityModelHandler,
    // ...
}

/**
 * @param {String} activeSidebarId - 当前激活的侧边栏ID
 * @param {String} fileName - 当前选中的文件名
 * @param {Object} fileDataMap - 文件名到数据的映射对象
 * @param {Array} mappedColumns - 右侧边栏中拖拽放置区的数据列索引数组
 * @param {Boolean} isCustomCols - 是否使用自定义筛选列
 * @returns {Array} - 合并后的数据数组
 */
export function mergePreprocessedData(activeSidebarId, fileName, fileDataMap, mappedColumns, isCustomCols) {
    validateParams(activeSidebarId, fileDataMap, mappedColumns, isCustomCols);
    // 若不使用自定义列，则忽略 mappedColumns，可在此处理为默认逻辑
    const cols = isCustomCols ? mappedColumns : [];

    console.log('[Preprocessing] Merging data for model type:', activeSidebarId);
    console.log('[Preprocessing] Selected file:', fileName);
    console.log('[Preprocessing] File Data Map:', fileDataMap);
    console.log('[Preprocessing] Mapped Columns:', cols);
    console.log('[Preprocessing] Using Custom Columns:', isCustomCols);

    const handler = preprocessingModelTypeHandlers[activeSidebarId];
    if (typeof handler !== 'function') {
        throw new Error(`No handler registered for model type: ${activeSidebarId}`);
    }

    return handler(fileName, fileDataMap, cols, isCustomCols);
}