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
    const { isAggregate = true, aggregateFn } = options;
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
                if (rawVal !== null && rawVal !== undefined && rawVal !== '' && !Number.isNaN(parsedVal)) {
                    groupMap.get(key)[idx].push(parsedVal);
                }
            });
        }
        const xData = Array.from(groupMap.keys());
        // 默认聚合函数为累加
        const defaultAggregate = arr => arr.reduce((a, b) => a + b, 0);
        const aggFn = typeof aggregateFn === 'function' ? aggregateFn : defaultAggregate;
        const yDataArr = yArr.map((y, idx) => xData.map(name => aggFn(groupMap.get(name)[idx])));
        return { xData, yDataArr, mergeType: 'groupByName', seriesData: [] };
    } else {
        // 返回原始未聚合数据
        const xData = mainData.map(row => row[xAxis.field]);
        const yDataArr = yArr.map(y => mainData.map(row => {
            const rawVal = row[y.field];
            const parsedVal = parseFloat(rawVal);
            return (rawVal === null || rawVal === undefined || rawVal === '' || Number.isNaN(parsedVal)) ? null : parsedVal;
        }));
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

/**
 * K线图数据处理器
 * @param {ChartConfig} config
 * @param {FileDataMap} fileDataMap
 * @param {Object} options
 * @returns {Object}
 */
function candlestickChartHandler(config, fileDataMap, options) {
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
    debugInput(config, fileDataMap, options);
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

// ---------------- 图表类型分发器 ----------------

const chartTypeHandlers = {
    Line: xyChartHandler,
    Bar: xyChartHandler,
    Pie: pieChartHandler,
    Scatter: xyChartHandler,
    Candlestick: candlestickChartHandler,
    Heatmap: heatmapChartHandler,
    Radar: radarChartHandler,
    Boxplot: boxplotChartHandler,
    Graph: graphChartHandler,
    Tree: treeChartHandler,
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

    return handler(config, fileDataMap, { ...options, nullHandlingType });
}

// applyFiltersToRows 已被插件化，见 defaultFilterPlugin
