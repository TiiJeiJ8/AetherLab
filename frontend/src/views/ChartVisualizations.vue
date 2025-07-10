<template>
  <div>
    <!-- Top Bar -->
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

    <!-- Empty Space -->
    <div class="empty-space"></div>

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
      v-if="currentStructureFile"
      :fileInfo="currentStructureFile"
      :visible="showStructurePanel"
      :current-file="currentStructureFile.name"
      @close="showStructurePanel = false"
      @minimize="handleStructureMinimize"
      @column-drag="handleColumnDrag"
    />
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, nextTick } from 'vue'
import TopBar from '../components/Common/TopBar.vue'
import SideBar from '../components/Common/SideBar.vue'
import ChartTypeSelector from '../components/Chart/ChartIcon.vue'
import ChartDisplay from '../components/Chart/ChartDisplay.vue'
import ChartHistoryModal from '../components/Chart/ChartHistoryModal.vue'
import FileUploadModal from '../components/Common/FileUploadModal.vue'
import DataPreviewModal from '../components/Common/DataPreviewModal.vue'
import FileWorkspace from '../components/Common/FileWorkspace.vue'
import FileStructurePanel from '../components/Common/FileStructurePanel.vue'
import ChartConfigPanel from '../components/Chart/ChartConfigPanel.vue'
import { workspaceFiles, fileDataMap, showDataPreview, currentDataFile, previewData } from '@/assets/JS/utils/dataStructureOptimize.js'
import { generateEChartOption, getColorByScheme } from '../assets/JS/utils/echartOptionUtils.js'
import { handleWorkspaceUpdate, handleWorkspaceRemove, handleWorkspacePreview, loadFilePreview, handleWorkspaceClear } from '../assets/JS/utils/workforceUtils.js'

// 文件上传相关
const showFileUpload = ref(false)
function UploadFiles() {
  showFileUpload.value = true
}

// 数据预览相关
// showDataPreview、currentDataFile、previewData 已由 dataStructureOptimize.js 提供

// 文件结构面板相关
const showStructurePanel = ref(false)
const currentStructureFile = ref(null)

// 图表配置相关
const selectedChartType = ref('Unknown')
const chartConfig = ref(null)
const chartOption = ref({})

// 图表存储区（可从配置面板保存当前的图表配置、也可从后端获取）
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
  console.log('Chart config changed:', JSON.parse(JSON.stringify(config)))
  chartConfig.value = config
  if (
    !config.xAxis.field &&
    !config.yAxis.field &&
    (!Array.isArray(config.series) || config.series.length === 0)
  ) { 
    chartOption.value = { series: [] }
  }
}

// 导入数据合并工具函数
import { hasPrimaryKey, mergeChartData } from '../assets/JS/utils/dataMergeUtils.js';

function handleGenerateChart(config) {
  console.log('[handleGenerateChart] config:', JSON.parse(JSON.stringify(config)));
  console.log('[handleGenerateChart] fileDataMap:', JSON.parse(JSON.stringify(fileDataMap.value)));
  // 检查是否有用到的文件
  const fields = [];
  if (config.xAxis) fields.push(config.xAxis);
  if (Array.isArray(config.yAxis)) {
    config.yAxis.forEach(y => fields.push(y));
  } else if (config.yAxis) {
    fields.push(config.yAxis);
  }
  const filesNeeded = Array.from(new Set(fields.map(f => f.file)));
  // 合并数据
  const { xData, yDataArr, mergeType } = mergeChartData(config, fileDataMap.value);
  if (!xData || xData.length === 0) {
    alert('Main file data is empty, unable to generate chart.');
    return;
  }
  // UI提示
  if (mergeType === 'rowIndex') {
    alert('When no primary key is set, data will be aligned by row index and any extra rows will be truncated. It is recommended to set a primary key for more accurate data merging.');
  }
  // 生成ECharts配置
  const newChartOption = generateEChartOption(config, fileDataMap.value, xData, yDataArr, selectedChartType);
  if (newChartOption) {
    chartOption.value = null;
    nextTick(() => {
      chartOption.value = newChartOption;
    });
  }
}
</script>

<style scoped>
/* 顶部空白区 */
.empty-space {
  height: clamp(24px, 10vh, 60px); /* 最小24px，最大60px，常规为%视口高 */
  min-height: 0;
  padding: 0;
  margin: 0;
  background: transparent;
}

/* 侧边栏按钮样式 */
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
  margin-left: 7%;
  margin-right: 7%;
  margin-top: 3.5%;
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
