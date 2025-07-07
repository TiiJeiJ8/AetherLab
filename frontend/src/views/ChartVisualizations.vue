<template>
  <div>
    <div class="py-5">
      <TopBar :actions="[
        { type: 'button', label: 'Files', onClick: UploadFiles },
        { type: 'button', label: 'Chart History', onClick: openHistory},
        { type: 'button', label: 'Dashboard', },
        { type: 'button', label: 'Instruction', to: '/under-construction'},
        { type: 'button', label: 'Back2Home', to: '/'},
      ]"/>
    </div>

    <!-- 左侧边栏 -->
    <SideBar
      position="left"
      :collapsedWidth="40"
      :expandedWidth="180">
      <ChartTypeSelector @select="onChartTypeSelect" />
    </SideBar>

    <!-- 右侧边栏 -->
    <SideBar
      position="right"
      :collapsedWidth="40"
      :expandedWidth="400">
      <ChartConfigPanel
        :selectedChartType="selectedChartType"
        :currentFile="currentStructureFile"
        @config-change="handleConfigChange"
        @generate-chart="handleGenerateChart"
      />
    </SideBar>

    <!-- 绘制区 -->
    <div class="main-content">
      <section class="chart-workspace">
        <ChartDisplay v-if="chartOption" :option="chartOption" />
      </section>
    </div>

    <!-- 图表存储区 -->
    <ChartHistoryModal
      :show="showHistory"
      :chartHistory="chartHistory"
      @close="showHistory = false"
      @preview="previewChart"
      @delete="deleteChart"
    />

    <!-- 文件上传弹窗 -->
    <FileUploadModal
      v-if="showFileUpload"
      :show="showFileUpload"
      :workspaceFiles="workspaceFiles"
      @close="showFileUpload = false"
      @workspace-updated="handleWorkspaceUpdate"
    />

    <!-- 数据预览弹窗 -->
    <DataPreviewModal
      v-if="showDataPreview"
      :show="showDataPreview"
      :current-file="currentDataFile"
      :preview-data="previewData"
      @close="showDataPreview = false"
    />

    <!-- 文件工作区 -->
    <FileWorkspace
      :files="workspaceFiles"
      @remove="handleWorkspaceRemove"
      @preview="handleWorkspacePreview"
      @clear="handleWorkspaceClear"
      @show-structure="handleShowStructure"
    />

    <!-- 文件结构面板 -->
    <FileStructurePanel
      :fileInfo="currentStructureFile"
      :visible="showStructurePanel"
      @close="showStructurePanel = false"
      @minimize="handleStructureMinimize"
      @column-drag="handleColumnDrag"
    />
  </div>
</template>

<script setup>
/* eslint-disable */
import TopBar from '../components/TopBar.vue'
import SideBar from '../components/SideBar.vue'
import ChartTypeSelector from '../components/ChartIcon.vue'
import ChartDisplay from '../components/ChartDisplay.vue'
import ChartHistoryModal from '../components/ChartHistoryModal.vue'
import FileUploadModal from '../components/FileUploadModal.vue'
import DataPreviewModal from '../components/DataPreviewModal.vue'
import FileWorkspace from '../components/FileWorkspace.vue'
import FileStructurePanel from '../components/FileStructurePanel.vue'
import ChartConfigPanel from '../components/ChartConfigPanel.vue'
import { getFilePreview } from '../assets/JS/services/FileServices.js'
import {ref, nextTick} from 'vue'

// 文件上传相关
const showFileUpload = ref(false)
function UploadFiles() {
  showFileUpload.value = true
}

// 数据预览相关
const showDataPreview = ref(false)
const currentDataFile = ref(null)
const previewData = ref([])

// 工作区相关
const workspaceFiles = ref([])

// 文件结构面板相关
const showStructurePanel = ref(false)
const currentStructureFile = ref(null)

// 图表配置相关
const selectedChartType = ref('Bar') // 使用首字母大写格式与chartIcons.js一致
const chartConfig = ref(null)

