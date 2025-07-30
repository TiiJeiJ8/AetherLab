// nullHandling.js
// 通用缺失值处理方法模块
// 每个方法接收原始数据（数组），返回处理后的新数组

/* eslint-disable */

// 辅助函数：过滤 null 并返回索引和值
function getValidPoints(data) {
    return data.map((y, x) => ({ x, y })).filter(p => p.y != null && !isNaN(p.y));
}

// Hermite插值函数，供单调、Akima、Cardinal等插值方法调用
function hermite(t, y0, y1, m0, m1) {
    // t: [0,1]，y0/y1: 端点，m0/m1: 端点切线
    const t2 = t * t;
    const t3 = t2 * t;
    return (
        (2 * t3 - 3 * t2 + 1) * y0 +
        (t3 - 2 * t2 + t) * m0 +
        (-2 * t3 + 3 * t2) * y1 +
        (t3 - t2) * m1
    );
}

// 直接忽略缺失值（null/undefined/NaN）
export function ignoreNull(data) {
    console.log('[ignoreNull] method is working');
    return data;
}

// 缺失值填充为0
export function fillZero(data) {
    console.log('[fillZero] method is working');
    return data.map(v => (v === null || v === undefined || Number.isNaN(v)) ? 0 : v);
}

// 最近邻填充--缺失值填充为最近的非空值
// 注意：前向查找和后向查找，取距离更近的邻居
// 适用于时间序列数据，保持趋势连续性
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
    console.log('[fillNearest] method completed: ', result);
    return result;
}

// 线性插值--缺失值填充为线性插值曲线
// 注意：线性插值适用于数据点较少且趋势平滑的情况
// 适用于时间序列数据，保持趋势连续性
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
    console.log('[linearInterpolate] method completed: ', result);
    return result;
}

// 三次样条插值--缺失值填充为三次样条曲线
// 注意：三次样条插值可能需要依赖第三方库，但也可徒手实现
// 适用于数据点较多且趋势平滑的情况
export function fillCubicSpline(data) {
    // 首先构造自然三次样条的求解函数
    function cubicSplineCoefficients(x, y) {
        const n = x.length;
        const a = y.slice();
        const h = new Array(n - 1);
        const alpha = new Array(n - 1);

        for (let i = 0; i < n - 1; i++) {
            h[i] = x[i + 1] - x[i];
            if (h[i] <= 0) {
                throw new Error('x values must be strictly increasing');
            }
        }
        for (let i = 1; i < n - 1; i++) {
            alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
        }

        const l = [1], mu = [0], z = [0];
        for (let i = 1; i < n - 1; i++) {
            l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
            mu[i] = h[i] / l[i];
            z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
        }
        l[n - 1] = 1;
        z[n - 1] = 0;

        const c = Array(n).fill(0);
        const b = Array(n - 1);
        const d = Array(n - 1);

        for (let j = n - 2; j >= 0; j--) {
            c[j] = z[j] - mu[j] * c[j + 1];
            b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
            d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
        }
        return { a, b, c, d, x };
    }

    // 然后构造样条插值函数
    function cubicSplineInterpolate(xi, coefs) {
        const { a, b, c, d, x } = coefs;
        let i = x.length - 2;

        for (let j = 0; j < x.length - 1; j++) {
            if (xi >= x[j] && xi <= x[j + 1]) {
                i = j;
                break;
            }
        }

        const dx = xi - x[i];
        return a[i] + b[i] * dx + c[i] * dx ** 2 + d[i] * dx ** 3;
    }

    // 主函数
    console.log('[fillCubicSpline] method is working');
    const result = [...data];
    const valid = getValidPoints(data);

    if (valid.length < 3) {
        console.warn('[fillCubicSpline] Not enough valid points to perform cubic spline.');
        return result;
    }

    const x = valid.map(p => p.x);
    const y = valid.map(p => p.y);
    const coefs = cubicSplineCoefficients(x, y);

    for (let i = 0; i < result.length; i++) {
        if (result[i] == null || isNaN(result[i])) {
            result[i] = cubicSplineInterpolate(i, coefs);
        }
    }
    console.log('[fillCubicSpline] method completed: ', result);
    return result;
}

