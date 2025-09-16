// ChartsTooltipConfig.js
// 图表提示框配置 - 数据类型要求和使用场景
/* eslint-disable */
export const chartsTooltipConfig = {
    Line: {
        dataRequirements: ["Time Series", "Continuous Data", "Numerical Data"],
        useCases: ["Trend Analysis", "Performance Tracking", "Time-based Comparison"],
        description: "Perfect for showing trends and changes over time or continuous variables"
    },
    Bar: {
        dataRequirements: ["Categorical Data", "Numerical Data"],
        useCases: ["Category Comparison"],
        description: "Ideal for comparing discrete categories"
    },
    Area: {
        dataRequirements: ["Time Series", "Continuous Data", "Numerical Data"],
        useCases: ["Trend Analysis", "Performance Tracking"],
        description: "Shows trends and cumulative values over time or continuous variables"
    },
    Pie: {
        dataRequirements: ["Categorical Data", "Proportion Data"],
        useCases: ["Proportion Analysis"],
        description: "Shows proportional relationships in data"
    },
    Scatter: {
        dataRequirements: ["Continuous Data", "Numerical Data", "Correlation Data"],
        useCases: ["Correlation Analysis", "Outlier Detection"],
        description: "Reveals relationships between two continuous variables"
    },
    Geo_Map: {
        dataRequirements: ["Geographic Data"],
        useCases: ["Geographic Analysis"],
        description: "Visualizes data with geographic context"
    },
    Candlestick: {
        dataRequirements: ["Financial Data", "Time Series"],
        useCases: ["Financial Analysis"],
        description: "Specialized for financial data visualization"
    },
    Radar: {
        dataRequirements: ["Multidimensional Data", "Numerical Data"],
        useCases: ["Performance Comparison"],
        description: "Compares multiple metrics simultaneously"
    },
    Boxplot: {
        dataRequirements: ["Numerical Data", "Statistical Data"],
        useCases: ["Statistical Analysis", "Outlier Detection"],
        description: "Shows statistical distribution and outliers"
    },
    Heatmap: {
        dataRequirements: ["Matrix Data", "Intensity Data"],
        useCases: ["Pattern Recognition"],
        description: "Reveals patterns through color intensity"
    },
    Graph: {
        dataRequirements: ["Network Data"],
        useCases: ["Network Analysis"],
        description: "Visualizes relationships and connections"
    },
    Tree: {
        dataRequirements: ["Hierarchical Data"],
        useCases: ["Hierarchical Visualization"],
        description: "Shows hierarchical relationships"
    },
    Treemap: {
        dataRequirements: ["Hierarchical Data", "Size Data"],
        useCases: ["Hierarchical Proportion"],
        description: "Displays hierarchical data with proportional areas"
    },
    Sunburst: {
        dataRequirements: ["Hierarchical Data"],
        useCases: ["Hierarchical Analysis"],
        description: "Interactive hierarchical visualization"
    },
    Parallel: {
        dataRequirements: ["Multidimensional Data", "Numerical Data"],
        useCases: ["High-dimensional Analysis"],
        description: "Explores multi-dimensional data relationships"
    },
    Sankey: {
        dataRequirements: ["Flow Data"],
        useCases: ["Flow Analysis"],
        description: "Shows flow and transformation of data"
    },
    Funnel: {
        dataRequirements: ["Sequential Data"],
        useCases: ["Conversion Analysis"],
        description: "Visualizes sequential process stages"
    },
    Gauge: {
        dataRequirements: ["Single Metric"],
        useCases: ["Performance Tracking", "Real-time Dashboard"],
        description: "Displays single (or several) metrics against targets"
    },
    // PictorialBar: {
    //     dataRequirements: ["Categorical Data", "Numerical Data"],
    //     useCases: ["Infographics"],
    //     description: "Combines bar charts with visual elements"
    // },
    ThemeRiver: {
        dataRequirements: ["Time Series", "Stacked Data"],
        useCases: ["Thematic Analysis"],
        description: "Shows thematic changes over time"
    },
    // Calendar: {
    //     dataRequirements: ["Date Data", "Time Series"],
    //     useCases: ["Activity Tracking", "Seasonal Analysis", "Event Visualization", "Time-based Patterns"],
    //     description: "Displays time-based data in calendar format"
    // }
}
