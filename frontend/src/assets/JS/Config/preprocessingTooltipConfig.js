/* eslint-disable */
// preprocessingTooltipConfig.js
// 数据预处理提示框配置 - 数据类型要求和使用场景
export const preprocessingTooltipConfig = {
    quality: {
        label: "Data Quality Report",
        description: "Generate a comprehensive data quality report, including missing values, unique values, distribution, and outlier statistics.",
        dataRequirements: ["Any data table"],
        useCases: ["Data overview", "Quality assessment", "Data health check"]
    },
    'raw-preview': {
        label: "Raw Data Preview",
        description: "View the original imported data for source verification.",
        dataRequirements: ["Any data table"],
        useCases: ["Source data check", "Import validation"]
    },
    'processed-preview': {
        label: "Processed Data Preview",
        description: "View the data after preprocessing steps for pipeline validation.",
        dataRequirements: ["Processed data table"],
        useCases: ["Pipeline validation", "Result comparison"]
    },
    'remove-duplicates': {
        label: "Remove Duplicates",
        description: "Automatically detect and remove duplicate rows to ensure data uniqueness.",
        dataRequirements: ["Any data table"],
        useCases: ["Deduplication", "Data cleaning"]
    },
    'outlier-detect': {
        label: "Outlier Detection",
        description: "Detect and flag outliers, with options to remove or correct them.",
        dataRequirements: ["Numerical data"],
        useCases: ["Outlier analysis", "Data cleaning", "Data correction"]
    },
    normalize: {
        label: "Normalization / Standardization",
        description: "Normalize or standardize numerical features to improve modeling performance.",
        dataRequirements: ["Numerical data"],
        useCases: ["Feature scaling", "Model preprocessing"]
    },
    encode: {
        label: "Categorical Encoding",
        description: "Encode categorical data as numerical values for machine learning models.",
        dataRequirements: ["Categorical data"],
        useCases: ["Model compatibility", "Feature engineering"]
    },
    'filter-rows': {
        label: "Filter Rows",
        description: "Filter data rows by conditions to keep or remove specific samples.",
        dataRequirements: ["Any data table"],
        useCases: ["Subset selection", "Data filtering"]
    },
    'filter-columns': {
        label: "Filter Columns",
        description: "Select or remove columns to keep only relevant features.",
        dataRequirements: ["Any data table"],
        useCases: ["Feature selection", "Dimensionality reduction"]
    },
    'feature-select': {
        label: "Feature Selection",
        description: "Automatically or manually select important features to improve model performance.",
        dataRequirements: ["Any data table"],
        useCases: ["Dimensionality reduction", "Feature optimization"]
    },
    'feature-generate': {
        label: "Feature Generation",
        description: "Generate new features based on existing data to enrich data representation.",
        dataRequirements: ["Any data table"],
        useCases: ["Feature expansion", "Feature engineering"]
    },
    'fill-missing': {
        label: "Fill Missing Values",
        description: "Fill missing values using simple strategies such as mean, median, or mode.",
        dataRequirements: ["Data table with missing values"],
        useCases: ["Simple imputation", "Data completion"]
    },
    'impute-advanced': {
        label: "Advanced Imputation",
        description: "Use advanced methods such as interpolation or model prediction to fill missing values.",
        dataRequirements: ["Data table with missing values"],
        useCases: ["Complex imputation", "High-quality completion"]
    }
}