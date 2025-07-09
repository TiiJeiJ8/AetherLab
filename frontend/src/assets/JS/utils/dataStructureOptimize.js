/* eslint-disable */
import { ref, computed } from 'vue'

// 数据预览相关
export const showDataPreview = ref(false)
export const currentDataFile = ref(null)
export const previewData = ref([])

// 全局文件数据结构优化
// workspaceFiles: [{ name, id, size, status, parsedData: [...] }, ...]
export const workspaceFiles = ref([])
// 构建文件名到数据的映射，自动将 headers+data 组装成对象数组，便于多文件查找
export const fileDataMap = computed(() => {
    const map = {}
    workspaceFiles.value.forEach(file => {
        if (file.data && file.headers) {
            const rows = file.data
            if (Array.isArray(rows) && Array.isArray(file.headers)) {
                map[file.name] = rows.map(row =>
                    Object.fromEntries(file.headers.map((h, i) => [h, row[i]]))
                )
            }
        }
    })
    console.log('[fileDataMap computed]', map)
    return map
})