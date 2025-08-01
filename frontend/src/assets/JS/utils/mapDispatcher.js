/* eslint-disable */

// echartOptionUtils.js

import mapMatch from './mapMatchDispatcher';

/**
 * 根据地图名称（支持中文、拼音、英文）返回对应的地图js文件名
 * @param {string} mapName
 * @returns {string|undefined} 地图js文件名
 */
export default function mapDispatcher(mapName) {
    if (!mapName) return undefined;
    // 直接查找
    if (mapMatch[mapName]) {
        console.log(`[mapDispatcher] Found map file for ${mapName}: ${mapMatch[mapName]}`);
        return mapMatch[mapName];
    }
    // 尝试首字母大写（兼容拼音key）
    const cap = mapName.charAt(0).toUpperCase() + mapName.slice(1);
    if (mapMatch[cap]) {
        console.log(`[mapDispatcher] Found map file for ${cap}: ${mapMatch[cap]}`);
        return mapMatch[cap];
    }
    // 兼容全小写
    const lower = mapName.toLowerCase();
    for (const key in mapMatch) {
        if (key.toLowerCase() === lower) {
            console.log(`[mapDispatcher] Found map file for ${key}: ${mapMatch[key]}`);
            return mapMatch[key];
        }
    }
    return undefined;
}