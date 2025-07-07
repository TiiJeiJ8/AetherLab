# 分块上传功能实现说明

## 功能概述
为 Fuck-Charts 项目的文件上传功能添加了智能分块上传功能，支持大文件的可靠上传和进度显示。

## 主要特性

### 1. 智能上传策略
- **文件大小阈值**: 10MB
- **分块大小**: 2MB
- **最大并发分块数**: 3个
- **自动降级**: 大文件使用分块上传，小文件使用普通上传

### 2. 分块上传流程
1. **初始化会话**: 向后端发送文件信息，获取上传会话ID
2. **并发分块上传**: 将文件分割成多个分块，并发上传
3. **进度监控**: 实时更新上传进度
4. **完成合并**: 所有分块上传完成后，通知后端合并文件

### 3. 用户体验优化
- **实时进度条**: 带有动画效果的进度条显示
- **取消上传**: 用户可以随时取消正在进行的上传
- **状态标识**: 清晰的上传状态显示（本地、上传中、已上传、错误）
- **错误处理**: 上传失败时自动保存到本地缓存

### 4. 技术特点
- **断点续传友好**: 设计支持后端实现断点续传
- **内存优化**: 分块读取文件，避免大文件占用过多内存
- **网络优化**: 并发控制，避免过多网络请求
- **取消机制**: 基于 AbortController 的取消机制

## 文件结构

### 前端文件
- `src/services/FileServices.js` - 文件服务，包含分块上传逻辑
- `src/components/FileUploadModal.vue` - 文件上传界面，包含进度显示

### 新增功能点
1. **分块上传函数** (`chunkUpload`)
2. **普通上传函数** (`normalUpload`)
3. **取消上传函数** (`cancelUpload`)
4. **进度回调机制**
5. **上传状态管理**

## API 接口设计

### 后端需要实现的接口

#### 1. 初始化分块上传
```
POST /api/files/chunk-upload/init
Content-Type: application/json

{
  "fileId": "unique-file-id",
  "fileName": "example.xlsx",
  "fileSize": 52428800,
  "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "totalChunks": 25,
  "uploadId": "unique-upload-session-id"
}

Response:
{
  "uploadId": "session-id",
  "success": true
}
```

#### 2. 上传分块
```
POST /api/files/chunk-upload/chunk
Content-Type: multipart/form-data

Form Data:
- uploadId: "session-id"
- chunkIndex: 0
- chunk: [binary data]
- totalChunks: 25

Response:
{
  "success": true,
  "chunkIndex": 0
}
```

#### 3. 完成分块上传
```
POST /api/files/chunk-upload/complete
Content-Type: application/json

{
  "uploadId": "session-id",
  "fileId": "unique-file-id"
}

Response:
{
  "fileId": "server-file-id",
  "fileName": "example.xlsx",
  "fileSize": 52428800,
  "success": true
}
```

## 配置参数

```javascript
// 可调整的配置参数
const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB per chunk
const CHUNK_SIZE_THRESHOLD = 10 * 1024 * 1024 // 10MB threshold
const MAX_CONCURRENT_CHUNKS = 3 // 最大并发分块数
```

## 使用示例

```javascript
// 上传文件带进度回调
const result = await uploadFile(file, (progress) => {
    console.log(`上传进度: ${progress.percentage}%`)
    console.log(`已上传: ${progress.loaded}/${progress.total} bytes`)
})

// 取消上传
const cancelled = cancelUpload(fileId)
```

## 优势

1. **大文件支持**: 支持上传几GB的大文件
2. **网络稳定性**: 分块上传降低网络中断的影响
3. **用户体验**: 实时进度反馈和取消功能
4. **资源优化**: 内存使用更加合理
5. **错误恢复**: 上传失败时的优雅降级

## 后续优化建议

1. **断点续传**: 后端实现分块的断点续传功能
2. **并发优化**: 根据网络状况动态调整并发数
3. **压缩上传**: 对文本文件进行压缩后上传
4. **MD5校验**: 添加文件完整性校验
5. **上传队列**: 支持多文件队列上传

## 测试建议

1. **大文件测试**: 测试 100MB+ 的文件上传
2. **网络中断测试**: 模拟网络中断情况
3. **并发测试**: 同时上传多个文件
4. **取消测试**: 测试上传过程中的取消功能
5. **错误处理测试**: 测试各种错误情况的处理

---

此功能已经集成到项目中，前端代码已完成，后端需要实现对应的 API 接口。
