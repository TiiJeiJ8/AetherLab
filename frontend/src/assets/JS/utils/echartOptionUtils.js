/* eslint-disable */

// 模块化导入各类图表 option 生成器
import barOption from '../../JS/chartOptions/bar'
import scatterOption from '../../JS/chartOptions/scatter'
import lineOption from '../../JS/chartOptions/line'
import pieOption from '../../JS/chartOptions/pie'
// ...可继续导入更多类型

// 图表类型注册表
const chartOptionGenerators = {};

// 注册新类型生成器接口
export function registerChartOptionGenerator(type, generatorFn) {
    chartOptionGenerators[type.toLowerCase()] = generatorFn;
}

// 注册模块化生成器
registerChartOptionGenerator('line', lineOption)
registerChartOptionGenerator('bar', barOption)
registerChartOptionGenerator('pie', pieOption)
registerChartOptionGenerator('scatter', scatterOption)


// 主入口：根据类型分发
export function generateEChartOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const type = selectedChartType.value.toLowerCase();
    const generator = chartOptionGenerators[type];
    if (!generator) {
        throw new Error(`No chart option generator registered for type: ${type}`);
    }
    const option = generator(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption);
    // 调试输出
    console.log('[generateEChartOption]', type, option);
    return option;
}
