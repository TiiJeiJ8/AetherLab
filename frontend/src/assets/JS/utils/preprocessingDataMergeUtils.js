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

// ------------------- 数据提取函数 -------------------
/**
 * @param {Object} fileDataMap - 文件名到数据的映射对象
 * @param {Array} mappedColumns - 右侧边栏中拖拽放置区的数据列索引数组
 * @returns {Object} - 处理后的数据对象
 */
function extractData(fileName, fileDataMap, mappedColumns) {
    console.log('[Extract Data] Enter Extract Data Handler');

    //! 控制台检验输入
    // console.log('[Extract Data - Check - Input] fileName:', fileName);
    // console.log('[Extract Data - Check - Input] fileDataMap:', fileDataMap);
    // console.log('[Extract Data - Check - Input] mappedColumns:', mappedColumns);

    let Dataset = [];

    const fileData = fileDataMap[fileName] || [];

    // 如果mappedColumns为空，直接返回原始对象数组
    if (mappedColumns.length === 0) {
        console.log('[Extract Data] Exit Extract Data Handler');
        return fileData;
    }

    // 初始化 Dataset 为与 fileData 等长的空对象数组
    Dataset = fileData.map(() => ({}));

    // 遍历每个映射列，将对应值填充到 Dataset 对应行的对象里
    for (const mappedCol of mappedColumns) {
        if (mappedCol.file === fileName) {
            fileData.forEach((row, rowIndex) => {
                const keys = Object.keys(row);
                const vals = Object.values(row);
                const key = keys[mappedCol.index];
                Dataset[rowIndex][key] = vals[mappedCol.index];
            });
            console.log(`[Extract Data] Mapped column ${mappedCol.index} from file ${fileName} added to Dataset.`);
        }
        else {
            console.warn(`[Extract Data] Mapped column ${mappedCol.index} does not belong to file ${fileName}, skipping.`);
        }
    }

    console.log('[Extract Data] Exit Extract Data Handler');
    return Dataset;
}

// ------------------- 数据处理函数 -------------------

/**
 * 质量分析模型的数据处理函数
 * @param {Object} fileDataMap - 文件名到数据的映射对象
 * @param {Array} mappedColumns - 右侧边栏中拖拽放置区的数据列索引数组
 * @returns {Object} - 处理后的数据对象
 */
function qualityModelHandler(Dataset) {
    console.log('[Quality Model] Enter Quality Model Handler');

    //! 控制台检验输入
    console.log('[Quality Model - Check - Input] Dataset:', Dataset);

    console.log('[Quality Model] Exit Quality Model Handler');
    return Dataset;
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
 * @returns {Object} - 处理后的配置对象
 */
export function mergePreprocessedData(activeSidebarId, fileName, fileDataMap, mappedColumns, isCustomCols) {
    validateParams(activeSidebarId, fileDataMap, mappedColumns, isCustomCols);
    // 若不使用自定义列，则忽略 mappedColumns，可在此处理为默认逻辑
    const cols = isCustomCols ? mappedColumns : [];

    console.log('[Preprocessing - Data Merging] Enter Data Merging Function');

    //! Debug 日志 输出
    // console.log('[Preprocessing - Data Merging - Check] Merging data for model type:', activeSidebarId);
    // console.log('[Preprocessing - Data Merging - Check] Selected file:', fileName);
    // console.log('[Preprocessing - Data Merging - Check] File Data Map:', fileDataMap);
    // console.log('[Preprocessing - Data Merging - Check] Mapped Columns:', cols);
    // console.log('[Preprocessing - Data Merging - Check] Using Custom Columns:', isCustomCols);
    // console.log('[Preprocessing - Data Merging - Check] Selected Handler:', preprocessingModelTypeHandlers[activeSidebarId]);

    const Dataset = extractData(fileName, fileDataMap, cols);

    const handler = preprocessingModelTypeHandlers[activeSidebarId];
    if (typeof handler !== 'function') {
        throw new Error(`No handler registered for model type: ${activeSidebarId}`);
    }

    console.log('[Preprocessing - Data Merging] Exit Data Merging Function');

    return handler(Dataset);
}