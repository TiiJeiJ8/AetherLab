/* eslint-disable */

// 象形柱图配置生成器
export default function pictorialBarOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    // 网格线显示控制
    let xGrid = false, yGrid = false;
    switch (config.gridVisible) {
        case 'x':
            xGrid = true; yGrid = false; break;
        case 'y':
            xGrid = false; yGrid = true; break;
        case 'both':
            xGrid = true; yGrid = true; break;
        case 'none':
        default:
            xGrid = false; yGrid = false;
    }
}