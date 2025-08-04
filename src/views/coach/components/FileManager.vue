<!-- FileManager.vue -->
<template>
  <div class="file-manager">
    <div class="header">
      <span class="title">{{ label }}</span>
      <el-upload ref="uploadRef"
                 multiple
                 action=""
                 :auto-upload="false"
                 :on-change="handleFileChange"
                 :show-file-list="false">
        <el-button type="primary">选择文件</el-button>
        <br>
        <span class="extension-tip">{{ extensionTip }}</span>
      </el-upload>
    </div>

    <div class="file-grid">
      <div v-for="file in files"
           :key="file.fileName"
           class="file-card">
        <div class="file-info">
          <i class="el-icon-document" />
          <span class="file-name">{{ file.fileName }}</span>
        </div>
        <el-button class="delete-btn"
                   type="danger"
                   icon="el-icon-delete"
                   @click="handleRemove(file.fileName)" />
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  props: {
    label: String,
    files: Array,
    extension: String
  },
  data () {
    return {
      pendingFiles: [] // 临时存储待处理的文件
    }
  },
  computed: {
    extensionTip () {
      return this.extension ? `扩展名要求：${this.extension}` : '支持任意文件类型'
    }
  },
  created () {
    // 创建防抖处理函数（500ms内无新操作则执行）
    this.debouncedProcess = debounce(this.processPendingFiles, 500)
  },
  methods: {
    handleFileChange (file, fileList) {
      // 过滤出新增的原始文件（避免重复）
      const newFiles = fileList
        .map(f => f.raw)
        .filter(rawFile =>
          !this.pendingFiles.some(pf => pf.name === rawFile.name)
        )

      // 合并到待处理列表
      this.pendingFiles = [...this.pendingFiles, ...newFiles]

      // 触发防抖处理
      this.debouncedProcess()
    },

    async processPendingFiles () {
      if (this.pendingFiles.length === 0) return

      // 处理文件并发送事件
      const processed = await this.processFiles(this.pendingFiles)
      this.$emit('add', processed)

      // 清空状态
      this.pendingFiles = []
      this.$refs.uploadRef.clearFiles()
    },

    async processFiles (rawFiles) {
      const results = []
      for (const file of rawFiles) {
        if (this.extension && !file.name.endsWith(this.extension)) continue
        try {
          const content = await this.readFile(file)
          results.push({ fileName: file.name, content })
        } catch (error) {
          console.error('文件读取失败:', error)
        }
      }
      return results
    },

    readFile (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target.result
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            const CHUNK_SIZE = 32768 // 32KB

            // 分块处理大文件
            for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
              const chunk = bytes.subarray(i, i + CHUNK_SIZE)
              binary += String.fromCharCode.apply(null, chunk)
            }

            // 生成标准 Base64
            const base64 = btoa(binary)

            // 验证编码结果
            if (base64.length % 4 !== 0) {
              throw new Error('非标准 Base64 编码')
            }

            resolve(base64)
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    },

    handleRemove (fileName) {
      this.$emit('remove', fileName)
    }
  }
}
  </script>

<style lang="scss" scoped>
.file-manager {
  margin: 16px 0;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-weight: 600;
  color: #303133;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.file-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #f8f9fa;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .delete-btn {
      opacity: 1;
    }
  }
}

.file-info {
  flex: 1;
  overflow: hidden;
}

.file-icon {
  margin-right: 8px;
  color: #409eff;
  font-size: 18px;
}

.file-name {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
