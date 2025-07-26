/* eslint-disable */
/**
 * 文件上传与管理相关的 API 服务
 * 支持前端缓存和后端同步的双模式工作
 */
import * as XLSX from 'xlsx'
const CACHE_KEY = 'fuck_charts_files'



/**
 * 从本地缓存获取文件列表
 * @returns {Array} 缓存的文件列表
 */
export function getCachedFiles() {
    try {
        const cached = localStorage.getItem(CACHE_KEY)
        return cached ? JSON.parse(cached) : []
    } catch (error) {
        console.error('Failed to read cache:', error)
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
        console.error('Failed to save to cache:', error)
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
        console.error('Failed to remove from cache:', error)
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

                // 自动将疑似日期/时间列的数字转为字符串
                const headers = jsonData[0] || [];
                const dateColIndexes = headers
                    .map((h, i) => /date|日期|时间/i.test(h) ? i : -1)
                    .filter(i => i !== -1);

                function excelDateToString(excelDate) {
                    if (typeof excelDate === 'number') {
                        const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
                        // 判断是否为整天
                        if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
                            return date.toISOString().slice(0, 10); // 只要日期
                        }
                        return date.toISOString().replace('T', ' ').slice(0, 19); // 日期+时间
                    }
                    return excelDate;
                }

                // 跳过header行，对每一行的日期/时间列做转换
                for (let r = 1; r < jsonData.length; r++) {
                    dateColIndexes.forEach(idx => {
                        jsonData[r][idx] = excelDateToString(jsonData[r][idx]);
                    });
                }

                //! 限制预览行数
                const previewData = jsonData.slice(0, 100)

                resolve({
                    data: jsonData,
                    totalRows: jsonData.length,
                    totalColumns: jsonData[0] ? jsonData[0].length : 0,
                    headers: jsonData[0] || [],
                    previewData: previewData // 单独返回预览行数
                })
            } catch (error) {
                console.error('File parsing failed:', error)
                reject(new Error('File parsing failed: ' + error.message))
            }
        }

        reader.onerror = () => reject(new Error('File reading failed'))

        if (file.name.toLowerCase().endsWith('.csv')) {
            reader.readAsText(file, 'UTF-8')
        } else {
            reader.readAsArrayBuffer(file)
        }
    })
}

/**
 * 上传文件（本地缓存模式，无后端）
 * @param {File} file - 要上传的文件对象
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise} 上传结果
 */
export async function uploadFile(file, onProgress) {
    try {
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
            data: parsedContent.data, // 完整数据
            previewData: parsedContent.previewData, // 预览数据
            file: file // 保存原始文件对象
        }
        saveToCache(fileInfo)
        return fileInfo
    } catch (error) {
        console.error('File processing failed:', error)
        throw new Error('File processing failed: ' + error.message)
    }
}

/**
 * 获取文件预览数据（本地缓存模式）
 * @param {string} fileId - 文件ID
 * @returns {Promise} 文件预览数据
 */
export async function getFilePreview(fileId) {
    const cachedFiles = getCachedFiles()
    const cachedFile = cachedFiles.find(file => file.id === fileId)
    if (cachedFile && cachedFile.previewData) {
        return {
            data: cachedFile.previewData,
            totalRows: cachedFile.rows,
            totalColumns: cachedFile.columns,
            headers: cachedFile.headers
        }
    }
    throw new Error('File preview not available')
}



/**
 * 获取所有文件列表（本地缓存模式）
 * @returns {Promise<Array>} 文件列表
 */
export async function getAllFiles() {
    return getCachedFiles()
}

/**
 * 删除文件（本地缓存模式）
 * @param {string} fileId - 要删除的文件ID
 */
export async function deleteFile(fileId) {
    const cachedFiles = getCachedFiles()
    const fileInfo = cachedFiles.find(file => file.id === fileId)
    if (!fileInfo) {
        throw new Error('File not found')
    }
    removeFromCache(fileId)
    return { success: true }
}

/**
 * 重命名文件（本地缓存模式）
 * @param {string} fileId - 文件ID
 * @param {string} newName - 新文件名
 */
export async function renameFile(fileId, newName) {
    const cachedFiles = getCachedFiles()
    const fileInfo = cachedFiles.find(file => file.id === fileId)
    if (!fileInfo) {
        throw new Error('File not found')
    }
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
