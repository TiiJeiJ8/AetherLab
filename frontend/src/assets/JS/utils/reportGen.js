// reportGen.js

/* eslint-disable */

// 工具函数
function isNumberLike(v) {
    return typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)));
}
function toNumber(v) {
    const n = Number(v);
    return isNaN(n) ? null : n;
}
function quantile(sorted, q) {
    if (!sorted.length) return null;
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
}
function histogram(values, binCount = 20) {
    if (!values.length) return { bins: [], counts: [] };
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (!isFinite(min) || !isFinite(max) || min === max) {
        return { bins: [min], counts: [values.length] };
    }
    const step = (max - min) / binCount;
    const counts = new Array(binCount).fill(0);
    for (const v of values) {
        let idx = Math.floor((v - min) / step);
        if (idx >= binCount) idx = binCount - 1;
        if (idx < 0) idx = 0;
        counts[idx]++;
    }
    const bins = Array.from({ length: binCount }, (_, i) => min + i * step);
    return { bins, counts };
}
function buildIssuesTableHtml(metrics) {
    const rows = [];
    metrics.missing.perColumn
        .filter(x => x.rate > 0)
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 3)
        .forEach(x => rows.push({ field: x.column, type: 'Missing', severity: x.rate > 0.3 ? 'High' : x.rate > 0.1 ? 'Medium' : 'Low', value: (x.rate * 100).toFixed(1) + '%' }));
    metrics.outliers.perColumn
        .filter(x => x.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .forEach(x => rows.push({ field: x.column, type: 'Outliers', severity: x.count > 0 ? 'Medium' : 'Low', value: x.count }));
    // helpers
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function truncate(str, max = 40) {
        const s = String(str ?? '')
        if (s.length <= max) return s
        return s.slice(0, max - 1) + '…'
    }

    const trs = rows.map(r => {
        const safe = escapeHtml(r.field)
        const shown = truncate(r.field, 40)
        return `<tr><td><span class="dq-field-name" title="${safe}">${escapeHtml(shown)}</span></td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.severity)}</td><td>${escapeHtml(r.value)}</td></tr>`
    }).join('');
    return `
    <div class="dq-issues">
            <h4>Top Fields with Issues</h4>
        <table class="dq-table">
                    <thead><tr><th>Field</th><th>Issue Type</th><th>Severity</th><th>Value</th></tr></thead>
                    <tbody>${trs || '<tr><td colspan="4" style="text-align:center;color:#888;">No significant issues</td></tr>'}</tbody>
        </table>
    </div>`;
}
function buildSuggestionsHtml(metrics) {
    const suggestions = [];
    if (metrics.missing.globalRate > 0.05) suggestions.push('High missing rate detected. Consider drop columns with excessive missing or apply imputation (mean/median/mode/model-based).');
    if (metrics.duplicates.rate > 0.0) suggestions.push('Duplicates found. Consider de-duplication using business keys to ensure unique records.');
    if (metrics.outliers.perColumn.some(x => x.count > 0)) suggestions.push('Outliers detected. Consider Winsorization, trimming or rule-based handling.');
    if (!suggestions.length) suggestions.push('Data quality looks good. No immediate action required.');
    return `
    <div class="dq-suggestions">
        <h4>Recommendations</h4>
        <ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>`;
}

