/* eslint-disable */

// 说明书配置文件
export const instructionConfig = {
    // 主模块配置
    modules: [
        {
            id: 'quick-start',
            title: 'Fast Start',
            icon: '🚀',
            description: '快速上手指南和基础概念',
            badge: '',
            children: [],
            tocItems: [
                {
                    id: 'overview',
                    title: 'Overview',
                    icon: '👋',
                    children: [
                        { id: 'what-is-fuck-charts', title: 'What is Fuck Charts', icon: '❓' },
                        { id: 'key-features', title: 'Core Features', icon: '⭐' },
                        { id: 'architecture', title: 'Software Architecture', icon: '🏗️' }
                    ]
                },
                {
                    id: 'installation',
                    title: 'Deployment Installation',
                    icon: '📦',
                    children: [
                        { id: 'source-download', title: 'Source Code', icon: '🔧' },
                        { id: 'package-download', title: 'Package', icon: '📦' },
                    ]
                },
                {
                    id: 'first-chart',
                    title: 'Your First Chart',
                    icon: '🎯',
                    children: [
                        { id: 'upload-data', title: 'Upload File', icon: '📁' },
                        { id: 'select-chart-type', title: 'Select Chart Type', icon: '🖱️' },
                        { id: 'configure-chart', title: 'Configure Chart', icon: '⚙️' },
                        { id: 'generate-chart', title: 'Generate Chart', icon: '📊' },
                        { id: 'customize-style', title: 'Customize Style', icon: '🎨' }
                    ]
                }
            ]
        },
        {
            id: 'data-visualization',
            title: 'Data Visualization',
            icon: '📊',
            description: '各种图表类型和可视化功能',
            badge: '',
            children: [
                {
                    id: 'basic-charts',
                    title: '基础图表',
                    count: 4,
                    charts: ['Line', 'Bar', 'Pie', 'Scatter']
                },
                {
                    id: 'geo-charts',
                    title: '地理图表',
                    count: 1,
                    charts: ['Geo_Map']
                },
                {
                    id: 'relation-charts',
                    title: '关系图表',
                    count: 3,
                    charts: ['Graph', 'Tree', 'Sankey']
                },
                {
                    id: 'statistical-charts',
                    title: '统计图表',
                    count: 3,
                    charts: ['Boxplot', 'Radar', 'Heatmap']
                },
                {
                    id: 'special-charts',
                    title: '特殊图表',
                    count: 9,
                    charts: ['Candlestick', 'Funnel', 'Gauge', 'PictorialBar', 'ThemeRiver', 'Calendar', 'Treemap', 'Sunburst', 'Parallel']
                }
            ],
            tocItems: [
                {
                    id: 'chart-basics',
                    title: '图表基础',
                    icon: '📈',
                    children: [
                        { id: 'chart-types-overview', title: '图表类型概览', icon: '🔍' },
                        { id: 'data-mapping', title: '数据映射', icon: '🔗' },
                        { id: 'chart-configuration', title: '图表配置', icon: '⚙️' }
                    ]
                },
                {
                    id: 'basic-charts-detail',
                    title: '基础图表',
                    icon: '📊',
                    children: [
                        { id: 'line-chart', title: '折线图 (Line)', icon: '📈' },
                        { id: 'bar-chart', title: '柱状图 (Bar)', icon: '📊' },
                        { id: 'pie-chart', title: '饼图 (Pie)', icon: '🥧' },
                        { id: 'scatter-chart', title: '散点图 (Scatter)', icon: '🔴' }
                    ]
                },
                {
                    id: 'geo-charts-detail',
                    title: '地理图表',
                    icon: '🌍',
                    children: [
                        { id: 'geo-map-basic', title: '地图基础', icon: '🗺️' },
                        { id: 'geo-map-types', title: '地图类型', icon: '📍' },
                        { id: 'geo-map-config', title: '地图配置', icon: '⚙️' }
                    ]
                },
                {
                    id: 'advanced-features',
                    title: '高级功能',
                    icon: '⚡',
                    children: [
                        { id: 'theme-system', title: '主题系统', icon: '🎨' },
                        { id: 'animation-effects', title: '动画效果', icon: '🎭' },
                        { id: 'interaction-config', title: '交互配置', icon: '🖱️' },
                        { id: 'chart-history', title: '图表历史', icon: '📋' }
                    ]
                }
            ]
        },
        {
            id: 'data-preprocessing',
            title: 'Data Preprocessing 🚧',
            icon: '🔍',
            description: '数据清洗、转换和管理功能',
            badge: '预留',
            children: [
                {
                    id: 'file-management',
                    title: '文件管理',
                    description: '文件上传、预览、工作区管理'
                },
                {
                    id: 'data-cleaning',
                    title: '数据清洗',
                    description: '缺失值处理、异常值检测'
                },
                {
                    id: 'data-transformation',
                    title: '数据转换',
                    description: '格式转换、字段映射'
                },
                {
                    id: 'multi-file-merge',
                    title: '多文件整合',
                    description: '关联合并、数据对齐'
                }
            ],
            tocItems: [
                {
                    id: 'file-operations',
                    title: '文件操作',
                    icon: '📁',
                    children: [
                        { id: 'file-upload', title: '文件上传', icon: '⬆️' },
                        { id: 'file-preview', title: '文件预览', icon: '👀' },
                        { id: 'workspace-management', title: '工作区管理', icon: '🗂️' }
                    ]
                },
                {
                    id: 'data-quality',
                    title: '数据质量',
                    icon: '🔍',
                    children: [
                        { id: 'missing-values', title: '缺失值处理', icon: '❓' },
                        { id: 'outlier-detection', title: '异常值检测', icon: '⚠️' },
                        { id: 'data-validation', title: '数据验证', icon: '✅' }
                    ]
                },
                {
                    id: 'data-integration',
                    title: '数据整合',
                    icon: '🔗',
                    children: [
                        { id: 'merge-strategies', title: '合并策略', icon: '🤝' },
                        { id: 'join-operations', title: '连接操作', icon: '🔗' },
                        { id: 'data-alignment', title: '数据对齐', icon: '📐' }
                    ]
                }
            ]
        },
        {
            id: 'mathematical-modeling',
            title: 'Mathematical Modeling 🚧',
            icon: '✏️',
            description: '统计分析和机器学习功能',
            badge: '预留',
            children: [
                {
                    id: 'cluster-analysis',
                    title: '聚类分析',
                    description: 'K-means、层次聚类等'
                },
                {
                    id: 'regression-analysis',
                    title: '回归分析',
                    description: '线性回归、多项式回归'
                },
                {
                    id: 'predictive-modeling',
                    title: '预测建模',
                    description: '时间序列预测、趋势分析'
                }
            ],
            tocItems: [
                {
                    id: 'statistical-analysis',
                    title: '统计分析',
                    icon: '📊',
                    status: 'in-progress',
                    children: [
                        { id: 'descriptive-stats', title: '描述性统计', icon: '📈', status: 'in-progress' },
                        { id: 'correlation-analysis', title: '相关性分析', icon: '🔗', status: 'in-progress' }
                    ]
                },
                {
                    id: 'clustering',
                    title: '聚类分析',
                    icon: '🎯',
                    children: [
                        { id: 'kmeans-clustering', title: 'K-means聚类', icon: '⭕' },
                        { id: 'hierarchical-clustering', title: '层次聚类', icon: '🌳' }
                    ]
                },
                {
                    id: 'forecasting',
                    title: '预测建模',
                    icon: '🔮',
                    children: [
                        { id: 'time-series', title: '时间序列分析', icon: '📅' },
                        { id: 'trend-analysis', title: '趋势分析', icon: '📈' }
                    ]
                }
            ]
        },
        {
            id: 'developer-guide',
            title: 'Developer Guide',
            icon: '👨‍💻',
            description: '扩展开发和API文档',
            badge: '',
            children: [
                {
                    id: 'architecture-guide',
                    title: '架构指南',
                    description: '系统架构和设计模式'
                },
                {
                    id: 'api-reference',
                    title: 'API参考',
                    description: '接口文档和使用说明'
                },
                {
                    id: 'plugin-development',
                    title: '插件开发',
                    description: '自定义图表和功能扩展'
                },
                {
                    id: 'contribution-guide',
                    title: '贡献指南',
                    description: '参与项目开发的指南'
                }
            ],
            tocItems: [
                {
                    id: 'system-architecture',
                    title: '系统架构',
                    icon: '🏗️',
                    children: [
                        { id: 'frontend-architecture', title: '前端架构', icon: '🖥️' },
                        { id: 'backend-architecture', title: '后端架构', icon: '⚙️' },
                        { id: 'data-flow', title: '数据流设计', icon: '🌊' }
                    ]
                },
                {
                    id: 'development-setup',
                    title: '开发环境',
                    icon: '🔧',
                    children: [
                        { id: 'dev-requirements', title: '开发要求', icon: '📋' },
                        { id: 'project-setup', title: '项目设置', icon: '⚙️' },
                        { id: 'debugging-tips', title: '调试技巧', icon: '🐛' }
                    ]
                },
                {
                    id: 'customization',
                    title: '定制化开发',
                    icon: '🎨',
                    children: [
                        { id: 'custom-charts', title: '自定义图表', icon: '📊' },
                        { id: 'theme-development', title: '主题开发', icon: '🎨' },
                        { id: 'plugin-system', title: '插件系统', icon: '🔌' }
                    ]
                }
            ]
        }
    ],

    // 搜索配置
    search: {
        placeholder: '搜索文档内容...',
        suggestions: [
            { text: '如何创建折线图', icon: '📈', category: '图表' },
            { text: '地图配置参数', icon: '🗺️', category: '配置' },
            { text: '数据上传格式', icon: '📁', category: '数据' },
            { text: '主题切换方法', icon: '🎨', category: '样式' },
            { text: '图表历史管理', icon: '📋', category: '功能' }
        ],
        quickActions: [
            { icon: '📊', label: '图表类型', action: 'chart-types', shortcut: 'Ctrl+1' },
            { icon: '🔧', label: '配置选项', action: 'config-options', shortcut: 'Ctrl+2' },
            { icon: '📝', label: '示例代码', action: 'examples', shortcut: 'Ctrl+3' },
            { icon: '🎨', label: '主题样式', action: 'themes', shortcut: 'Ctrl+4' }
        ]
    },

    // 导航配置
    navigation: {
        showProgress: true,
        autoExpand: true,
        maxDepth: 3,
        stickyToc: true
    },
}

export default instructionConfig
