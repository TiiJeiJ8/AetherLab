<template>
<div class="data-preprocessing-module">
    <section id="data-upload" class="content-section">
    <h1>🔍<br>预处理</h1>
    <p class="section-description">了解如何准备和处理数据，确保最佳的可视化效果。</p>

    <div class="upload-steps">
        <div class="step-card" v-for="(step, index) in uploadSteps" :key="step.id">
        <div class="step-header">
            <span class="step-number">{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
        </div>
        <p>{{ step.description }}</p>
        <div v-if="step.formats" class="format-tags">
            <span class="format-tag" v-for="format in step.formats" :key="format">
            {{ format }}
            </span>
        </div>
        </div>
    </div>
    </section>

    <section id="data-formats" class="content-section">
    <h2>📁 支持的数据格式</h2>
    <div class="formats-grid">
        <div class="format-card" v-for="format in supportedFormats" :key="format.id">
        <div class="format-icon">{{ format.icon }}</div>
        <h4>{{ format.name }}</h4>
        <p>{{ format.description }}</p>
        <div class="format-features">
            <span class="feature-item" v-for="feature in format.features" :key="feature">
            ✓ {{ feature }}
            </span>
        </div>
        </div>
    </div>
    </section>

    <section id="data-cleaning" class="content-section">
    <h2>🧹 数据清洗</h2>
    <div class="cleaning-tools">
        <div class="tool-category" v-for="category in cleaningTools" :key="category.id">
        <h3>{{ category.icon }} {{ category.title }}</h3>
        <div class="tools-list">
            <div class="tool-item" v-for="tool in category.tools" :key="tool.id">
            <div class="tool-header">
                <span class="tool-icon">{{ tool.icon }}</span>
                <h4>{{ tool.name }}</h4>
            </div>
            <p>{{ tool.description }}</p>
            <div v-if="tool.example" class="tool-example">
                <strong>示例：</strong>{{ tool.example }}
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="data-transformation" class="content-section">
    <h2>🔄 数据转换</h2>
    <div class="transformation-types">
        <div class="transform-card" v-for="transform in transformations" :key="transform.id">
        <div class="transform-icon">{{ transform.icon }}</div>
        <div class="transform-content">
            <h4>{{ transform.name }}</h4>
            <p>{{ transform.description }}</p>
            <div class="transform-use-cases">
            <strong>适用场景：</strong>
            <ul>
                <li v-for="useCase in transform.useCases" :key="useCase">{{ useCase }}</li>
            </ul>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="data-validation" class="content-section">
    <h2>✅ 数据验证</h2>
    <div class="validation-checklist">
        <div class="checklist-category" v-for="category in validationChecks" :key="category.id">
        <h3>{{ category.title }}</h3>
        <div class="check-items">
            <div class="check-item" v-for="check in category.checks" :key="check.id">
            <span class="check-icon">{{ check.icon }}</span>
            <div class="check-content">
                <h4>{{ check.title }}</h4>
                <p>{{ check.description }}</p>
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="common-issues" class="content-section">
    <h2>⚠️ 常见问题</h2>
    <div class="issues-accordion">
        <div class="issue-item" v-for="issue in commonIssues" :key="issue.id">
        <div class="issue-header" @click="toggleIssue(issue.id)">
            <span class="issue-icon">{{ issue.icon }}</span>
            <h4>{{ issue.title }}</h4>
            <span class="toggle-icon" :class="{ 'expanded': expandedIssues.includes(issue.id) }">▼</span>
        </div>
        <div class="issue-content" :class="{ 'expanded': expandedIssues.includes(issue.id) }">
            <p><strong>问题描述：</strong>{{ issue.problem }}</p>
            <p><strong>解决方案：</strong>{{ issue.solution }}</p>
            <div v-if="issue.tips" class="issue-tips">
            <strong>小贴士：</strong>
            <ul>
                <li v-for="tip in issue.tips" :key="tip">{{ tip }}</li>
            </ul>
            </div>
        </div>
        </div>
    </div>
    </section>
</div>
</template>

<script setup>
/* eslint-disable */
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['section-change'])
const expandedIssues = ref([])

const uploadSteps = [
    {
        id: 'select',
        title: '选择文件',
        description: '点击"Files"按钮或拖拽文件到上传区域',
        formats: ['CSV', 'Excel', 'JSON', 'TSV']
    },
    {
        id: 'preview',
        title: '预览数据',
        description: '系统会自动解析并显示数据预览，检查数据结构',
        formats: null
    },
    {
        id: 'configure',
        title: '配置参数',
        description: '设置分隔符、编码格式、表头行等解析参数',
        formats: null
    },
    {
        id: 'validate',
        title: '验证数据',
        description: '检查数据质量，处理缺失值和异常值',
        formats: null
    }
]

const supportedFormats = [
    {
        id: 'csv',
        name: 'CSV',
        icon: '📄',
        description: '逗号分隔值文件，最常用的数据交换格式',
        features: ['轻量级', '通用性强', '易于编辑', '支持大文件']
    },
    {
        id: 'excel',
        name: 'Excel',
        icon: '📊',
        description: 'Microsoft Excel格式，支持多工作表',
        features: ['多工作表', '格式丰富', '公式支持', 'XLSX/XLS']
    },
    {
        id: 'json',
        name: 'JSON',
        icon: '📋',
        description: 'JavaScript对象标记，适合结构化数据',
        features: ['层次结构', '嵌套数据', 'Web友好', '标准格式']
    },
    {
        id: 'tsv',
        name: 'TSV',
        icon: '📝',
        description: '制表符分隔值文件，适合包含逗号的数据',
        features: ['制表符分隔', '兼容性好', '处理逗号', '纯文本']
    }
]

