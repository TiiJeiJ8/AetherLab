/* eslint-disable */

// 说明书配置文件
export const instructionConfig = {
    // 主模块配置
    modules: [
        {
            id: 'quick-start',
            title: 'Quick Start',
            icon: '🚀',
            description: 'Quick start guide and basic concepts',
            badge: '',
            children: [],
            tocItems: [
                {
                    id: 'top',
                    title: 'To the Top',
                    icon: '🔝',
                    children: []
                },
                {
                    id: 'overview',
                    title: 'Overview',
                    icon: '👋',
                    children: [
                        { id: 'what-is-aetherLab', title: 'What is AetherLab', icon: '' },
                        { id: 'key-features', title: 'Core Features', icon: '' },
                        { id: 'architecture', title: 'Software Architecture', icon: '' }
                    ]
                },
                {
                    id: 'installation',
                    title: 'Deployment',
                    icon: '📦',
                    children: [
                        { id: 'source-download', title: 'Source Code', icon: '' },
                        { id: 'package-download', title: 'Package', icon: '' },
                    ]
                },
                {
                    id: 'first-chart',
                    title: 'Your First Chart',
                    icon: '🎯',
                    children: []
                },
            ]
        },
        {
            id: 'data-visualization',
            title: 'Data Visualization',
            icon: '📊',
            description: 'Various chart types and visualization features',
            badge: '🚧',
            children: [],
            tocItems: [
                {
                    id: 'top',
                    title: 'To the Top',
                    icon: '🔝',
                    children: []
                },
                {
                    id: 'generation-process',
                    title: 'Generation Process',
                    icon: '⚙️',
                    children: []
                },
                {
                    id: 'chart-gallery',
                    title: 'Chart Gallery',
                    icon: '🖼️',
                    children: [
                        { id: 'chart-categories', title: 'Chart Categories', icon: '' }
                    ]
                },
                {
                    id: 'chart-selection-guide',
                    title: 'Choose a Chart',
                    icon: '🧭',
                    children: [
                        { id: 'selection-principles', title: 'Selection Principles', icon: '' },
                        { id: 'scenarios', title: 'Common Scenarios', icon: '' }
                    ]
                },
                {
                    id: 'chart-details',
                    title: 'Details & Examples',
                    icon: '📈',
                    children: [
                        {
                            id: 'basic-charts',
                            title: 'Basic Charts',
                            icon: '',
                            children: [
                                { id: 'line-chart', title: 'Line', icon: '' },
                                { id: 'area-chart', title: 'Area', icon: '' },
                                { id: 'bar-chart', title: 'Bar', icon: '' },
                                { id: 'pie-chart', title: 'Pie', icon: '' },
                                { id: 'scatter-chart', title: 'Scatter', icon: '' },
                                { id: 'radar-chart', title: 'Radar', icon: '' }
                            ]
                        },
                        {
                            id: 'geospatial-charts',
                            title: 'Geospatial Charts',
                            icon: '',
                            children: [
                                { id: 'geo-map-chart', title: 'Geo of Map', icon: '' },
                                { id: 'geo-heatmap-chart', title: 'Geo of Heatmap', icon: '' },
                                { id: 'geo-scatter-chart', title: 'Geo of Scatter', icon: '' },
                                { id: 'geo-pie-chart', title: 'Geo of Pie', icon: '' },
                            ]
                        }, {
                            id: 'financial-charts',
                            title: 'Financial Charts',
                            icon: '',
                            children: [
                                { id: 'candlestick-chart', title: 'Candlestick', icon: '' },
                            ]
                        }, {
                            id: 'statistical-charts',
                            title: 'Statistical Charts',
                            icon: '',
                            children: [
                                { id: 'boxplot-chart', title: 'Boxplot', icon: '' },
                                { id: 'heatmap-chart', title: 'Heatmap', icon: '' },
                            ]
                        }, {
                            id: 'advanced-charts',
                            title: 'Advanced Charts',
                            icon: '',
                            children: [
                                { id: 'nightingale-chart', title: 'Nightingale Rose', icon: '' },
                                { id: 'doughnut-chart', title: 'Doughnut', icon: '' },
                                { id: 'parallel-chart', title: 'Parallel', icon: '' },
                                { id: 'ripple-chart', title: 'Ripple', icon: '' }
                            ]
                        }, {
                            id: 'network-charts',
                            title: 'Network Charts',
                            icon: '',
                            children: [
                                { id: 'graph-chart', title: 'Graph', icon: '' },
                            ]
                        }, {
                            id: 'hierarchical-charts',
                            title: 'Hierarchical Charts',
                            icon: '',
                            children: [
                                { id: 'tree-chart', title: 'Tree', icon: '' },
                                { id: 'treemap-chart', title: 'Treemap', icon: '' },
                                { id: 'sunburst-chart', title: 'Sunburst', icon: '' }
                            ]
                        }, {
                            id: 'flow-charts',
                            title: 'Flow Charts',
                            icon: '',
                            children: [
                                { id: 'sankey-chart', title: 'Sankey', icon: '' },
                                { id: 'funnel-chart', title: 'Funnel', icon: '' },
                                { id: 'themeRiver-chart', title: 'ThemeRiver', icon: '' }
                            ]
                        }, {
                            id: 'indicator-charts',
                            title: 'Indicator Charts',
                            icon: '',
                            children: [
                                { id: 'gauge-chart', title: 'Gauge', icon: '' },
                            ]
                        },
                        // ... more chart types & categories
                    ]
                },
                {
                    id: 'history',
                    title: 'Chart History',
                    icon: '🕑',
                    children: []
                },
                {
                    id: 'roadmap',
                    title: 'Future Plans',
                    icon: '🚀',
                    children: []
                }
            ]
        },
        {
            id: 'data-preprocessing',
            title: 'Data Preprocessing',
            icon: '🔍',
            description: 'Data cleaning, transformation, and management features',
            badge: '🚧',
            children: [],
            tocItems: [
                {
                    id: 'top',
                    title: 'To the Top',
                    icon: '🔝',
                    children: []
                },
                {
                    id: 'file-operations',
                    title: 'File Operations',
                    icon: '📁',
                    children: [
                        { id: 'file-upload', title: 'File Upload', icon: '⬆' },
                        { id: 'file-preview', title: 'File Preview', icon: '' },
                        { id: 'workspace-management', title: 'Workspace Management', icon: '' }
                    ]
                },
                {
                    id: 'data-quality',
                    title: 'Data Quality',
                    icon: '🔍',
                    children: [
                        { id: 'missing-values', title: 'Missing Value Handling', icon: '' },
                        { id: 'outlier-detection', title: 'Outlier Detection', icon: '' },
                        { id: 'data-validation', title: 'Data Validation', icon: '' }
                    ]
                },
                {
                    id: 'data-integration',
                    title: 'Data Integration',
                    icon: '🔗',
                    children: [
                        { id: 'merge-strategies', title: 'Merge Strategies', icon: '' },
                        { id: 'join-operations', title: 'Join Operations', icon: '' },
                        { id: 'data-alignment', title: 'Data Alignment', icon: '' }
                    ]
                }
            ]
        },
        {
            id: 'mathematical-modeling',
            title: 'Mathematical Modeling',
            icon: '✏️',
            description: 'Statistical analysis and machine learning features',
            badge: '🚧',
            children: [],
            tocItems: [
                {
                    id: 'top',
                    title: 'To the Top',
                    icon: '🔝',
                    children: []
                },
                {
                    id: 'statistical-analysis',
                    title: 'Statistical Analysis',
                    icon: '📊',
                    status: 'in-progress',
                    children: [
                        { id: 'descriptive-stats', title: 'Descriptive Statistics', icon: '', status: 'in-progress' },
                        { id: 'correlation-analysis', title: 'Correlation Analysis', icon: '', status: 'in-progress' }
                    ]
                },
                {
                    id: 'clustering',
                    title: 'Cluster Analysis',
                    icon: '🎯',
                    children: [
                        { id: 'kmeans-clustering', title: 'K-means Clustering', icon: '' },
                        { id: 'hierarchical-clustering', title: 'Hierarchical Clustering', icon: '' }
                    ]
                },
                {
                    id: 'forecasting',
                    title: 'Predictive Modeling',
                    icon: '🔮',
                    children: [
                        { id: 'time-series', title: 'Time Series Analysis', icon: '' },
                        { id: 'trend-analysis', title: 'Trend Analysis', icon: '' }
                    ]
                }
            ]
        },
        {
            id: 'developer-guide',
            title: 'Developer Guide',
            icon: '👨‍💻',
            description: 'Extension development and API documentation',
            badge: '🚧',
            children: [],
            tocItems: [
                {
                    id: 'top',
                    title: 'To the Top',
                    icon: '🔝',
                    children: []
                },
                {
                    id: 'system-architecture',
                    title: 'System Architecture',
                    icon: '🏗️',
                    children: [
                        { id: 'frontend-architecture', title: 'Frontend Architecture', icon: '' },
                        { id: 'backend-architecture', title: 'Backend Architecture', icon: '' },
                        { id: 'data-flow', title: 'Data Flow Design', icon: '' }
                    ]
                },
                {
                    id: 'development-setup',
                    title: 'Development Environment',
                    icon: '🔧',
                    children: [
                        { id: 'dev-requirements', title: 'Development Requirements', icon: '' },
                        { id: 'project-setup', title: 'Project Setup', icon: '' },
                        { id: 'debugging-tips', title: 'Debugging Tips', icon: '' }
                    ]
                },
                {
                    id: 'customization',
                    title: 'Customization Development',
                    icon: '🎨',
                    children: [
                        { id: 'custom-charts', title: 'Custom Charts', icon: '' },
                        { id: 'theme-development', title: 'Theme Development', icon: '' },
                        { id: 'plugin-system', title: 'Plugin System', icon: '' }
                    ]
                }
            ]
        }
    ],

    // 导航配置
    navigation: {
        autoExpand: true,
        maxDepth: 3,
        stickyToc: true
    },
}

export default instructionConfig