// 测试图表绘制
const chartOption = ref({
  title: { text: '示例图表' },
  tooltip: {},
  xAxis: { data: ['A', 'B', 'C', 'D'] },
  yAxis: {},
  series: [{ type: 'line', data: [23, 45, 12, 37] }]
})

// 图表存储区（可从后端获取）
const chartHistory = ref([
  {
    title: '销售柱状图',
    option: {
      title: { text: '销售柱状图' },
      tooltip: {},
      xAxis: { data: ['一季度', '二季度', '三季度', '四季度'] },
      yAxis: {},
      series: [{ type: 'bar', data: [120, 200, 150, 80] }]
    }
  },
  {
    title: '折线趋势',
    option: {
      title: { text: '折线趋势' },
      tooltip: {},
      xAxis: { data: ['1月', '2月', '3月', '4月'] },
      yAxis: {},
      series: [{ type: 'line', data: [30, 50, 80, 65] }]
    }
  },
  {
    title: '饼图示例',
    option: {
      title: { text: '饼图示例' },
      tooltip: {},
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            { value: 40, name: 'A类' },
            { value: 32, name: 'B类' },
            { value: 28, name: 'C类' }
          ]
        }
      ]
    }
  }
])

const showHistory = ref(false)
function openHistory() {
  showHistory.value = true
}
function previewChart(item) {
  chartOption.value = null
  nextTick(() => {
    chartOption.value = JSON.parse(JSON.stringify(item.option))
    showHistory.value = false
  })
}
function deleteChart(idx) {
  chartHistory.value.splice(idx, 1)
}

// 图表选择
function onChartTypeSelect(type) {
    console.log(`Selected chart type: ${type}`)
    selectedChartType.value = type
    // 可添加处理为加载图表类型、切换组件等功能
}

// 工作区相关方法
function handleWorkspaceUpdate(files) {
    workspaceFiles.value = [...files]
    console.log('Workspace updated:', workspaceFiles.value.length, 'files')
}

function handleWorkspaceRemove(file) {
    console.log('File removed from workspace:', file.name)
    // 从工作区数组中移除文件
    const index = workspaceFiles.value.findIndex(f => f.id === file.id)
    if (index !== -1) {
        workspaceFiles.value.splice(index, 1)
    }
}

function handleWorkspacePreview(file) {
    // 预览工作区中的文件
    console.log('Preview workspace file:', file.name)
    currentDataFile.value = file
    
    // 使用与 FileUploadModal 相同的预览逻辑
    if (file.previewData) {
        // 如果文件已经有预览数据，直接使用
        previewData.value = file.previewData
        showDataPreview.value = true
    } else {
        // 否则读取文件内容
        loadFilePreview(file)
    }
}

// 加载文件预览数据
async function loadFilePreview(file) {
    try {
        const previewResult = await getFilePreview(file.id)
        previewData.value = previewResult.data
        showDataPreview.value = true
    } catch (error) {
        console.error('Preview failed:', error)
        alert('Preview failed: ' + error.message)
    }
}

function handleWorkspaceClear() {
    console.log('Workspace cleared')
    workspaceFiles.value = []
}

// 文件结构面板处理方法
function handleShowStructure(file) {
    console.log('Showing structure for file:', file.name)
    currentStructureFile.value = file
    showStructurePanel.value = true
}

function handleStructureMinimize(isMinimized) {
    console.log('Structure panel minimized:', isMinimized)
}

function handleColumnDrag(dragInfo) {
    console.log('Column drag event:', dragInfo)
    // 这里将来会处理列拖拽到图表配置的逻辑
    if (dragInfo.action === 'start') {
        console.log('Started dragging column:', dragInfo.column.name)
    } else if (dragInfo.action === 'end') {
        console.log('Finished dragging column')
    }
}

// 图表配置处理方法
function handleConfigChange(config) {
    console.log('Chart config changed:', config)
    chartConfig.value = config
}

