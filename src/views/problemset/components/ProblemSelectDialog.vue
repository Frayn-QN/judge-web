<template>
  <el-dialog title="添加题目"
             :visible.sync="visible"
             width="80%"
             top="5vh">
    <div class="dialog-content">
      <el-input v-model="searchKey"
                placeholder="输入题目名称或编号"
                clearable
                style="margin-bottom: 15px"
                @change="handleSearch" />

      <ProblemList :data="problems"
                   :selectable="true"
                   :loading="loading"
                   :total="total"
                   :current-page="pageNum"
                   :page-size="pageSize"
                   @selection-change="handleSelectionChange"
                   @page-change="handlePageChange"
                   @size-change="handleSizeChange" />
    </div>

    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :loading="submitting"
                 @click="handleSubmit">添加选中题目（{{ selected.length }}）</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ProblemList from '@/components/List/ProblemList'
import { loadProblem, searchProblem } from '@/api/problem'
import { addProblem } from '@/api/problemset'
import Page from '@/entity/Page'

export default {
  components: { ProblemList },

  data () {
    return {
      visible: false,
      searchKey: '',
      selected: [],
      problems: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      submitting: false,
      psetID: null
    }
  },

  methods: {
    open (psetID) {
      this.psetID = psetID
      this.visible = true
      this.loadProblems()
    },

    async loadProblems () {
      this.loading = true
      try {
        const page = new Page(this.pageNum)
        page.pageSize = this.pageSize

        const res = this.keyword
          ? await searchProblem(page, this.keyword)
          : await loadProblem(page)
        this.problems = res.data.list
        this.total = res.data.total
      } catch (error) {
        console.error('题目加载失败:', error)
      } finally {
        this.loading = false
      }
    },

    handleSearch () {
      this.pageNum = 1
      this.loadProblems()
    },

    handlePageChange (page) {
      this.pageNum = page
      this.loadProblems()
    },

    handleSizeChange (size) {
      this.pageSize = size
      this.loadProblems()
    },

    handleSelectionChange (selection) {
      this.selected = selection.map(p => p.id)
    },

    async handleSubmit () {
      if (this.selected.length === 0) return

      this.submitting = true
      let successCount = 0
      const errorList = []

      try {
        // 逐个添加题目
        for (const problemID of this.selected) {
          try {
            await addProblem(this.psetID, problemID)
            successCount++
          } catch (error) {
            console.error(`题目 [${problemID}] 添加失败:`, error)
            errorList.push({
              id: problemID,
              message: error.message || '未知错误'
            })
          }
        }

        // 处理最终结果
        if (successCount > 0) {
          this.$message.success(`成功添加 ${successCount} 道题目`)
          this.$emit('added')

          if (errorList.length > 0) {
            this.$alert(
              `以下题目添加失败：\n${errorList.map(e => `#${e.id}: ${e.message}`).join('\n')}`,
              '部分添加失败',
              { type: 'warning' }
            )
          } else {
            this.visible = false
          }
        } else {
          this.$message.warning('未能成功添加任何题目')
        }
      } catch (error) {
        console.error('添加流程异常:', error)
        this.$message.error('题目添加过程发生异常')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
