<template>
<div class="data-preprocessing-module">
    <section id="data-upload" class="content-section">
    <h1>🔍<br>Preprocessing</h1>
    <p class="section-description">Learn how to prepare and process data to ensure the best visualization results.</p>

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
    <h2>📁 Supported Data Formats</h2>
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
    <h2>🧹 Data Cleaning</h2>
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
                <strong>Example:</strong> {{ tool.example }}
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="data-transformation" class="content-section">
    <h2>🔄 Data Transformation</h2>
    <div class="transformation-types">
        <div class="transform-card" v-for="transform in transformations" :key="transform.id">
        <div class="transform-icon">{{ transform.icon }}</div>
        <div class="transform-content">
            <h4>{{ transform.name }}</h4>
            <p>{{ transform.description }}</p>
            <div class="transform-use-cases">
            <strong>Use Cases:</strong>
            <ul>
                <li v-for="useCase in transform.useCases" :key="useCase">{{ useCase }}</li>
            </ul>
            </div>
        </div>
        </div>
    </div>
    </section>

    <section id="data-validation" class="content-section">
    <h2>✅ Data Validation</h2>
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
    <h2>⚠️ Common Issues</h2>
    <div class="issues-accordion">
        <div class="issue-item" v-for="issue in commonIssues" :key="issue.id">
        <div class="issue-header" @click="toggleIssue(issue.id)">
            <span class="issue-icon">{{ issue.icon }}</span>
            <h4>{{ issue.title }}</h4>
            <span class="toggle-icon" :class="{ 'expanded': expandedIssues.includes(issue.id) }">▼</span>
        </div>
        <div class="issue-content" :class="{ 'expanded': expandedIssues.includes(issue.id) }">
            <p><strong>Problem:</strong> {{ issue.problem }}</p>
            <p><strong>Solution:</strong> {{ issue.solution }}</p>
            <div v-if="issue.tips" class="issue-tips">
            <strong>Tips:</strong>
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
        title: 'Select File',
        description: 'Click the "Files" button or drag files into the upload area',
        formats: ['CSV', 'Excel', 'JSON', 'TSV']
    },
    {
        id: 'preview',
        title: 'Preview Data',
        description: 'The system will automatically parse and display a data preview. Check the data structure.',
        formats: null
    },
    {
        id: 'configure',
        title: 'Configure Parameters',
        description: 'Set parsing parameters such as delimiter, encoding, and header row.',
        formats: null
    },
    {
        id: 'validate',
        title: 'Validate Data',
        description: 'Check data quality, handle missing and abnormal values.',
        formats: null
    }
]

const supportedFormats = [
    {
        id: 'csv',
        name: 'CSV',
        icon: '📄',
        description: 'Comma-separated values file, the most common data exchange format.',
        features: ['Lightweight', 'Highly compatible', 'Easy to edit', 'Supports large files']
    },
    {
        id: 'excel',
        name: 'Excel',
        icon: '📊',
        description: 'Microsoft Excel format, supports multiple worksheets.',
        features: ['Multiple sheets', 'Rich formatting', 'Formula support', 'XLSX/XLS']
    },
    {
        id: 'json',
        name: 'JSON',
        icon: '📋',
        description: 'JavaScript Object Notation, suitable for structured data.',
        features: ['Hierarchical', 'Nested data', 'Web-friendly', 'Standard format']
    },
    {
        id: 'tsv',
        name: 'TSV',
        icon: '📝',
        description: 'Tab-separated values file, suitable for data containing commas.',
        features: ['Tab-separated', 'Good compatibility', 'Handles commas', 'Plain text']
    }
]

const cleaningTools = [
    {
        id: 'missing-data',
        title: 'Missing Value Handling',
        icon: '❓',
        tools: [
        {
            id: 'remove-null',
            name: 'Remove Nulls',
            icon: '🗑️',
            description: 'Remove rows or columns containing null values.',
            example: 'Delete all records containing null or undefined.'
        },
        {
            id: 'fill-values',
            name: 'Fill Values',
            icon: '🔄',
            description: 'Fill missing data with specified or statistical values.',
            example: 'Fill missing numeric fields with the average value.'
        }
        ]
    },
    {
        id: 'data-filtering',
        title: 'Data Filtering',
        icon: '🔍',
        tools: [
        {
            id: 'range-filter',
            name: 'Range Filter',
            icon: '📏',
            description: 'Filter data based on value ranges.',
            example: 'Filter records with age between 18 and 65.'
        },
        {
            id: 'condition-filter',
            name: 'Conditional Filter',
            icon: '⚡',
            description: 'Filter data based on complex conditions.',
            example: 'Filter records where sales > 1000 and region is "Beijing".'
        }
        ]
    },
    {
        id: 'outlier-detection',
        title: 'Outlier Detection',
        icon: '🎯',
        tools: [
        {
            id: 'statistical',
            name: 'Statistical Methods',
            icon: '📊',
            description: 'Identify outliers using statistical methods.',
            example: 'Identify outliers based on 3σ rule or quartiles.'
        },
        {
            id: 'manual',
            name: 'Manual Tagging',
            icon: '✏️',
            description: 'Manually tag and handle abnormal data points.',
            example: 'Directly tag outliers in the data preview.'
        }
        ]
    }
]