// 多项式插值--缺失值填充为多项式曲线
// 注意：多项式插值可能会导致过拟合，需谨慎使用
// 适用于数据点较少且趋势明显的情况，在数据点多时会出现“龙格现象”（数值震荡），一般不太建议用于大量点
export function fillPolynomial(data) {
    console.log('[fillPolynomial] method is working');
    const result = [...data];
    const valid = getValidPoints(data);
    const n = valid.length;
    function lagrange(x) {
        let y = 0;
        for (let i = 0; i < n; i++) {
            let term = valid[i].y;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x - valid[j].x) / (valid[i].x - valid[j].x);
                }
            }
            y += term;
        }
        return y;
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] === null || result[i] === undefined || Number.isNaN(result[i])) {
            result[i] = lagrange(i);
        }
    }
    console.log('[fillPolynomial] method completed: ', result);
    return result;
}

// 前向填充--缺失值填充为左侧最近的非空值
// 注意：如果第一个值为null，则无法填充
// 适用于时间序列数据，保持趋势连续性
export function fillStepBefore(data) {
    console.log('[fillStepBefore] method is working');
    const result = [...data];
    let lastVal = null;
    for (let i = 1; i < result.length; i++) {
        if (result[i] === null || result[i] === undefined || Number.isNaN(result[i])) {
            result[i] = lastVal;
        } else {
            lastVal = result[i];
        }
    }
    console.log('[fillStepBefore] method completed: ', result);
    return result;
}

// 后向填充--缺失值填充为右侧最近的非空值
// 注意：如果最后一个值为null，则无法填充
// 适用于时间序列数据，保持趋势连续性
export function fillStepAfter(data) {
    console.log('[fillStepAfter] method is working');
    const result = [...data];
    let lastVal = null;
    for (let i = result.length - 2; i >= 0; i--) {
        if (result[i] === null || result[i] === undefined || Number.isNaN(result[i])) {
            result[i] = lastVal;
        } else {
            lastVal = result[i];
        }
    }
    console.log('[fillStepAfter] method completed: ', result);
    return result;
}

// 基础插值--缺失值填充为基础插值曲线
// 注意：基础插值通常是指线性插值或样条插值
// 适用于数据点较少且趋势平滑的情况
export function fillBasis(data) {
    // 首先构造均匀节点向量(open uniform knot vector)
    function createUniformKnotVector(n, degree) {
        const m = n + degree + 1;
        const knots = [];
        for (let i = 0; i < m; i++) {
            if (i < degree) knots.push(0);
            else if (i > n) knots.push(n - degree + 1);
            else knots.push(i - degree);
        }
        return knots;
    }

    // 然后递归 de Boor 算法计算 B 样条点
    function deBoor(i, k, t, knots, ctrlPoints) {
        if (k === 0) return ctrlPoints[i];

        const alpha = (t - knots[i]) / (knots[i + k] - knots[i]);
        const left = deBoor(i - 1, k - 1, t, knots, ctrlPoints);
        const right = deBoor(i, k - 1, t, knots, ctrlPoints);

        return (1 - alpha) * left + alpha * right;
    }

    // 主函数
    console.log('[fillBasis] method is working');

    const result = [...data];
    const valid = data.map((y, x) => ({ x, y }))
        .filter(p => p.y != null && !isNaN(p.y));

    const degree = 3;
    const n = valid.length - 1;
    if (n < degree) {
        console.warn('[fillBasis] Not enough valid points for B-spline');
        return result;
    }

    const ctrlX = valid.map(p => p.x);
    const ctrlY = valid.map(p => p.y);
    const knots = createUniformKnotVector(n, degree);

    for (let i = 0; i < result.length; i++) {
        if (result[i] == null || isNaN(result[i])) {
            const t = i * (n - degree + 1) / (result.length - 1);  // 归一化到 knot domain
            // 找起始区间索引 i，使 knots[i] <= t < knots[i+1]
            let j = degree;
            while (j < knots.length - 1 && t >= knots[j + 1]) j++;

            // de Boor 插值
            result[i] = deBoor(j, degree, t, knots, ctrlY);
        }
    }
    console.log('[fillBasis] method completed: ', result);
    return result;
}

