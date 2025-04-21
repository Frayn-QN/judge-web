<template>
  <div class="markdown-converter">
    <!-- 输入方式切换 -->
    <el-radio-group v-model="inputType"
                    class="input-type">
      <el-radio-button label="text">文本输入</el-radio-button>
      <el-radio-button label="file">文件上传</el-radio-button>
    </el-radio-group>

    <!-- 文本输入区域 -->
    <el-input v-if="inputType === 'text'"
              v-model="markdownText"
              type="textarea"
              :rows="10"
              placeholder="请输入Markdown内容"
              class="input-area"
              @input="handleInput" />

    <!-- 文件上传区域 -->
    <el-upload v-else
               class="upload-box"
               action=""
               :show-file-list="false"
               :before-upload="handleFileUpload">
      <el-button type="primary">
        <i class="el-icon-upload" />
        点击上传.md文件
      </el-button>
    </el-upload>

    <!-- 结果展示 -->
    <div v-if="jsonResult"
         class="result-box">
      <h3>生成的JSON字符串：</h3>
      <pre class="json-output">{{ jsonResult }}</pre>
      <el-button type="success"
                 class="copy-btn"
                 @click="copyResult">
        复制结果
      </el-button>
    </div>
  </div>
</template>

  <script>
export default {
  name: 'MarkdownToJson',
  data () {
    return {
      inputType: 'text', // 输入类型
      markdownText: '', // 文本内容
      fileContent: '', // 文件内容
      jsonResult: '' // 生成的JSON字符串
    }
  },
  computed: {
    // 获取当前内容
    currentContent () {
      return this.inputType === 'text'
        ? this.markdownText
        : this.fileContent
    }
  },
  methods: {
    // 处理文本输入
    handleInput () {
      this.generateJson()
    },

    // 处理文件上传
    handleFileUpload (file) {
      const reader = new FileReader()
      reader.onload = e => {
        this.fileContent = this.normalizeNewlines(e.target.result)
        this.generateJson()
      }
      reader.readAsText(file)
      return false // 阻止默认上传
    },

    // 统一换行符为\n
    normalizeNewlines (content) {
      return content
        .replace(/\r\n/g, '\n') // 替换Windows换行
        .replace(/\r/g, '\n') // 替换旧Mac换行
    },

    // 生成JSON字符串
    generateJson () {
      try {
        const jsonData = {
          content: this.currentContent,
          timestamp: new Date().toISOString(),
          source: this.inputType
        }

        this.jsonResult = JSON.stringify(jsonData, null, 2)
      } catch (error) {
        console.error('生成JSON失败:', error)
        this.$message.error('转换失败，请检查输入内容')
      }
    },

    // 复制结果
    copyResult () {
      navigator.clipboard.writeText(this.jsonResult)
        .then(() => this.$message.success('复制成功！'))
        .catch(() => this.$message.error('复制失败'))
    }
  }
}
  </script>

  <style lang="scss" scoped>
.markdown-converter {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;

  .input-type {
    margin-bottom: 20px;
  }

  .input-area {
    margin: 15px 0;
  }

  .upload-box {
    margin: 20px 0;
    text-align: center;
  }

  .result-box {
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;

    h3 {
      color: #303133;
      margin-bottom: 15px;
    }
  }

  .json-output {
    padding: 15px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    white-space: pre-wrap;
    font-family: Consolas, Monaco, monospace;
    line-height: 1.6;
  }

  .copy-btn {
    margin-top: 15px;
  }
}
</style>