// 数据质量报告生成函数：返回包含指标、ECharts 配置与文字报告的对象
export function generateDataQualityReport(data, opts = {}) {
    console.log('[Report Generation] Generating data quality report...');
    const rowsRaw = Array.isArray(data) ? data : [];
    const totalRowsRaw = rowsRaw.length;
    if (totalRowsRaw === 0) {
        return {
            meta: { totalRows: 0, totalCols: 0, numericCols: [], categoricalCols: [] },
            metrics: {
                missing: { perColumn: [], globalRate: 0 },
                duplicates: { count: 0, rate: 0 },
                outliers: { perColumn: [] },
                healthScore: 100
            },
            charts: {},
            html: { summary: '', issues: '', suggestions: '' }
        };
    }

    // 采样以保证性能
    const maxSample = opts.maxSample || 20000;
    let rows = rowsRaw;
    if (rowsRaw.length > maxSample) {
        const step = Math.ceil(rowsRaw.length / maxSample);
        rows = rowsRaw.filter((_, i) => i % step === 0);
    }
    const totalRows = rows.length;

    // 列名
    const columns = Object.keys(rows[0] || {});
    const numericCols = columns.filter(c => rows.some(r => isNumberLike(r[c])));
    const categoricalCols = columns.filter(c => !numericCols.includes(c));

    // 缺失率
    const missingPerColumn = columns.map(col => {
        const missing = rows.filter(r => r[col] === null || r[col] === undefined || r[col] === '').length;
        return { column: col, missing, rate: totalRows ? missing / totalRows : 0 };
    });
    const globalMissingRate = missingPerColumn.reduce((acc, x) => acc + x.missing, 0) / (totalRows * columns.length);

    // 重复
    const seen = new Set();
    let duplicateCount = 0;
    for (const r of rows) {
        const key = JSON.stringify(r);
        if (seen.has(key)) duplicateCount++;
        else seen.add(key);
    }
    const duplicateRate = totalRows ? duplicateCount / totalRows : 0;

    // 数值列箱线与异常值数量（IQR）
    const outlierPerColumn = numericCols.map(col => {
        const vals = rows.map(r => toNumber(r[col])).filter(v => v !== null);
        const sorted = vals.slice().sort((a, b) => a - b);
        const q1 = quantile(sorted, 0.25);
        const q2 = quantile(sorted, 0.5);
        const q3 = quantile(sorted, 0.75);
        const iqr = q3 - q1;
        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;
        const min = sorted.length ? sorted[0] : null;
        const max = sorted.length ? sorted[sorted.length - 1] : null;
        const count = vals.filter(v => v < lower || v > upper).length;
        return { column: col, stats: { min, q1, q2, q3, max }, count };
    });

    // 为每个可分析字段生成分布图配置（保持向后兼容，仍返回 charts.distribution 作为默认）
    const distributions = {};
    // 数值列直方图
    for (const col of numericCols) {
        const vals = rows.map(r => toNumber(r[col])).filter(v => v !== null);
        const { bins, counts } = histogram(vals, 30);
        distributions[col] = {
            title: { text: `Distribution (Numeric) - ${col}`, left: 'center' },
            tooltip: { trigger: 'axis' },
            grid: { left: 40, right: 20, top: 60, bottom: 70 },
            xAxis: { type: 'category', data: bins.map(b => Number.isFinite(b) ? b.toFixed(2) : String(b)), axisLabel: { rotate: 45, margin: 10, hideOverlap: true } },
            yAxis: { type: 'value' },
            series: [{ type: 'bar', data: counts, itemStyle: { color: '#4F8EF7' } }],
            dataZoom: [
                { type: 'slider', start: 0, end: 100, bottom: 6, height: 14 },
                { type: 'inside' }
            ]
        };
    }
    // 类别列频率条形图（前 50 项）
    for (const col of categoricalCols) {
        const freq = {};
        rows.forEach(r => {
            const v = r[col] != null ? String(r[col]) : 'null';
            freq[v] = (freq[v] || 0) + 1;
        });
        const pairs = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 50);
        distributions[col] = {
            title: { text: `Distribution (Categories) - ${col}`, left: 'center' },
            tooltip: { trigger: 'axis' },
            grid: { left: 140, right: 40, top: 60, bottom: 20 },
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: pairs.map(p => p[0]) },
            series: [{ type: 'bar', data: pairs.map(p => p[1]), itemStyle: { color: '#4F8EF7' } }],
            dataZoom: [
                { type: 'slider', yAxisIndex: 0, start: 0, end: 100, right: 6, width: 12 },
                { type: 'inside', yAxisIndex: 0 }
            ]
        };
    }

    // 默认单图（保持向后兼容：使用第一个可用分布）
    let distOption = null;
    const distKeys = Object.keys(distributions);
    if (distKeys.length) distOption = distributions[distKeys[0]];

    // 缺失率柱状图配置
    const missCats = missingPerColumn.map(x => x.column);
    const missMaxLabelLen = missCats.reduce((m, s) => Math.max(m, String(s ?? '').length), 0);
    const missRotate = missCats.length > 15 || missMaxLabelLen > 8 ? 45 : 0;
    const missingOption = {
        title: { text: 'Missing Rate (%)', left: 'center' },
        tooltip: { trigger: 'axis', valueFormatter: v => `${(v).toFixed(2)}%` },
        grid: { left: 60, right: 20, top: 60, bottom: missRotate ? 110 : 70 },
        xAxis: {
            type: 'category', data: missCats, axisLabel: {
                rotate: missRotate, margin: 12, hideOverlap: true,
                formatter: (val) => {
                    const s = String(val ?? '');
                    return s.length > 16 ? s.slice(0, 15) + '…' : s;
                }
            }
        },
        yAxis: { type: 'value', axisLabel: { formatter: '{value} %' } },
        series: [{ type: 'bar', data: missingPerColumn.map(x => x.rate * 100), itemStyle: { color: '#f59e0b' } }],
        dataZoom: [
            { type: 'slider', start: 0, end: 100, bottom: 8, height: 16 },
            { type: 'inside' }
        ]
    };

    // 箱线图配置（每列一个 box）
    const boxCats = outlierPerColumn.map(x => x.column);
    const boxMaxLabelLen = boxCats.reduce((m, s) => Math.max(m, String(s ?? '').length), 0);
    const boxRotate = boxCats.length > 15 || boxMaxLabelLen > 8 ? 45 : 0;
    const boxData = outlierPerColumn.map(x => [x.stats.min, x.stats.q1, x.stats.q2, x.stats.q3, x.stats.max]);
    const boxOption = {
        title: { text: 'Boxplot (Numeric Columns)', left: 'center' },
        tooltip: { trigger: 'item' },
        grid: { left: 80, right: 20, top: 60, bottom: boxRotate ? 110 : 70 },
        xAxis: {
            type: 'category', data: boxCats, axisLabel: {
                rotate: boxRotate, margin: 12, hideOverlap: true,
                formatter: (val) => {
                    const s = String(val ?? '');
                    return s.length > 16 ? s.slice(0, 15) + '…' : s;
                }
            }
        },
        yAxis: { type: 'value', scale: true },
        series: [{ type: 'boxplot', data: boxData }],
        dataZoom: [
            { type: 'slider', start: 0, end: 100, bottom: 8, height: 16 },
            { type: 'inside' }
        ]
    };

    // 健康评分（简化版）
    const missScore = Math.max(0, 100 - globalMissingRate * 100 * 1.2); // 缺失越多惩罚越大
    const dupScore = Math.max(0, 100 - duplicateRate * 100 * 1.5);
    const outScore = Math.max(0, 100 - (outlierPerColumn.reduce((s, x) => s + x.count, 0) / (totalRows * (numericCols.length || 1))) * 100 * 5);
    const healthScore = 0.5 * missScore + 0.2 * dupScore + 0.3 * outScore;

    const metrics = {
        missing: { perColumn: missingPerColumn, globalRate: globalMissingRate },
        duplicates: { count: duplicateCount, rate: duplicateRate },
        outliers: { perColumn: outlierPerColumn },
        healthScore
    };

    const html = {
        issues: buildIssuesTableHtml(metrics),
        suggestions: buildSuggestionsHtml(metrics)
    };

    return {
        meta: { totalRows, totalCols: columns.length, numericCols, categoricalCols },
        metrics,
        charts: {
            missingBar: missingOption,
            outlierBox: boxOption,
            distribution: distOption,
            // maps columnName -> echarts option
            distributions
        },
        html
    };
}
