/* eslint-disable */
/**
 * 文件上传与管理相关的 API 服务
 * 支持前端缓存和后端同步的双模式工作
 */
import * as XLSX from 'xlsx'

const API_BASE_URL = '/api'
const CACHE_KEY = 'fuck_charts_files'

// 分块上传配置
const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB per chunk
const CHUNK_SIZE_THRESHOLD = 10 * 1024 * 1024 // 10MB threshold for chunked upload
const MAX_CONCURRENT_CHUNKS = 3 // 最大并发分块数

// 后端连接状态
let isBackendConnected = false

/**
 * 检测后端连接状态
 * @returns {Promise<boolean>} 连接状态
 */
export async function checkBackendConnection() {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            signal: controller.signal
        })

        clearTimeout(timeoutId)
        isBackendConnected = response.ok
        return isBackendConnected
    } catch (error) {
        console.log('后端连接检测:', error.message)
        isBackendConnected = false
        return false
    }
}

/**
 * 获取后端连接状态
 * @returns {boolean} 连接状态
 */
export function getBackendStatus() {
    return isBackendConnected
}

/**
 * 从本地缓存获取文件列表
 * @returns {Array} 缓存的文件列表
 */
export function getCachedFiles() {
    try {
        const cached = localStorage.getItem(CACHE_KEY)
        return cached ? JSON.parse(cached) : []
    } catch (error) {
        console.error('读取缓存失败:', error)
        return []
    }
}

/**
 * 保存文件到本地缓存
 * @param {Object} fileInfo - 文件信息
 */
export function saveToCache(fileInfo) {
    try {
        const cached = getCachedFiles()
        cached.push(fileInfo)
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
    } catch (error) {
        console.error('保存到缓存失败:', error)
    }
}

/**
 * 从缓存中删除文件
 * @param {string} fileId - 文件ID
 */
export function removeFromCache(fileId) {
    try {
        const cached = getCachedFiles()
        const filtered = cached.filter(file => file.id !== fileId)
        localStorage.setItem(CACHE_KEY, JSON.stringify(filtered))
    } catch (error) {
        console.error('从缓存删除失败:', error)
    }
}

/**
 * 解析Excel/CSV文件
 * @param {File} file - 文件对象
 * @returns {Promise<Object>} 解析结果
 */
export async function parseFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = e.target.result
                let workbook, worksheet, jsonData

                if (file.name.toLowerCase().endsWith('.csv')) {
                    // CSV文件解析 - 支持中文字符
                    workbook = XLSX.read(data, {
                        type: 'string',
                        codepage: 65001 // UTF-8
                    })
                    worksheet = workbook.Sheets[workbook.SheetNames[0]]
                    jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        defval: '',
                        blankrows: false
                    })
                } else {
                    // Excel文件解析 - 支持中文字符
                    workbook = XLSX.read(data, {
                        type: 'array',
                        cellDates: true,
                        cellNF: false,
                        cellText: false
                    })
                    worksheet = workbook.Sheets[workbook.SheetNames[0]]
                    jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        defval: '',
                        blankrows: false
                    })
                }

                // 过滤空行
                jsonData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''))

                // 限制预览行数
                const previewData = jsonData.slice(0, 100)

                resolve({
                    data: previewData,
                    totalRows: jsonData.length,
                    totalColumns: jsonData[0] ? jsonData[0].length : 0,
                    headers: jsonData[0] || []
                })
            } catch (error) {
                console.error('文件解析失败:', error)
                reject(new Error('文件解析失败：' + error.message))
            }
        }

        reader.onerror = () => reject(new Error('文件读取失败'))

        if (file.name.toLowerCase().endsWith('.csv')) {
            reader.readAsText(file, 'UTF-8')
        } else {
            reader.readAsArrayBuffer(file)
        }
    })
}

/**
 * 智能上传文件（根据后端连接状态决定上传或缓存）
 * 支持分块上传大文件
 * @param {File} file - 要上传的文件对象
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise} 上传结果
 */
