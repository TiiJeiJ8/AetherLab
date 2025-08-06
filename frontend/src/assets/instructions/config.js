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
            badge: '🚧',
            children: [],
            tocItems: [
                {
                    id: 'overview',
                    title: 'Overview',
                    icon: '👋',
                    children: [
                        { id: 'what-is-aetherLab', title: 'What is AetherLab', icon: '❓' },
                        { id: 'key-features', title: 'Core Features', icon: '⭐' },
                        { id: 'architecture', title: 'Software Architecture', icon: '🏗️' }
                    ]
                },
                {
                    id: 'installation',
                    title: 'Deployment',
                    icon: '📦',
                    children: [
                        { id: 'source-download', title: 'Source Code', icon: '🗒' },
                        { id: 'package-download', title: 'Package', icon: '📦' },
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
            children: [
                {
                    id: 'basic-charts',
                    title: 'Basic Charts',
                    count: 4,
                    charts: ['Line', 'Bar', 'Pie', 'Scatter']
                },
                {
                    id: 'geo-charts',
                    title: 'Geographical Charts',
                    count: 1,
                    charts: ['Geo_Map']
                },
                {
                    id: 'relation-charts',
                    title: 'Relationship Charts',
                    count: 3,
                    charts: ['Graph', 'Tree', 'Sankey']
                },
                {
                    id: 'statistical-charts',
                    title: 'Statistical Charts',
                    count: 3,
                    charts: ['Boxplot', 'Radar', 'Heatmap']
                },
                {
                    id: 'special-charts',
                    title: 'Special Charts',
                    count: 9,
                    charts: ['Candlestick', 'Funnel', 'Gauge', 'PictorialBar', 'ThemeRiver', 'Calendar', 'Treemap', 'Sunburst', 'Parallel']
                }
            ],
            tocItems: [
                {
                    id: 'chart-basics',
                    title: 'Chart Basics',
                    icon: '📈',
                    children: [
                        { id: 'chart-types-overview', title: 'Chart Types Overview', icon: '🔍' },
                        { id: 'data-mapping', title: 'Data Mapping', icon: '🔗' },
                        { id: 'chart-configuration', title: 'Chart Configuration', icon: '⚙️' }
                    ]
                },
                {
                    id: 'basic-charts-detail',
                    title: 'Basic Charts',
                    icon: '📊',
                    children: [
                        { id: 'line-chart', title: 'Line Chart', icon: '📈' },
                        { id: 'bar-chart', title: 'Bar Chart', icon: '📊' },
                        { id: 'pie-chart', title: 'Pie Chart', icon: '🥧' },
                        { id: 'scatter-chart', title: 'Scatter Chart', icon: '🔴' }
                    ]
                },
                {
                    id: 'geo-charts-detail',
                    title: 'Geographical Charts',
                    icon: '🌍',
                    children: [
                        { id: 'geo-map-basic', title: 'Map Basics', icon: '🗺️' },
                        { id: 'geo-map-types', title: 'Map Types', icon: '📍' },
                        { id: 'geo-map-config', title: 'Map Configuration', icon: '⚙️' }
                    ]
                },
                {
                    id: 'advanced-features',
                    title: 'Advanced Features',
                    icon: '⚡',
                    children: [
                        { id: 'theme-system', title: 'Theme System', icon: '🎨' },
                        { id: 'animation-effects', title: 'Animation Effects', icon: '🎭' },
                        { id: 'interaction-config', title: 'Interaction Configuration', icon: '🖱️' },
                        { id: 'chart-history', title: 'Chart History', icon: '📋' }
                    ]
                }
            ]
        },
        {
            id: 'data-preprocessing',
            title: 'Data Preprocessing',
            icon: '🔍',
            description: 'Data cleaning, transformation, and management features',
            badge: '🚧',
            children: [
                {
                    id: 'file-management',
                    title: 'File Management',
                    description: 'File upload, preview, workspace management'
                },
                {
                    id: 'data-cleaning',
                    title: 'Data Cleaning',
                    description: 'Missing value handling, outlier detection'
                },
                {
                    id: 'data-transformation',
                    title: 'Data Transformation',
                    description: 'Format conversion, field mapping'
                },
                {
                    id: 'multi-file-merge',
                    title: 'Multi-file Integration',
                    description: 'Relational merge, data alignment'
                }
            ],
            tocItems: [
                {
                    id: 'file-operations',
                    title: 'File Operations',
                    icon: '📁',
                    children: [
                        { id: 'file-upload', title: 'File Upload', icon: '⬆️' },
                        { id: 'file-preview', title: 'File Preview', icon: '👀' },
                        { id: 'workspace-management', title: 'Workspace Management', icon: '🗂️' }
                    ]
                },
                {
                    id: 'data-quality',
                    title: 'Data Quality',
                    icon: '🔍',
                    children: [
                        { id: 'missing-values', title: 'Missing Value Handling', icon: '❓' },
                        { id: 'outlier-detection', title: 'Outlier Detection', icon: '⚠️' },
                        { id: 'data-validation', title: 'Data Validation', icon: '✅' }
                    ]
                },
                {
                    id: 'data-integration',
                    title: 'Data Integration',
                    icon: '🔗',
                    children: [
                        { id: 'merge-strategies', title: 'Merge Strategies', icon: '🤝' },
                        { id: 'join-operations', title: 'Join Operations', icon: '🔗' },
                        { id: 'data-alignment', title: 'Data Alignment', icon: '📐' }
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
            children: [
                {
                    id: 'cluster-analysis',
                    title: 'Cluster Analysis',
                    description: 'K-means, hierarchical clustering, etc.'
                },
                {
                    id: 'regression-analysis',
                    title: 'Regression Analysis',
                    description: 'Linear regression, polynomial regression'
                },
                {
                    id: 'predictive-modeling',
                    title: 'Predictive Modeling',
                    description: 'Time series forecasting, trend analysis'
                }
            ],
            tocItems: [
                {
                    id: 'statistical-analysis',
                    title: 'Statistical Analysis',
                    icon: '📊',
                    status: 'in-progress',
                    children: [
                        { id: 'descriptive-stats', title: 'Descriptive Statistics', icon: '📈', status: 'in-progress' },
                        { id: 'correlation-analysis', title: 'Correlation Analysis', icon: '🔗', status: 'in-progress' }
                    ]
                },
                {
                    id: 'clustering',
                    title: 'Cluster Analysis',
                    icon: '🎯',
                    children: [
                        { id: 'kmeans-clustering', title: 'K-means Clustering', icon: '⭕' },
                        { id: 'hierarchical-clustering', title: 'Hierarchical Clustering', icon: '🌳' }
                    ]
                },
                {
                    id: 'forecasting',
                    title: 'Predictive Modeling',
                    icon: '🔮',
                    children: [
                        { id: 'time-series', title: 'Time Series Analysis', icon: '📅' },
                        { id: 'trend-analysis', title: 'Trend Analysis', icon: '📈' }
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
            children: [
                {
                    id: 'architecture-guide',
                    title: 'Architecture Guide',
                    description: 'System architecture and design patterns'
                },
                {
                    id: 'api-reference',
                    title: 'API Reference',
                    description: 'API documentation and usage instructions'
                },
                {
                    id: 'plugin-development',
                    title: 'Plugin Development',
                    description: 'Custom charts and feature extensions'
                },
                {
                    id: 'contribution-guide',
                    title: 'Contribution Guide',
                    description: 'Guidelines for contributing to the project'
                }
            ],
            tocItems: [
                {
                    id: 'system-architecture',
                    title: 'System Architecture',
                    icon: '🏗️',
                    children: [
                        { id: 'frontend-architecture', title: 'Frontend Architecture', icon: '🖥️' },
                        { id: 'backend-architecture', title: 'Backend Architecture', icon: '⚙️' },
                        { id: 'data-flow', title: 'Data Flow Design', icon: '🌊' }
                    ]
                },
                {
                    id: 'development-setup',
                    title: 'Development Environment',
                    icon: '🔧',
                    children: [
                        { id: 'dev-requirements', title: 'Development Requirements', icon: '📋' },
                        { id: 'project-setup', title: 'Project Setup', icon: '⚙️' },
                        { id: 'debugging-tips', title: 'Debugging Tips', icon: '🐛' }
                    ]
                },
                {
                    id: 'customization',
                    title: 'Customization Development',
                    icon: '🎨',
                    children: [
                        { id: 'custom-charts', title: 'Custom Charts', icon: '📊' },
                        { id: 'theme-development', title: 'Theme Development', icon: '🎨' },
                        { id: 'plugin-system', title: 'Plugin System', icon: '🔌' }
                    ]
                }
            ]
        }
    ],

    // 导航配置
    navigation: {
        showProgress: true,
        autoExpand: true,
        maxDepth: 3,
        stickyToc: true
    },
}

export default instructionConfig
