// nullHandling.js
// 通用缺失值处理方法模块
// 每个方法接收原始数据（数组），返回处理后的新数组

/* eslint-disable */

/**
 * 直接忽略缺失值（null/undefined/NaN）
 * @param {Array} data
 * @returns {Array}
 */
export function ignoreNull(data) {
    console.log('[ignoreNull] method is working');
    return data;
}

/**
 * 缺失值填充为0
 * @param {Array} data
 * @returns {Array}
 */
export function fillZero(data) {
    console.log('[fillZero] method is working');
    return data.map(v => (v === null || v === undefined || Number.isNaN(v)) ? 0 : v);
}

/**
 * 用最近的非空值填充缺失值（前向/后向最近邻）
 * @param {Array} data
 * @returns {Array}
 */
export function fillNearest(data) {
    console.log('[fillNearest] method is working');
    const result = [...data];
    for (let i = 0; i < result.length; i++) {
        if (result[i] === null || result[i] === undefined || Number.isNaN(result[i])) {
            // 前向查找
            let prev = i - 1;
            while (prev >= 0 && (result[prev] === null || result[prev] === undefined || Number.isNaN(result[prev]))) prev--;
            // 后向查找
            let next = i + 1;
            while (next < result.length && (result[next] === null || result[next] === undefined || Number.isNaN(result[next]))) next++;
            if (prev >= 0 && next < result.length) {
                // 距离更近的邻居
                result[i] = (i - prev <= next - i) ? result[prev] : result[next];
            } else if (prev >= 0) {
                result[i] = result[prev];
            } else if (next < result.length) {
                result[i] = result[next];
            } else {
                result[i] = 0;
            }
        }
    }
    return result;
}

/**
 * 线性插值填充缺失值
 * @param {Array} data
 * @returns {Array}
 */
export function linearInterpolate(data) {
    console.log('[linearInterpolate] method is working');
    const result = [...data];
    for (let i = 0; i < result.length; i++) {
        if (result[i] === null || result[i] === undefined || Number.isNaN(result[i])) {
            // 找前一个和后一个非空
            let prev = i - 1;
            while (prev >= 0 && (result[prev] === null || result[prev] === undefined || Number.isNaN(result[prev]))) prev--;
            let next = i + 1;
            while (next < result.length && (result[next] === null || result[next] === undefined || Number.isNaN(result[next]))) next++;
            if (prev >= 0 && next < result.length) {
                // 线性插值
                result[i] = result[prev] + (result[next] - result[prev]) * (i - prev) / (next - prev);
            } else if (prev >= 0) {
                result[i] = result[prev];
            } else if (next < result.length) {
                result[i] = result[next];
            } else {
                result[i] = 0;
            }
        }
    }
    return result;
}

// 其它高级插值方法如 step-before、step-after、spline、basis、cardinal、monotone、akima、polynomial
// 可根据需要引入第三方库或后续补充实现
// 这里只做接口占位

export function fillSpline(data) { return linearInterpolate(data); }
export function fillPolynomial(data) { return linearInterpolate(data); }
export function fillStepBefore(data) { return fillNearest(data); }
export function fillStepAfter(data) { return fillNearest(data); }
export function fillBasis(data) { return linearInterpolate(data); }
export function fillCardinal(data) { return linearInterpolate(data); }
export function fillMonotone(data) { return linearInterpolate(data); }
export function fillAkima(data) { return linearInterpolate(data); }

// 用法示例：
// import { ignoreNull, fillZero, linearInterpolate } from './nullHandling.js'
// const cleanData = linearInterpolate([1, null, 3, NaN, 5])