export async function uploadFile(file, onProgress) {
    try {
        // 首先解析文件内容
        console.log('开始解析文件:', file.name)
        const parsedContent = await parseFileContent(file)

        const fileInfo = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            rows: parsedContent.totalRows,
            columns: parsedContent.totalColumns,
            headers: parsedContent.headers,
            createdAt: new Date().toISOString(),
            status: 'local',
            data: parsedContent.data,
            file: file // 保存原始文件对象用于后续上传
        }

        // 检查后端连接状态
        const isConnected = await checkBackendConnection()
        console.log('后端连接状态:', isConnected)

        if (isConnected) {
            // 后端连接时智能上传
            try {
                fileInfo.status = 'uploading'
                console.log('正在上传到后端...')

                let result
                // 判断是否需要分块上传
                if (file.size > CHUNK_SIZE_THRESHOLD) {
                    console.log(`文件大小 ${(file.size / 1024 / 1024).toFixed(2)}MB 超过阈值，使用分块上传`)
                    result = await chunkUpload(file, onProgress, fileInfo.id)
                } else {
                    console.log('使用普通上传')
                    result = await normalUpload(file, onProgress)
                }

                fileInfo.status = 'uploaded'
                fileInfo.serverId = result.fileId

                console.log('上传成功:', result)

                // 同时保存到缓存
                saveToCache(fileInfo)

                return fileInfo
            } catch (error) {
                console.error('后端上传失败:', error)
                fileInfo.status = 'local' // 改为本地缓存而不是error
                saveToCache(fileInfo)
                console.log('已保存到本地缓存')
                return fileInfo
            }
        } else {
            // 后端未连接时保存到本地缓存
            console.log('后端未连接，保存到本地缓存')
            fileInfo.status = 'local'
            saveToCache(fileInfo)
            return fileInfo
        }
    } catch (error) {
        console.error('文件处理失败:', error)
        throw new Error('文件处理失败：' + error.message)
    }
}

/**
 * 获取文件预览数据
 * @param {string} fileId - 文件ID
 * @returns {Promise} 文件预览数据
 */