const cleaningTools = [
    {
        id: 'missing-data',
        title: '缺失值处理',
        icon: '❓',
        tools: [
        {
            id: 'remove-null',
            name: '删除空值',
            icon: '🗑️',
            description: '移除包含空值的行或列',
            example: '删除所有包含 null 或 undefined 的记录'
        },
        {
            id: 'fill-values',
            name: '填充数值',
            icon: '🔄',
            description: '用指定值或统计值填充缺失数据',
            example: '用平均值填充数值型字段的缺失值'
        }
        ]
    },
    {
        id: 'data-filtering',
        title: '数据筛选',
        icon: '🔍',
        tools: [
        {
            id: 'range-filter',
            name: '范围筛选',
            icon: '📏',
            description: '根据数值范围过滤数据',
            example: '筛选年龄在 18-65 之间的记录'
        },
        {
            id: 'condition-filter',
            name: '条件筛选',
            icon: '⚡',
            description: '根据复杂条件筛选数据',
            example: '筛选销售额 > 1000 且地区为"北京"的记录'
        }
        ]
    },
    {
        id: 'outlier-detection',
        title: '异常值检测',
        icon: '🎯',
        tools: [
        {
            id: 'statistical',
            name: '统计方法',
            icon: '📊',
            description: '使用统计方法识别异常值',
            example: '基于3σ原则或四分位数识别异常值'
        },
        {
            id: 'manual',
            name: '手动标记',
            icon: '✏️',
            description: '手动标记和处理异常数据点',
            example: '在数据预览中直接标记异常值'
        }
        ]
    }
]

const transformations = [
    {
        id: 'aggregation',
        name: '数据聚合',
        icon: '📊',
        description: '将多行数据合并成单行汇总数据',
        useCases: ['计算每月销售总额', '统计各地区用户数量', '按类别汇总产品信息']
    },
    {
        id: 'pivot',
        name: '数据透视',
        icon: '🔄',
        description: '重新组织数据结构，行列转换',
        useCases: ['将长格式转为宽格式', '创建交叉统计表', '多维数据分析']
    },
    {
        id: 'merge',
        name: '数据合并',
        icon: '🔗',
        description: '基于共同字段合并多个数据源',
        useCases: ['关联用户信息和订单数据', '合并历史数据', '补充维度信息']
    },
    {
        id: 'normalization',
        name: '数据标准化',
        icon: '⚖️',
        description: '将数据缩放到标准范围',
        useCases: ['Min-Max标准化', 'Z-score标准化', '消除量纲影响']
    }
]

const validationChecks = [
    {
        id: 'structure',
        title: '结构验证',
        checks: [
        {
            id: 'columns',
            title: '列结构检查',
            icon: '📋',
            description: '验证数据列的名称、类型和数量是否符合预期'
        },
        {
            id: 'datatypes',
            title: '数据类型验证',
            icon: '🏷️',
            description: '确保每列的数据类型正确（数值、文本、日期等）'
        }
        ]
    },
    {
        id: 'quality',
        title: '质量检查',
        checks: [
        {
            id: 'completeness',
            title: '完整性检查',
            icon: '✅',
            description: '检查缺失值的比例和分布情况'
        },
        {
            id: 'consistency',
            title: '一致性验证',
            icon: '🔄',
            description: '验证数据格式和取值范围的一致性'
        }
        ]
    },
    {
        id: 'business',
        title: '业务规则',
        checks: [
        {
            id: 'range',
            title: '取值范围',
            icon: '📏',
            description: '验证数值是否在合理的业务范围内'
        },
        {
            id: 'logic',
            title: '逻辑关系',
            icon: '🧠',
            description: '检查字段间的逻辑关系是否合理'
        }
        ]
    }
]

const commonIssues = [
    {
        id: 'encoding',
        title: '文件编码问题',
        icon: '🔤',
        problem: '中文或特殊字符显示为乱码',
        solution: '选择正确的编码格式（UTF-8、GBK等）重新解析文件',
        tips: ['UTF-8是推荐的标准编码', '如果不确定编码，可以尝试自动检测', 'Excel文件通常使用GBK编码']
    },
    {
        id: 'separator',
        title: '分隔符识别错误',
        icon: '📐',
        problem: 'CSV文件列划分不正确，数据混合在一起',
        solution: '手动指定正确的分隔符（逗号、分号、制表符等）',
        tips: ['查看原始文件确认分隔符', '注意区分逗号和分号', '制表符分隔较为安全']
    },
    {
        id: 'header',
        title: '表头行设置',
        icon: '📑',
        problem: '数据的第一行被误认为表头或数据',
        solution: '正确设置表头行位置，指定从第几行开始读取数据',
        tips: ['检查文件前几行的内容', '确认表头行的位置', '跳过说明行和空行']
    },
    {
        id: 'large-file',
        title: '大文件处理',
        icon: '📦',
        problem: '文件过大导致上传或处理缓慢',
        solution: '考虑数据采样、分批处理或优化文件格式',
        tips: ['超过100MB的文件建议分批处理', '删除不必要的列和行', '使用CSV格式而非Excel']
    }
]

const toggleIssue = (issueId) => {
    const index = expandedIssues.value.indexOf(issueId)
    if (index > -1) {
        expandedIssues.value.splice(index, 1)
    } else {
        expandedIssues.value.push(issueId)
    }
}

// 监听滚动，更新当前章节
const handleScroll = () => {
    const sections = document.querySelectorAll('.content-section')
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const offsetTop = section.offsetTop - 100
        
        if (scrollTop >= offsetTop) {
        emit('section-change', section.id)
        break
        }
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    emit('section-change', 'data-upload')
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import '../../../assets/CSS/DataPreprocessing_instruction.css'
</style>
