/* eslint-disable */
// LatLonProcessor.js

// 经纬度处理器
export default function LatLonProcessor(lngFieldRow, latFieldRow) {
    //! 调试输入
    // console.log(`[LatLonProcessor] lngFieldRow:`, lngFieldRow);
    // console.log(`[LatLonProcessor] latFieldRow:`, latFieldRow);

    function parseSingle(val) {
        if (typeof val === 'number') return val;
        if (!val) return null;
        // 十进制度
        if (/^-?\d+(\.\d+)?$/.test(val)) return parseFloat(val);

        // 带方向字母的十进制度
        if (/^-?\d+(\.\d+)?[NSEW]$/.test(val)) {
            let num = parseFloat(val);
            if (/S|W/i.test(val)) num = -Math.abs(num);
            return num;
        }

        // 空格分隔度分秒（如 49 15 00N）
        const dmsSpaceMatch = val.match(/^(\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)\s*([NSEW])?$/i);
        if (dmsSpaceMatch) {
            let deg = parseFloat(dmsSpaceMatch[1]);
            let min = parseFloat(dmsSpaceMatch[2]);
            let sec = parseFloat(dmsSpaceMatch[3]);
            let dir = dmsSpaceMatch[4];
            let num = deg + min / 60 + sec / 3600;
            if (dir && /S|W/i.test(dir)) num = -Math.abs(num);
            return num;
        }

        // 度分秒带符号（如 49°15′00″N）
        const dmsMatch = val.match(/(\d+)[°\s](\d+)[′\s](\d+(?:\.\d+)?)[″\s]?([NSEW])?/i);
        if (dmsMatch) {
            let deg = parseFloat(dmsMatch[1]);
            let min = parseFloat(dmsMatch[2]);
            let sec = parseFloat(dmsMatch[3]);
            let dir = dmsMatch[4];
            let num = deg + min / 60 + sec / 3600;
            if (dir && /S|W/i.test(dir)) num = -Math.abs(num);
            return num;
        }

        // 度分（如 119°42.5′E 或 119 42.5E）
        const dmMatch = val.match(/(\d+)[°\s](\d+(?:\.\d+)?)[′\s]?([NSEW])?/i);
        if (dmMatch) {
            let deg = parseFloat(dmMatch[1]);
            let min = parseFloat(dmMatch[2]);
            let dir = dmMatch[3];
            let num = deg + min / 60;
            if (dir && /S|W/i.test(dir)) num = -Math.abs(num);
            return num;
        }

        // 其它情况返回 null
        return null;
    }

    // 批量处理
    const latArr = latFieldRow.map(parseSingle);
    const lngArr = lngFieldRow.map(parseSingle);

    //! 调试输出
    // console.log(`[LatLonProcessor] Processed lngFieldRow:`, lngArr);
    // console.log(`[LatLonProcessor] Processed latFieldRow:`, latArr);

    return { lngArr, latArr };
}