export async function getFilePreview(fileId) {
    // 先从缓存查找
    const cachedFiles = getCachedFiles()
    const cachedFile = cachedFiles.find(file => file.id === fileId)

    if (cachedFile && cachedFile.data) {
        return {
            data: cachedFile.data,
            totalRows: cachedFile.rows,
            totalColumns: cachedFile.columns,
            headers: cachedFile.headers
        }
    }

    // 如果缓存中没有，且后端连接，则从后端获取
    if (isBackendConnected) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}/preview`)
            if (!response.ok) {
                throw new Error('Failed to get preview')
            }
            return await response.json()
        } catch (error) {
            console.error('获取文件预览失败:', error)
            throw error
        }
    }

    throw new Error('文件预览不可用')
}

/**
 * 同步本地文件到后端
 * @param {string} fileId - 文件ID
 * @returns {Promise} 同步结果
 */
export async function syncFileToBackend(fileId) {
    const cachedFiles = getCachedFiles()
    const fileInfo = cachedFiles.find(file => file.id === fileId)

    if (!fileInfo || !fileInfo.file) {
        throw new Error('本地文件不存在')
    }

    if (!await checkBackendConnection()) {
        throw new Error('后端未连接')
    }

    try {
        const formData = new FormData()
        formData.append('file', fileInfo.file)

        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('同步失败')
        }

        const result = await response.json()

        // 更新缓存中的文件状态
        fileInfo.status = 'uploaded'
        fileInfo.serverId = result.fileId

        const updatedFiles = cachedFiles.map(file =>
            file.id === fileId ? fileInfo : file
        )
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedFiles))

        return fileInfo
    } catch (error) {
        console.error('同步文件失败:', error)
        throw error
    }
}

/**
 * 获取所有文件列表（本地缓存 + 远程文件）
 * @returns {Promise<Array>} 文件列表
 */
export async function getAllFiles() {
    const cachedFiles = getCachedFiles()

    if (!await checkBackendConnection()) {
        return cachedFiles
    }

    try {
        const response = await fetch(`${API_BASE_URL}/files`)
        if (!response.ok) {
            return cachedFiles
        }

        const remoteFiles = await response.json()

        // 合并本地和远程文件，避免重复
        const allFiles = [...cachedFiles]

        remoteFiles.forEach(remoteFile => {
            const existsInCache = cachedFiles.some(cached =>
                cached.serverId === remoteFile.id
            )

            if (!existsInCache) {
                allFiles.push({
                    ...remoteFile,
                    id: remoteFile.id,
                    serverId: remoteFile.id,
                    status: 'uploaded'
                })
            }
        })

        return allFiles
    } catch (error) {
        console.error('获取远程文件列表失败:', error)
        return cachedFiles
    }
}

/**
 * 智能删除文件（根据文件状态决定删除位置）
 * @param {string} fileId - 要删除的文件ID
 */
export async function deleteFile(fileId) {
    const cachedFiles = getCachedFiles()
    const fileInfo = cachedFiles.find(file => file.id === fileId)

    if (!fileInfo) {
        throw new Error('文件不存在')
    }

    // 如果文件已上传到服务器，同时从服务器删除
    if (fileInfo.status === 'uploaded' && fileInfo.serverId) {
        if (await checkBackendConnection()) {
            try {
                const response = await fetch(`${API_BASE_URL}/files/${fileInfo.serverId}`, {
                    method: 'DELETE'
                })
                if (!response.ok) {
                    console.warn('从服务器删除文件失败')
                }
            } catch (error) {
                console.error('从服务器删除文件失败:', error)
            }
        }
    }

    // 从本地缓存删除
    removeFromCache(fileId)

    return { success: true }
}

/**
 * 智能重命名文件
 * @param {string} fileId - 文件ID
 * @param {string} newName - 新文件名
 */
export async function renameFile(fileId, newName) {
    const cachedFiles = getCachedFiles()
    const fileInfo = cachedFiles.find(file => file.id === fileId)

    if (!fileInfo) {
        throw new Error('文件不存在')
    }

    // 如果文件已上传到服务器，同时更新服务器
    if (fileInfo.status === 'uploaded' && fileInfo.serverId) {
        if (await checkBackendConnection()) {
            try {
                const response = await fetch(`${API_BASE_URL}/files/${fileInfo.serverId}/rename`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newName })
                })
                if (!response.ok) {
                    console.warn('服务器重命名失败')
                }
            } catch (error) {
                console.error('服务器重命名失败:', error)
            }
        }
    }

    // 更新本地缓存
    fileInfo.name = newName
    const updatedFiles = cachedFiles.map(file =>
        file.id === fileId ? fileInfo : file
    )
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedFiles))

    return { success: true, file: fileInfo }
}

/**
 * 计算文件MD5哈希值
 * @param {File} file - 文件对象
 * @returns {Promise<string>} MD5哈希值
 */
async function calculateMD5(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const buffer = reader.result
            const hash = crypto.subtle.digest('MD5', buffer)
            hash.then(hashArray => {
                const hashHex = Array.from(new Uint8Array(hashArray))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('')
                resolve(hashHex)
            }).catch(reject)
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}

// 上传取消控制器映射
const uploadControllers = new Map()

/**
 * 取消文件上传
 * @param {string} fileId - 文件ID
 * @returns {boolean} 是否成功取消
 */
export function cancelUpload(fileId) {
    const controller = uploadControllers.get(fileId)
    if (controller) {
        controller.abort()
        uploadControllers.delete(fileId)
        console.log(`取消上传: ${fileId}`)
        return true
    }
    return false
}

/**
 * 分块上传文件
 * @param {File} file - 文件对象
 * @param {Function} onProgress - 进度回调
 * @param {string} fileId - 文件ID（用于取消控制）
 * @returns {Promise<Object>} 上传结果
 */
async function chunkUpload(file, onProgress, fileId) {
    const fileSize = file.size
    const chunks = Math.ceil(fileSize / CHUNK_SIZE)
    const fileName = file.name
    const fileType = file.type

    // 创建取消控制器
    const controller = new AbortController()
    uploadControllers.set(fileId, controller)

    try {
        // 生成上传会话唯一标识
        const uploadId = Date.now() + Math.random().toString(36).substr(2, 9)

        console.log(`开始分块上传: ${fileName}, 大小: ${fileSize}, 分块数: ${chunks}`)

        // 初始化上传会话
        const initResponse = await fetch(`${API_BASE_URL}/files/chunk-upload/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId: fileId,
                fileName: fileName,
                fileSize: fileSize,
                fileType: fileType,
                totalChunks: chunks,
                uploadId: uploadId
            }),
            signal: controller.signal
        })

        if (!initResponse.ok) {
            throw new Error('初始化分块上传失败')
        }

        const initResult = await initResponse.json()
        const sessionUploadId = initResult.uploadId || uploadId

        // 上传分块
        const uploadPromises = []
        let uploadedChunks = 0

        for (let i = 0; i < chunks; i++) {
            const start = i * CHUNK_SIZE
            const end = Math.min(start + CHUNK_SIZE, fileSize)
            const chunk = file.slice(start, end)

            const uploadPromise = uploadChunk(sessionUploadId, i, chunk, chunks, controller.signal)
                .then(() => {
                    uploadedChunks++
                    if (onProgress) {
                        onProgress({
                            loaded: uploadedChunks * CHUNK_SIZE,
                            total: fileSize,
                            percentage: Math.round((uploadedChunks / chunks) * 100)
                        })
                    }
                })

            uploadPromises.push(uploadPromise)

            // 控制并发数
            if (uploadPromises.length >= MAX_CONCURRENT_CHUNKS) {
                await Promise.all(uploadPromises)
                uploadPromises.length = 0
            }
        }

        // 等待所有分块上传完成
        if (uploadPromises.length > 0) {
            await Promise.all(uploadPromises)
        }

        // 完成上传
        const completeResponse = await fetch(`${API_BASE_URL}/files/chunk-upload/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uploadId: sessionUploadId,
                fileId: fileId
            }),
            signal: controller.signal
        })

        if (!completeResponse.ok) {
            throw new Error('完成分块上传失败')
        }

        const result = await completeResponse.json()
        console.log('分块上传完成:', result)

        return result
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('分块上传被取消')
            throw new Error('上传被取消')
        }
        throw error
    } finally {
        // 清理控制器
        uploadControllers.delete(fileId)
    }
}

/**
 * 上传单个分块
 * @param {string} uploadId - 上传会话ID
 * @param {number} chunkIndex - 分块索引
 * @param {Blob} chunk - 分块数据
 * @param {number} totalChunks - 总分块数
 * @param {AbortSignal} signal - 取消信号
 * @returns {Promise<void>}
 */
async function uploadChunk(uploadId, chunkIndex, chunk, totalChunks, signal) {
    const formData = new FormData()
    formData.append('uploadId', uploadId)
    formData.append('chunkIndex', chunkIndex)
    formData.append('chunk', chunk)
    formData.append('totalChunks', totalChunks)

    const response = await fetch(`${API_BASE_URL}/files/chunk-upload/chunk`, {
        method: 'POST',
        body: formData,
        signal: signal
    })

    if (!response.ok) {
        throw new Error(`上传分块 ${chunkIndex} 失败`)
    }

    console.log(`分块 ${chunkIndex + 1}/${totalChunks} 上传成功`)
}

/**
 * 普通上传文件
 * @param {File} file - 文件对象
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Object>} 上传结果
 */
async function normalUpload(file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                onProgress({
                    loaded: event.loaded,
                    total: event.total,
                    percentage: Math.round((event.loaded / event.total) * 100)
                })
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const result = JSON.parse(xhr.responseText)
                    resolve(result)
                } catch (error) {
                    reject(new Error('解析响应失败'))
                }
            } else {
                reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`))
            }
        }

        xhr.onerror = () => {
            reject(new Error('网络错误'))
        }

        xhr.open('POST', `${API_BASE_URL}/files/upload`)
        xhr.send(formData)
    })
}