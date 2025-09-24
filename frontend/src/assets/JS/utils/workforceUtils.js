/* eslint-disable */

import { getFilePreview } from '../services/FileServices.js'
import { workspaceFiles, fileDataMap } from './dataStructureOptimize.js'
import { currentDataFile, previewData, showDataPreview } from './dataStructureOptimize.js'

// 工作区相关方法
export function handleWorkspaceUpdate(files) {
    workspaceFiles.value = [...files]
    // console.log('Workspace updated:', workspaceFiles.value.length, 'files')
    //! 调试：输出全局文件数据结构
    // console.log('workspaceFiles:', JSON.parse(JSON.stringify(workspaceFiles.value)))
    // console.log('fileDataMap:', JSON.parse(JSON.stringify(fileDataMap.value)))
}

export function handleWorkspaceRemove(file) {
    console.log('File removed from workspace:', file.name)
    // 从工作区数组中移除文件
    const index = workspaceFiles.value.findIndex(f => f.id === file.id)
    if (index !== -1) {
        workspaceFiles.value.splice(index, 1)
    }
}

export function handleWorkspacePreview(file) {
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
export async function loadFilePreview(file) {
    try {
        const previewResult = await getFilePreview(file.id)
        previewData.value = previewResult.data
        showDataPreview.value = true
    } catch (error) {
        console.error('Preview failed:', error)
        alert('Preview failed: ' + error.message)
    }
}

export function handleWorkspaceClear() {
    console.log('Workspace cleared')
    workspaceFiles.value = []
}