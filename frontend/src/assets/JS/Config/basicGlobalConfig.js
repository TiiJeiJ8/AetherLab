/* eslint-disable */
// 全局基础配置项，供配置树和参数面板共用
export const basicGlobalConfig = [
    { key: 'title', label: 'Title', type: 'text', description: 'Chart main title' },
    { key: 'subtext', label: 'Subtitle', type: 'text', description: 'Chart subtitle' },
    {
        key: 'titlePosition', label: 'Title Position', type: 'select', options: [
            { label: 'Top left', value: 'left' },
            { label: 'Top center', value: 'center' },
            { label: 'Top right', value: 'right' },
            { label: 'Bottom center', value: 'bottom' }
        ],
        tips: [
            { key: 'left', content: 'Align title to the top left' },
            { key: 'center', content: 'Align title to the top center' },
            { key: 'right', content: 'Align title to the top right' },
            { key: 'bottom', content: 'Align title to the bottom center' }
        ],
        description: 'Position of the chart title'
    },
    { key: 'colorScheme', label: 'Theme', type: 'select', options: [], description: 'Color theme for the chart' },
    { key: 'isAggregate', label: 'Aggregate', type: 'checkbox', description: 'Whether to aggregate data (for supported chart types)' },
    { key: 'animation', label: 'Animation', type: 'checkbox', description: 'Enable chart animation' },
    {
        key: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: [
            { label: 'Auto', value: 'auto' },
            { label: '16:9', value: '16:9' },
            { label: '4:3', value: '4:3' },
            { label: '1:1', value: '1:1' },
            { label: '3:2', value: '3:2' },
            { label: '21:9', value: '21:9' },
            { label: '9:16', value: '9:16' }
        ],
        tips: [
            { key: 'auto', content: 'Auto fit the container' },
            { key: '16:9', content: 'Widescreen (16:9)' },
            { key: '4:3', content: 'Standard (4:3)' },
            { key: '1:1', content: 'Square (1:1)' },
            { key: '3:2', content: 'Classic photo (3:2)' },
            { key: '21:9', content: 'Ultra-wide (21:9)' },
            { key: '9:16', content: 'Portrait (9:16)' }
        ],
        description: 'Aspect ratio of the chart'
    },
    { key: 'legendVisible', label: 'Legend', type: 'checkbox', description: 'Show or hide chart legend' },
    {
        key: 'legendPosition', label: 'Legend Position', type: 'select', options: [
            { value: 'bottom', label: 'Bottom' },
            { value: 'top', label: 'Top' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' }
        ],
        tips: [
            { key: 'bottom', content: 'Legend at the bottom' },
            { key: 'top', content: 'Legend at the top' },
            { key: 'left', content: 'Legend at the left' },
            { key: 'right', content: 'Legend at the right' }
        ],
        description: 'Position of the legend'
    },
    {
        key: 'nullHandling', label: 'Null Handling', type: 'select', options: [
            { value: 'ignoreNull', label: 'Ignore (Default)' },
            { value: 'fillZero', label: 'Fill with 0' },
            { value: 'fillNearest', label: 'Nearest Neighbor' },
            { value: 'linearInterpolate', label: 'Linear Interpolate' },
            { value: 'fillCubicSpline', label: 'Cubic Spline' },
            { value: 'fillPolynomial', label: 'Polynomial Interpolate' },
            { value: 'fillStepBefore', label: 'Step Before' },
            { value: 'fillStepAfter', label: 'Step After' },
            { value: 'fillBasis', label: 'Basis' },
            { value: 'fillCardinal', label: 'Cardinal' },
            { value: 'fillMonotone', label: 'Monotone' },
            { value: 'fillAkima', label: 'Akima' }
        ],
        tips: [
            { key: 'ignoreNull', content: 'Ignore missing/null values (default)' },
            { key: 'fillZero', content: 'Fill missing values with 0' },
            { key: 'fillNearest', content: 'Use nearest neighbor value' },
            { key: 'linearInterpolate', content: 'Linear interpolation' },
            { key: 'fillCubicSpline', content: 'Cubic spline interpolation' },
            { key: 'fillPolynomial', content: 'Polynomial interpolation' },
            { key: 'fillStepBefore', content: 'Step before interpolation' },
            { key: 'fillStepAfter', content: 'Step after interpolation' },
            { key: 'fillBasis', content: 'Basis interpolation' },
            { key: 'fillCardinal', content: 'Cardinal interpolation' },
            { key: 'fillMonotone', content: 'Monotone interpolation' },
            { key: 'fillAkima', content: 'Akima interpolation' }
        ],
        description: 'How to handle null/missing values'
    }
]
