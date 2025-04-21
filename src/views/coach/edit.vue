<template>
  <div class="edit-problem-container">
    <el-card v-loading="loading">
      <problem-form v-if="problemData"
                    ref="problemForm"
                    :init-data="problemData"
                    @submit="handleSubmit" />
    </el-card>
  </div>
</template>

  <script>
import { getProblemDetail, modifyProblem } from '@/api/problem'
import ProblemForm from './components/ProblemForm.vue'

export default {
  name: 'EditProblem',
  components: { ProblemForm },
  data () {
    return {
      loading: false,
      problemData: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const res = await getProblemDetail(this.$route.params.id)

        this.problemData = this.transformProblemData(res.data)
      } catch (error) {
        console.error('获取题目详情失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    transformProblemData (data) {
      return {
        ...data,
        example: this.parseFileList(data.example),
        expectation: this.parseFileList(data.expectation),
        extra: this.parseFileList(data.extra)
      }
    },

    parseFileList (json) {
      if (json === null) return null

      let fileList = []

      // 处理数组
      if (Array.isArray(json)) {
        fileList = json.flatMap(item => {
          return Object.entries(item).map(([fileName, content]) => ({
            fileName,
            content
          }))
        })
      }

      // 按文件名排序（自然排序）
      return fileList.sort((a, b) => {
        return a.fileName.localeCompare(b.fileName, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      })
    },

    async handleSubmit (rawFormData) {
      try {
        // 执行数据校验和转换
        const { isValid, formData } = this.validateAndTransformData(rawFormData)

        if (!isValid) return

        this.loading = true
        await modifyProblem(formData)
        this.$message.success('修改成功！')
      } catch (error) {
        this.$message.error(`修改失败: ${error.message || '未知错误'}`)
      } finally {
        this.loading = false
      }
    },

    validateAndTransformData (rawData) {
      const { example, expectation } = rawData
      console.log(expectation)

      // 校验基本数量
      if (example.length !== expectation.length) {
        this.$message.error('测试用例与预期输出数量不一致')
        return { isValid: false }
      }

      // 创建文件名映射表
      const expectMap = new Map()
      expectation.forEach(file => {
        const baseName = file.fileName.replace(/\.out$/i, '')
        expectMap.set(baseName, file)
      })

      // 校验文件对应关系
      const mismatches = example.filter(inFile => {
        const baseName = inFile.fileName.replace(/\.in$/i, '')
        return !expectMap.has(baseName)
      })

      if (mismatches.length > 0) {
        this.$message.error(`发现${mismatches.length}个未匹配的测试用例`)
        return { isValid: false }
      }

      // 生成排序后的文件对
      const sortedPairs = example.map(inFile => {
        const baseName = inFile.fileName.replace(/\.in$/i, '')
        return {
          inFile,
          outFile: expectation.find(f =>
            f.fileName.replace(/\.out$/i, '') === baseName
          )
        }
      }).sort((a, b) =>
        a.inFile.fileName.localeCompare(b.inFile.fileName, undefined, { numeric: true })
      )

      // 重命名文件并生成新数据
      const newExample = []
      const newExpectation = []

      sortedPairs.forEach((pair, index) => {
        const seq = index + 1

        // 处理输入文件
        newExample.push({
          ...pair.inFile,
          fileName: `${seq}.in`,
          originalName: pair.inFile.fileName // 保留原始文件名
        })

        // 处理输出文件
        newExpectation.push({
          ...pair.outFile,
          fileName: `${seq}.out`,
          originalName: pair.outFile.fileName
        })
      })

      return {
        isValid: true,
        formData: {
          ...rawData,
          testCount: sortedPairs.length,
          example: this.formatFileList(newExample),
          expectation: this.formatFileList(newExpectation)
        }
      }
    },

    // 文件列表格式化
    formatFileList (files) {
      return files.reduce((acc, file) => {
        acc[file.fileName] = file.content
        return acc
      }, {})
    }
  }
}
  </script>

  <style scoped>
.edit-problem-container {
  padding: 20px;
}
</style>