function handleGenerateChart(config) {
    console.log('Generating chart with config:', config)
    
    if (!currentStructureFile.value || !currentStructureFile.value.parsedData) {
        alert('请先选择并分析数据文件')
        return
    }
    
    // 根据配置生成ECharts图表
    const newChartOption = generateEChartOption(config, currentStructureFile.value.parsedData)
    
    if (newChartOption) {
        chartOption.value = null
        nextTick(() => {
            chartOption.value = newChartOption
        })
    }
}

// 生成ECharts配置
function generateEChartOption(config, data) {
    const { xAxis, yAxis, series, title, colorScheme, animation } = config
    
    if (!data || data.length === 0) {
        alert('数据为空，无法生成图表')
        return null
    }
    
    // 提取数据
    const xData = data.map(row => row[xAxis.field])
    const yData = data.map(row => parseFloat(row[yAxis.field]) || 0)
    
    // 基础配置
    const option = {
        title: {
            text: title || `${yAxis.field} vs ${xAxis.field}`,
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return `${params[0].axisValue}: ${params[0].value}`
            }
        },
        legend: {
            data: [yAxis.field],
            top: 'bottom'
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: {
                interval: 0,
                rotate: xData.length > 10 ? 45 : 0
            }
        },
        yAxis: {
            type: 'value',
            name: yAxis.field
        },
        series: [{
            name: yAxis.field,
            type: selectedChartType.value.toLowerCase(), // 转换为小写供ECharts使用
            data: yData,
            animationDuration: animation ? 1500 : 0,
            itemStyle: {
                color: getColorByScheme(colorScheme)
            }
        }],
        animation: animation,
        animationDuration: animation ? 1500 : 0
    }
    
    // 根据图表类型调整配置
    if (selectedChartType.value === 'Pie' || selectedChartType.value === 'pie') {
        option.series[0] = {
            name: yAxis.field,
            type: 'pie',
            radius: '60%',
            data: xData.map((name, index) => ({
                name,
                value: yData[index]
            })),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
        delete option.xAxis
        delete option.yAxis
    }
    
    return option
}

// 根据配色方案获取颜色
function getColorByScheme(scheme) {
    const colorSchemes = {
        default: '#5470c6',
        blue: '#1890ff',
        green: '#52c41a',
        warm: '#fa8c16',
        cool: '#13c2c2'
    }
    return colorSchemes[scheme] || colorSchemes.default
}
</script>

<style scoped>
.sideBar-btn {
background: transparent;
border: none;
font-size: 1.1rem;
font-weight: 600;
cursor: pointer;
color: var(--text-color);
padding: 6px 14px;
border-radius: 8px;
transition:
    background-color 0.3s cubic-bezier(.4,2,.6,1),
    transform 0.2s cubic-bezier(.4,2,.6,1),
    box-shadow 0.2s;
text-align: center;
text-decoration: none;
}
.sideBar-btn:hover {
background-color: rgba(136, 133, 133, 0.1);
transform: translateY(-2px) scale(1.02);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 图表绘制区 */
.main-content {
display: flex;
gap: 32px;
margin: 40px 60px 0 220px;
min-height: 500px;
}
@media (max-width: 767px) {
  .main-content {
    margin: 20px 30px 0 80px;
    gap: 16px;
    min-height: auto;
  }
}
.chart-workspace {
flex: 1;
min-width: 0;
display: flex;
align-items: center;
justify-content: center;
}

/* 图表缓存区 */
.chart-history {
width: 220px;
background: var(--bg-color, #fff);
border-radius: 10px;
box-shadow: 0 0px 1px var(--text-color);
padding: 16px;
flex-shrink: 0;
}
.chart-history-item {
padding: 8px 0;
cursor: pointer;
border-bottom: 1px solid #747272;
transition: background 0.2s;
}
.chart-history-item:hover {
background: rgba(136, 133, 133, 0.1);
}
</style>
