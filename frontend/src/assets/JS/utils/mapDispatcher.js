/* eslint-disable */

// echartOptionUtils.js

import mapMatch from './mapMatchDispatcher';

/**
 * 判断是否为中文
 */
function isChinese(str) {
    return /[\u4e00-\u9fa5]/.test(str);
}

/**
 * 地图分发器
 * @param {string} mapName
 * @returns {object|undefined} { file, source, origin }
 */
export default function mapDispatcher(mapName) {
    if (!mapName) return undefined;

    // 中文直接查找
    if (isChinese(mapName)) {
        const info = mapMatch[mapName];
        if (info) {
            return {
                file: info.file,
                source: info.source,
                origin: mapName
            };
        }
    } else {
        // 英文统一转大写
        const upper = mapName.toUpperCase();
        const info = mapMatch[upper];
        if (info) {
            // 分发器里英文key的origin就是中文名
            return {
                file: info.file,
                source: info.source,
                origin: info.origin
            };
        }
    }
    return undefined;
}