// 立方插值--缺失值填充为立方插值曲线
// 注意：立方插值通常是指三次样条插值或立方多项式插值
// 适用于数据点较多且趋势平滑的情况
export function fillCardinal(data) {
    console.log('[fillCardinal] method is working');

    const result = [...data];
    const valid = data.map((y, x) => ({ x, y }))
        .filter(p => p.y != null && !isNaN(p.y));

    if (valid.length < 4) {
        console.warn('[fillCardinal] Not enough points');
        return result;
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] == null || isNaN(result[i])) {
            const p1Idx = valid.findIndex(p => p.x > i);
            const p0Idx = p1Idx - 2;
            if (p0Idx < 0 || p1Idx + 1 >= valid.length) continue;

            const P0 = valid[p0Idx].y;
            const P1 = valid[p0Idx + 1].y;
            const P2 = valid[p0Idx + 2].y;
            const P3 = valid[p0Idx + 3].y;

            const x0 = valid[p0Idx + 1].x;
            const x1 = valid[p0Idx + 2].x;

            const t = (i - x0) / (x1 - x0); // normalized position
            const t2 = t * t, t3 = t2 * t;

            result[i] = 0.5 * (
                (2 * P1) +
                (-P0 + P2) * t +
                (2 * P0 - 5 * P1 + 4 * P2 - P3) * t2 +
                (-P0 + 3 * P1 - 3 * P2 + P3) * t3
            );
        }
    }
    console.log('[fillCardinal] method completed: ', result);
    return result;
}

// 单调插值--缺失值填充为单调插值曲线
// 注意：单调插值通常是指单调样条插值或单调多项式插值
// 适用于数据点较多且趋势单调的情况
export function fillMonotone(data) {
    console.log('[fillMonotone] method is working');

    const result = [...data];
    const valid = getValidPoints(data);
    const n = valid.length;

    if (n < 3) return result;

    // 预计算斜率
    const dx = [], dy = [], m = [], t = [];
    for (let i = 0; i < n - 1; i++) {
        dx[i] = valid[i + 1].x - valid[i].x;
        dy[i] = valid[i + 1].y - valid[i].y;
        m[i] = dy[i] / dx[i];
    }

    t[0] = m[0];
    for (let i = 1; i < n - 1; i++) {
        if (m[i - 1] * m[i] <= 0) {
            t[i] = 0;
        } else {
            const w1 = 2 * dx[i] + dx[i - 1];
            const w2 = dx[i] + 2 * dx[i - 1];
            t[i] = (w1 + w2) === 0 ? 0 : (w1 + w2) / ((w1 / m[i - 1]) + (w2 / m[i]));
        }
    }
    t[n - 1] = m[n - 2];

    for (let i = 0; i < result.length; i++) {
        if (result[i] == null || isNaN(result[i])) {
            const idx = valid.findIndex(p => p.x > i);
            if (idx <= 0) continue;

            const x0 = valid[idx - 1].x;
            const x1 = valid[idx].x;
            const y0 = valid[idx - 1].y;
            const y1 = valid[idx].y;
            const t0 = t[idx - 1];
            const t1 = t[idx];

            const h = x1 - x0;
            const s = (i - x0) / h;
            result[i] = hermite(s, y0, y1, t0 * h, t1 * h);
        }
    }
    console.log('[fillMonotone] method completed: ', result);
    return result;
}

// 阿基玛插值--缺失值填充为阿基玛插值曲线
// 注意：阿基玛插值通常是指阿基玛样条插值或阿基玛多项式插值
// 适用于数据点较多且趋势平滑的情况
export function fillAkima(data) {
    console.log('[fillAkima] method is working');

    const result = [...data];
    const valid = getValidPoints(data);
    const n = valid.length;

    if (n < 5) return result;

    const x = valid.map(p => p.x);
    const y = valid.map(p => p.y);
    const m = new Array(n - 1);

    for (let i = 0; i < n - 1; i++) {
        m[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
    }

    const t = [];
    for (let i = 2; i < n - 2; i++) {
        const w1 = Math.abs(m[i + 1] - m[i]);
        const w2 = Math.abs(m[i - 1] - m[i - 2]);
        t[i] = (w1 + w2 === 0) ? ((m[i - 1] + m[i]) / 2) :
            (w1 * m[i - 1] + w2 * m[i]) / (w1 + w2);
    }
    // 端点斜率回退为邻近斜率
    t[0] = m[0];
    t[1] = m[1];
    t[n - 2] = m[n - 2];
    t[n - 1] = m[n - 2];

    for (let i = 0; i < result.length; i++) {
        if (result[i] == null || isNaN(result[i])) {
            const idx = valid.findIndex(p => p.x > i);
            if (idx <= 0) continue;

            const x0 = x[idx - 1], x1 = x[idx];
            const y0 = y[idx - 1], y1 = y[idx];
            const s = (i - x0) / (x1 - x0);
            const t0 = t[idx - 1] * (x1 - x0);
            const t1 = t[idx] * (x1 - x0);

            result[i] = hermite(s, y0, y1, t0, t1);
        }
    }
    console.log('[fillAkima] method completed: ', result);
    return result;
}
