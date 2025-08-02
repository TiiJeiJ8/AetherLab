// echartOptionUtils.js
// 利用Option分发器, 根据图表类型生成不同的ECharts Option

/* eslint-disable */

// 模块化导入各类图表 option 生成器
import lineOption from '../../JS/chartOptions/line'
import barOption from '../../JS/chartOptions/bar'
import pieOption from '../../JS/chartOptions/pie'
import scatterOption from '../../JS/chartOptions/scatter'
import mapOption from '../../JS/chartOptions/map'
import candlestickOption from '../chartOptions/candlestick'
import heatmapOption from '../chartOptions/heatmap'
import radarOption from '../chartOptions/radar'
import boxplotOption from '../chartOptions/boxplot'
import graphOption from '../chartOptions/graph'
import treeOption from '../chartOptions/tree'
import treemapOption from '../chartOptions/treemap'
import sunburstOption from '../chartOptions/sunburst'
import parallelOption from '../chartOptions/parallel'
import sankeyOption from '../chartOptions/sankey'
import funnelOption from '../chartOptions/funnel'
import gaugeOption from '../chartOptions/gauge'
import pictorialBarOption from '../chartOptions/pictorialBar'
import themeRiverOption from '../chartOptions/themeRiver'
import calendarOption from '../chartOptions/calendar'
// ...可继续导入更多类型

// 图表类型注册表
const chartOptionGenerators = {};

// 注册新类型生成器接口
export function registerChartOptionGenerator(type, generatorFn) {
    chartOptionGenerators[type.toLowerCase()] = generatorFn;
}

// 注册模块化生成器
registerChartOptionGenerator('Line', lineOption)
registerChartOptionGenerator('Bar', barOption)
registerChartOptionGenerator('Pie', pieOption)
registerChartOptionGenerator('Scatter', scatterOption)
registerChartOptionGenerator('Geo_Map', mapOption)
registerChartOptionGenerator('Candlestick', candlestickOption)
registerChartOptionGenerator('heatmap', heatmapOption)
registerChartOptionGenerator('Radar', radarOption)
registerChartOptionGenerator('Boxplot', boxplotOption)
registerChartOptionGenerator('Graph', graphOption)
registerChartOptionGenerator('Tree', treeOption)
registerChartOptionGenerator('Treemap', treemapOption)
registerChartOptionGenerator('Sunburst', sunburstOption)
registerChartOptionGenerator('Parallel', parallelOption)
registerChartOptionGenerator('Sankey', sankeyOption)
registerChartOptionGenerator('Funnel', funnelOption)
registerChartOptionGenerator('Gauge', gaugeOption)
registerChartOptionGenerator('PictorialBar', pictorialBarOption)
registerChartOptionGenerator('ThemeRiver', themeRiverOption)
registerChartOptionGenerator('Calendar', calendarOption)
// ...可继续注册更多类型

// 主入口：根据类型分发
export async function generateEChartOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    //! 控制台显示传入的所有字段
    console.log('[generateEChartOption] config:', config);
    console.log('[generateEChartOption] fileDataMap:', fileDataMap);
    console.log('[generateEChartOption] xData:', xData);
    console.log('[generateEChartOption] yDataArr:', yDataArr);
    console.log('[generateEChartOption] selectedChartType:', selectedChartType);
    console.log('[generateEChartOption] seriesData:', seriesData);
    console.log('[generateEChartOption] customOption:', customOption);

    const type = selectedChartType.value.toLowerCase();
    const generator = chartOptionGenerators[type];
    console.log('[generator]', type, generator);
    if (!generator) {
        throw new Error(`No chart option generator registered for type: ${type}`);
    }
    const option = await generator(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption);

    // //! 调试输出
    // console.log('[generateEChartOption] Type:', type);
    // console.log('[generateEChartOption] Generated option:', option);
    return option;
}