const transformations = [
    {
        id: 'aggregation',
        name: 'Data Aggregation',
        icon: '📊',
        description: 'Merge multiple rows into a single summary row.',
        useCases: ['Calculate monthly sales totals', 'Count users by region', 'Aggregate product info by category']
    },
    {
        id: 'pivot',
        name: 'Data Pivot',
        icon: '🔄',
        description: 'Reorganize data structure, transpose rows and columns.',
        useCases: ['Convert long format to wide format', 'Create cross-tab reports', 'Multidimensional data analysis']
    },
    {
        id: 'merge',
        name: 'Data Merge',
        icon: '🔗',
        description: 'Merge multiple data sources based on common fields.',
        useCases: ['Join user info and order data', 'Merge historical data', 'Supplement dimension info']
    },
    {
        id: 'normalization',
        name: 'Data Normalization',
        icon: '⚖️',
        description: 'Scale data to a standard range.',
        useCases: ['Min-Max normalization', 'Z-score normalization', 'Eliminate unit effects']
    }
]

const validationChecks = [
    {
        id: 'structure',
        title: 'Structure Validation',
        checks: [
        {
            id: 'columns',
            title: 'Column Structure Check',
            icon: '📋',
            description: 'Verify column names, types, and counts meet expectations.'
        },
        {
            id: 'datatypes',
            title: 'Data Type Validation',
            icon: '🏷️',
            description: 'Ensure each column has the correct data type (number, text, date, etc.).'
        }
        ]
    },
    {
        id: 'quality',
        title: 'Quality Check',
        checks: [
        {
            id: 'completeness',
            title: 'Completeness Check',
            icon: '✅',
            description: 'Check the proportion and distribution of missing values.'
        },
        {
            id: 'consistency',
            title: 'Consistency Validation',
            icon: '🔄',
            description: 'Verify consistency of data formats and value ranges.'
        }
        ]
    },
    {
        id: 'business',
        title: 'Business Rules',
        checks: [
        {
            id: 'range',
            title: 'Value Range',
            icon: '📏',
            description: 'Verify values are within reasonable business ranges.'
        },
        {
            id: 'logic',
            title: 'Logical Relationships',
            icon: '🧠',
            description: 'Check if relationships between fields are reasonable.'
        }
        ]
    }
]

const commonIssues = [
    {
        id: 'encoding',
        title: 'File Encoding Issues',
        icon: '🔤',
        problem: 'Chinese or special characters appear garbled.',
        solution: 'Select the correct encoding (UTF-8, GBK, etc.) and re-parse the file.',
        tips: ['UTF-8 is the recommended standard encoding.', 'If unsure, try auto-detection.', 'Excel files usually use GBK encoding.']
    },
    {
        id: 'separator',
        title: 'Separator Recognition Error',
        icon: '📐',
        problem: 'CSV columns are not split correctly, data is mixed together.',
        solution: 'Manually specify the correct separator (comma, semicolon, tab, etc.).',
        tips: ['Check the original file for the separator.', 'Distinguish between comma and semicolon.', 'Tab separation is safer.']
    },
    {
        id: 'header',
        title: 'Header Row Setting',
        icon: '📑',
        problem: 'The first row of data is mistaken for the header or data.',
        solution: 'Set the correct header row position and specify which row to start reading data.',
        tips: ['Check the first few rows of the file.', 'Confirm the header row position.', 'Skip instruction and empty rows.']
    },
    {
        id: 'large-file',
        title: 'Large File Handling',
        icon: '📦',
        problem: 'Large files cause slow upload or processing.',
        solution: 'Consider data sampling, batch processing, or optimizing file format.',
        tips: ['Files over 100MB are recommended to be processed in batches.', 'Remove unnecessary columns and rows.', 'Use CSV instead of Excel.']
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

// Listen to scroll and update current section
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
@import '../../../assets/CSS/DataPreprocessing_instruction.css';
</style>
