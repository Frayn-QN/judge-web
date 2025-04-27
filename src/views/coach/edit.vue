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
      const parser = files =>
        (files || []).flatMap(item =>
          Object.entries(item).map(([name, content]) => ({ fileName: name, content }))
        ).sort(this.naturalSort)
      return {
        ...data,
        example: parser(data.example),
        expectation: parser(data.expectation),
        extra: parser(data.extra)
      }
    },

    naturalSort (a, b) {
      return a.fileName.localeCompare(b.fileName, undefined, { numeric: true })
    },

    async handleSubmit (formData) {
      try {
        this.loading = true
        console.log(formData)
        await modifyProblem(formData)
        this.$message.success('修改成功！')
      } catch (error) {
        this.$message.error(`修改失败: ${error.message || '未知错误'}`)
      } finally {
        this.loading = false
      }
    }
  }
}
  </script>
