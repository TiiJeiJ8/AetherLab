// ChartsTooltipConfig.js
// 图表提示框配置 - 数据类型要求和使用场景
/* eslint-disable */
export const chartsTooltipConfig = {
    Line: {
        dataRequirements: ["Time Series Data", "Continuous Data"],
        useCases: ["Trend Analysis", "Time Series Visualization", "Performance Tracking", "Data Comparison Over Time"],
        description: "Perfect for showing trends and changes over time"
    },
    Bar: {
        dataRequirements: ["Categorical Data", "Numerical Values"],
        useCases: ["Category Comparison", "Ranking Analysis", "Statistical Distribution", "Survey Results"],
        description: "Ideal for comparing discrete categories"
    },
    Pie: {
        dataRequirements: ["Categorical Data", "Percentage/Proportion"],
        useCases: ["Part-to-Whole Analysis", "Market Share", "Budget Allocation", "Demographic Distribution"],
        description: "Shows proportional relationships in data"
    },
    Scatter: {
        dataRequirements: ["Two Numerical Variables", "Correlation Data"],
        useCases: ["Correlation Analysis", "Outlier Detection", "Regression Analysis", "Data Distribution"],
        description: "Reveals relationships between two variables"
    },
    "GEO/MAP": {
        dataRequirements: ["Geographic Coordinates", "Location Data"],
        useCases: ["Geographic Analysis", "Regional Comparison", "Spatial Distribution", "Location-based Insights"],
        description: "Visualizes data with geographic context"
    },
    Candlestick: {
        dataRequirements: ["OHLC Data", "Time Series", "Financial Data"],
        useCases: ["Stock Analysis", "Financial Trading", "Price Movement", "Market Analysis"],
        description: "Specialized for financial data visualization"
    },
    Radar: {
        dataRequirements: ["Multi-dimensional Data", "Numerical Variables"],
        useCases: ["Performance Comparison", "Skill Assessment", "Multi-criteria Analysis", "Product Comparison"],
        description: "Compares multiple metrics simultaneously"
    },
    Boxplot: {
        dataRequirements: ["Numerical Data", "Statistical Distribution"],
        useCases: ["Statistical Analysis", "Outlier Detection", "Distribution Comparison", "Data Quality Assessment"],
        description: "Shows statistical distribution and outliers"
    },
    Heatmap: {
        dataRequirements: ["Matrix Data", "Intensity Values"],
        useCases: ["Pattern Recognition", "Correlation Matrix", "Density Analysis", "Activity Tracking"],
        description: "Reveals patterns through color intensity"
    },
    Graph: {
        dataRequirements: ["Node-Edge Data", "Relationship Data"],
        useCases: ["Network Analysis", "Social Networks", "Organizational Structure", "Dependency Mapping"],
        description: "Visualizes relationships and connections"
    },
    Tree: {
        dataRequirements: ["Hierarchical Data", "Parent-Child Relationships"],
        useCases: ["Organizational Charts", "Decision Trees", "Taxonomy Visualization", "File Systems"],
        description: "Shows hierarchical relationships"
    },
    Treemap: {
        dataRequirements: ["Hierarchical Data", "Size Values"],
        useCases: ["Hierarchical Proportions", "Disk Usage", "Market Capitalization", "Portfolio Analysis"],
        description: "Displays hierarchical data with proportional areas"
    },
    Sunburst: {
        dataRequirements: ["Hierarchical Data", "Multi-level Categories"],
        useCases: ["Multi-level Analysis", "Nested Categories", "Drill-down Analysis", "Hierarchical Proportions"],
        description: "Interactive hierarchical visualization"
    },
    Parallel: {
        dataRequirements: ["Multi-dimensional Data", "Numerical Variables"],
        useCases: ["High-dimensional Analysis", "Feature Comparison", "Data Filtering", "Pattern Detection"],
        description: "Explores multi-dimensional data relationships"
    },
    Sankey: {
        dataRequirements: ["Flow Data", "Source-Target Relationships"],
        useCases: ["Flow Analysis", "Energy Flow", "Budget Flow", "Process Visualization"],
        description: "Shows flow and transformation of data"
    },
    Funnel: {
        dataRequirements: ["Sequential Data", "Conversion Rates"],
        useCases: ["Conversion Analysis", "Sales Funnel", "Process Optimization", "User Journey"],
        description: "Visualizes sequential process stages"
    },
    Gauge: {
        dataRequirements: ["Single Metric", "Target Values"],
        useCases: ["KPI Monitoring", "Performance Tracking", "Target Achievement", "Real-time Dashboards"],
        description: "Displays single metrics against targets"
    },
    PictorialBar: {
        dataRequirements: ["Categorical Data", "Numerical Values"],
        useCases: ["Engaging Presentations", "Infographics", "Brand Visualization", "Storytelling"],
        description: "Combines bar charts with visual elements"
    },
    ThemeRiver: {
        dataRequirements: ["Time Series", "Stacked Data"],
        useCases: ["Evolution Analysis", "Trend Comparison", "Topic Evolution", "Thematic Changes"],
        description: "Shows thematic changes over time"
    },
    Calendar: {
        dataRequirements: ["Date-based Data", "Time Series"],
        useCases: ["Activity Tracking", "Seasonal Analysis", "Event Visualization", "Time-based Patterns"],
        description: "Displays time-based data in calendar format"
    }
}
